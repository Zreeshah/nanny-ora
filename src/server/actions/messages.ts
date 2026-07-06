"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { detectContactInfo } from "@/lib/moderation";
import { sendNewMessageNotification } from "@/lib/email";
import { sendSms } from "@/lib/sms";
import type { ActionResult } from "./auth";

const SITE_URL = process.env.NEXTAUTH_URL || "https://www.nannyora.co.nz";
const BODY_MAX = 2000;

// in-memory throttles (per-lambda). ponytail: move to a DB column if it matters.
const lastSend = new Map<string, number>(); // userId → ts (anti-spam, 2s)
const lastSms = new Map<string, number>(); // `${userId}:${enquiryId}` → ts (SMS digest, 10min)

type Party = { enquiry: any; myRole: "PARENT" | "NANNY" | "ADMIN"; userId: string };

/** Load the enquiry + confirm the caller is its parent, its nanny, or an admin. */
async function loadParty(enquiryId: string): Promise<Party | { error: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "You must be signed in." };
  const role = (session!.user as any).role;

  const enquiry = await prisma.enquiry.findUnique({
    where: { id: enquiryId },
    include: {
      parent: { select: { id: true, name: true, email: true, phone: true } },
      nanny: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
    },
  });
  if (!enquiry) return { error: "Conversation not found." };

  if (role === "ADMIN") return { enquiry, myRole: "ADMIN", userId };
  if (enquiry.parentId === userId) return { enquiry, myRole: "PARENT", userId };
  if (enquiry.nanny.user.id === userId) return { enquiry, myRole: "NANNY", userId };
  return { error: "Unauthorised" };
}

