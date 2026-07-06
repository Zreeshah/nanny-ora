"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatDate, getInitials } from "@/lib/utils";
import { ShieldAlert, AlertTriangle, ArrowLeft, Send } from "lucide-react";
import { getConversation, sendMessage } from "@/server/actions/messages";

type Msg = { id: string; senderId: string; body: string; flagged: boolean; createdAt: string | Date };
type Convo = { parentName: string; nannyName: string; status: string; myRole: string; myUserId: string; messages: Msg[] };

export default function ConversationThread({ enquiryId, backHref }: { enquiryId: string; backHref: string }) {
  const [convo, setConvo] = useState<Convo | null>(null);
  const [loadError, setLoadError] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [caution, setCaution] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = () =>
    getConversation(enquiryId).then((r) => {
      if (r.success) setConvo(r.data as Convo);
      else setLoadError(r.error || "Could not load this conversation.");
    });

  useEffect(() => {
    load();
    const t = setInterval(load, 15000); // lazy realtime: poll while the thread is open
    return () => clearInterval(t);
  }, [enquiryId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convo?.messages.length]);

  const handleSend = async () => {
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setCaution(false);
    const res = await sendMessage(enquiryId, text);
    setSending(false);
    if (!res.success) { setCaution(false); setLoadError(res.error || "Could not send."); return; }
    setBody("");
    if (res.data?.flagged) setCaution(true);
    await load();
  };

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto text-center py-10">
        <p className="text-sm text-destructive mb-4" role="alert">{loadError}</p>
        <Link href={backHref}><Button variant="outline" size="sm" className="rounded-full">Back to messages</Button></Link>
      </div>
    );
  }
  if (!convo) return <p className="text-sm text-muted-foreground py-10 text-center">Loading conversation…</p>;

  const other = convo.myRole === "PARENT" ? convo.nannyName : convo.parentName;
  const readOnly = convo.myRole === "ADMIN";

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Link href={backHref} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="font-heading text-xl text-foreground leading-tight">
            {readOnly ? `${convo.parentName} → ${convo.nannyName}` : other}
          </h1>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{convo.status}</span>
        </div>
      </div>

      {/* Standing safety warning */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-4">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span>Keep it on NannyOra. For your safety, don&apos;t share personal contact details (email, phone) or move the conversation off-platform.</span>
      </div>

      <Card className="rounded-3xl border-border/40 p-4 sm:p-5">
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {convo.messages.map((m) => {
            const mine = m.senderId === convo.myUserId;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`rounded-2xl px-3.5 py-2.5 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-foreground"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 px-1">
                    {m.flagged && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600">
                        <AlertTriangle className="w-3 h-3" aria-hidden="true" /> contact info
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{formatDate(m.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {readOnly ? (
          <p className="text-xs text-muted-foreground text-center mt-4 pt-3 border-t border-border/30">Admin view — read only.</p>
        ) : (
          <div className="mt-4 pt-4 border-t border-border/30">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Message ${other}…`}
              className="min-h-[70px] rounded-2xl"
              maxLength={2000}
            />
            {caution && (
              <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Your message looks like it contains contact details — it&apos;s been flagged. Please keep contact on-platform.
              </p>
            )}
            <div className="flex justify-end mt-2">
              <Button variant="primary" size="sm" isLoading={sending} onClick={handleSend} className="rounded-full">
                <Send className="w-4 h-4 mr-1.5" aria-hidden="true" /> Send
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
