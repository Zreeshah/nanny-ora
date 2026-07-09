import { Accordion } from "@/components/ui/Accordion";
import { Users, Heart } from "lucide-react";
import { parentFaqs, nannyFaqs } from "@/lib/faq";

/** For Parents + For Nannies grouped FAQs — reused on home + how-it-works. */
export function FaqGroups() {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-heading text-xl text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" aria-hidden="true" />
          For Parents
        </h3>
        <Accordion items={parentFaqs} />
      </div>
      <div>
        <h3 className="font-heading text-xl text-foreground mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-accent" aria-hidden="true" />
          For Nannies
        </h3>
        <Accordion items={nannyFaqs} />
      </div>
    </div>
  );
}