/** Full thread: seed enquiry message (from parent) + all replies, oldest first. */
export async function getConversation(enquiryId: string): Promise<ActionResult> {
  try {
    const p = await loadParty(enquiryId);
    if ("error" in p) return { success: false, error: p.error };
    const { enquiry, myRole, userId } = p;

    const replies = await prisma.message.findMany({
      where: { enquiryId },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    if (myRole !== "ADMIN") {
      // best-effort read marker — powers unread counts
      await prisma.conversationRead.upsert({
        where: { enquiryId_userId: { enquiryId, userId } },
        create: { enquiryId, userId },
        update: { lastReadAt: new Date() },
      }).catch(() => {});
    }

    const messages = [
      { id: `seed-${enquiry.id}`, senderId: enquiry.parentId, body: enquiry.message, flagged: enquiry.flagged, createdAt: enquiry.createdAt },
      ...replies.map((m) => ({ id: m.id, senderId: m.senderId, body: m.body, flagged: m.flagged, createdAt: m.createdAt })),
    ];

    return {
      success: true,
      data: {
        enquiryId: enquiry.id,
        parentName: enquiry.parent.name,
        nannyName: enquiry.nanny.user.name,
        status: enquiry.status,
        myRole,
        myUserId: userId,
        messages,
      },
    };
  } catch (error) {
    console.error("getConversation error:", error);
    return { success: false, error: "Failed to load conversation." };
  }
}

/** Post a reply. Parties only (admin can read but not post). Flags contact info; notifies the other party. */
export async function sendMessage(enquiryId: string, body: string): Promise<ActionResult> {
  try {
    const p = await loadParty(enquiryId);
    if ("error" in p) return { success: false, error: p.error };
    const { enquiry, myRole, userId } = p;
    if (myRole === "ADMIN") return { success: false, error: "Admins can view but not post in conversations." };

    const text = (body || "").trim();
    if (!text) return { success: false, error: "Message can't be empty." };
    if (text.length > BODY_MAX) return { success: false, error: `Message is too long (max ${BODY_MAX} characters).` };

    const now = Date.now();
    if ((lastSend.get(userId) ?? 0) > now - 2000) return { success: false, error: "You're sending messages too quickly." };
    lastSend.set(userId, now);

    const { flagged } = detectContactInfo(text);

    await prisma.$transaction([
      prisma.message.create({ data: { enquiryId, senderId: userId, body: text, flagged } }),
      prisma.enquiry.update({ where: { id: enquiryId }, data: { updatedAt: new Date() } }),
    ]);

    // Notify the OTHER party (email every message; SMS throttled to a 10-min digest).
    const iAmParent = myRole === "PARENT";
    const me = iAmParent ? enquiry.parent : enquiry.nanny.user;
    const other = iAmParent ? enquiry.nanny.user : enquiry.parent;
    const threadUrl = `${SITE_URL}/dashboard/${iAmParent ? "nanny/enquiries" : "parent/messages"}/${enquiryId}`;

    if (other.email) await sendNewMessageNotification(other.name, other.email, me.name, threadUrl);
    const smsKey = `${other.id}:${enquiryId}`;
    if (other.phone && (lastSms.get(smsKey) ?? 0) <= now - 10 * 60 * 1000) {
      lastSms.set(smsKey, now);
      await sendSms({ to: other.phone, body: `New message from ${me.name} on NannyOra — open your dashboard to reply.` });
    }

    return { success: true, data: { flagged } };
  } catch (error) {
    console.error("sendMessage error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/** Inbox list for the current user (role-branched). Admin gets all + flagged counts. */
export async function getMyConversations(): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Unauthorised" };
    const role = (session!.user as any).role;

    const where =
      role === "ADMIN" ? {} : role === "NANNY" ? { nanny: { userId } } : { parentId: userId };

    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        parent: { select: { name: true } },
        nanny: { include: { user: { select: { name: true } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 20, select: { body: true, senderId: true, createdAt: true } },
        reads: role === "ADMIN" ? false : { where: { userId } },
        _count: { select: { messages: { where: { flagged: true } } } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return {
      success: true,
      data: enquiries.map((e) => {
        const last = e.messages[0];
        const lastRead = (e as any).reads?.[0]?.lastReadAt ? new Date((e as any).reads[0].lastReadAt).getTime() : 0;
        // unread = other-party messages newer than my read marker (+ the seed for the nanny)
        let unread = 0;
        if (role !== "ADMIN") {
          unread = e.messages.filter((m) => m.senderId !== userId && new Date(m.createdAt).getTime() > lastRead).length;
          if (role === "NANNY" && new Date(e.createdAt).getTime() > lastRead) unread += 1;
        }
        return {
          enquiryId: e.id,
          otherPartyName: role === "NANNY" ? e.parent.name : role === "PARENT" ? e.nanny.user.name : `${e.parent.name} → ${e.nanny.user.name}`,
          lastMessage: last ? last.body : e.message,
          lastAt: last ? last.createdAt : e.createdAt,
          status: e.status,
          unread,
          flaggedCount: ((e as any)._count?.messages ?? 0) + (e.flagged ? 1 : 0),
        };
      }),
    };
  } catch (error) {
    console.error("getMyConversations error:", error);
    return { success: false, error: "Failed to load conversations." };
  }
}

/** Total unread messages for the current user — powers the nav badge. Cheap zeros on failure. */
export async function getUnreadTotal(): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const role = (session?.user as any)?.role;
    if (!userId || role === "ADMIN") return { success: true, data: { unread: 0 } };

    const where = role === "NANNY" ? { nanny: { userId } } : { parentId: userId };
    const enquiries = await prisma.enquiry.findMany({
      where,
      select: {
        createdAt: true,
        messages: { select: { senderId: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 20 },
        reads: { where: { userId }, select: { lastReadAt: true } },
      },
      take: 50,
    });
    let unread = 0;
    for (const e of enquiries) {
      const lastRead = e.reads[0]?.lastReadAt?.getTime() ?? 0;
      unread += e.messages.filter((m) => m.senderId !== userId && m.createdAt.getTime() > lastRead).length;
      if (role === "NANNY" && e.createdAt.getTime() > lastRead) unread += 1;
    }
    return { success: true, data: { unread } };
  } catch (error) {
    console.error("getUnreadTotal error:", error);
    return { success: true, data: { unread: 0 } };
  }
}
