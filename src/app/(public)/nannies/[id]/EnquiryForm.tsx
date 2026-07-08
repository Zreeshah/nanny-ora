"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Send, CheckCircle } from "lucide-react";
import { createEnquiry } from "@/server/actions/enquiry";

export default function EnquiryForm({ nannyId, firstName, placementStatus }: { nannyId: string; firstName: string; placementStatus?: string }) {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [flagged, setFlagged] = useState(false);

  // Guests (or non-parent roles) are routed to registration, carrying the nanny id.
  if (status !== "loading" && role !== "PARENT") {
    return (
      <Card className="sticky top-24 border-l-4 border-l-accent">
        <h3 className="font-semibold text-foreground mb-2">Interested in {firstName}?</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Create a free family account to send an enquiry. All messages are private.
        </p>
        <Link href={`/register-family?nanny=${nannyId}`}>
          <Button variant="accent" fullWidth className="rounded-full shadow-lg">
            <Send className="w-4 h-4 mr-2" aria-hidden="true" />
            Send Enquiry
          </Button>
        </Link>
      </Card>
    );
  }

  if (sent) {
    return (
      <Card className="sticky top-24 border-l-4 border-l-badge-verified">
        <div className="flex items-center gap-2 text-badge-verified mb-2">
          <CheckCircle className="w-5 h-5" aria-hidden="true" />
          <h3 className="font-semibold">Enquiry sent</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          We&apos;ve passed your message to our team and emailed you a confirmation. We&apos;ll be in touch shortly.
        </p>
        {flagged && (
          <p className="text-[11px] text-amber-600 mt-2">
            Heads up: your message looks like it contains contact details. For your safety, keep contact on NannyOra.
          </p>
        )}
      </Card>
    );
  }

  const handleSend = async () => {
    setError("");
    const contactEmail = email || session?.user?.email || "";
    if (message.trim().length < 10) {
      setError("Please write a message of at least 10 characters.");
      return;
    }
    if (!contactEmail) {
      setError("Please provide a contact email.");
      return;
    }
    setSending(true);
    const res = await createEnquiry({ nannyId, message: message.trim(), contactEmail });
    setSending(false);
    if (!res.success) {
      setError(res.error || "Something went wrong. Please try again.");
      return;
    }
    setFlagged(!!res.data?.flagged);
    setSent(true);
  };

  return (
    <Card className="sticky top-24 border-l-4 border-l-accent">
      <h3 className="font-semibold text-foreground mb-2">Interested in {firstName}?</h3>
      {placementStatus && placementStatus !== "AVAILABLE" ? (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4">
          {firstName} is currently placed. You can message them to register interest for when they&apos;re available again.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mb-4">
          Send an enquiry to connect with this nanny. All messages are private.
        </p>
      )}
      <div className="space-y-3">
        <Textarea
          name="message"
          label="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi ${firstName}, we're looking for...`}
          className="min-h-[96px] rounded-2xl"
        />
        <Input
          name="contactEmail"
          type="email"
          label="Contact email"
          value={email || session?.user?.email || ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="rounded-2xl"
        />
        {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
        <Button variant="accent" fullWidth isLoading={sending} onClick={handleSend} className="rounded-full shadow-lg">
          <Send className="w-4 h-4 mr-2" aria-hidden="true" />
          Send Enquiry
        </Button>
      </div>
    </Card>
  );
}
