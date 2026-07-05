import ConversationThread from "@/components/messaging/ConversationThread";

export default async function ParentThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConversationThread enquiryId={id} backHref="/dashboard/parent/messages" />;
}
