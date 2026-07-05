import ConversationThread from "@/components/messaging/ConversationThread";

export default async function AdminThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConversationThread enquiryId={id} backHref="/admin/enquiries" />;
}
