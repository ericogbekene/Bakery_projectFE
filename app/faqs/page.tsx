import Container from "@/components/shared/container";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { FAQS } from ".";

export default function Page() {
  return (
    <main className="space-y-8 pb-12">
      <section className="bg-primary-100">
        <Container className="max-w-5xl space-y-4 py-12 text-center max-lg:py-8">
          <h2
            className={cn(
              "mb-3 text-2xl font-semibold lg:text-4xl",
              poltawskiNowy.className,
            )}
          >
            Frequently Asked Questions
          </h2>
          <p>
            These FAQs and answers have been curated to answer all the basic and
            important questions you have about our product. If you still have
            further questions after reading this, you can contact our customer
            care line and we wil be there to answer.
          </p>
        </Container>
      </section>
      <Container className="grid grid-cols-1 gap-8 gap-x-12 py-6 lg:grid-cols-2">
        {FAQS.map((faq, index) => (
          <div key={index} className="flex items-start gap-4">
            <faq.icon className="text-primary h-6 w-6" />
            <div className="flex-1 space-y-1">
              <h6 className="text-dark-text text-lg font-semibold">
                {faq.question}
              </h6>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </Container>
    </main>
  );
}
