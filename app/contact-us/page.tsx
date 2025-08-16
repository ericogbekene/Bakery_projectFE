import Container from "@/components/shared/container";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import ContactForm from "./contact-form";

export default function Page() {
  return (
    <main>
      <section className="bg-primary-100">
        <Container
          className={cn("py-8 text-center lg:py-12", poltawskiNowy.className)}
        >
          <h6 className="mb-4 text-2xl font-semibold max-lg:text-lg">
            CONTACT US
          </h6>
          <p className="text-dark-text mb-16 text-2xl font-semibold lg:text-4xl">
            We’d love to talk to you{" "}
          </p>
        </Container>
      </section>
      <Container
        className={cn(
          "-mt-12 flex justify-center gap-8 max-lg:flex-col",
          poltawskiNowy.className,
        )}
      >
        <div className="text-dark-text w-[90%] max-w-xs rounded bg-white px-8 py-6 text-center text-lg shadow max-lg:mx-auto lg:text-2xl">
          Our availability
        </div>
        <div className="w-[90%] max-w-xs space-y-1 rounded bg-white px-8 py-6 text-center shadow max-lg:mx-auto">
          <p className="lg:text-lg">8am - 7pm</p>
          <p className="text-dark-text text-lg lg:text-xl">Monday - Saturday</p>
        </div>
      </Container>
      <Container
        className={cn("py-8 text-center lg:py-12", poltawskiNowy.className)}
      >
        <h6 className="mb-4 text-2xl font-semibold max-lg:text-lg">
          LET&apos;S GET STARTED
        </h6>
        <p className="text-dark-text text-xl font-semibold lg:text-3xl">
          We’re here to listen, collaborate, and create
        </p>
      </Container>
      <Container className="grid grid-cols-1 gap-8 gap-x-12 py-6 lg:grid-cols-[4fr_3fr]">
        <ContactForm />
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded px-5 py-6 shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4DDE7]">
              <PhoneIcon className="text-primary h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h6 className="text-dark-text font-semibold lg:text-lg">
                Phone number
              </h6>
              <p className="max-lg:text-sm">+2348100009968</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded px-5 py-6 shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4DDE7]">
              <PhoneIcon className="text-primary h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h6 className="text-dark-text font-semibold lg:text-lg">
                WhatsApp
              </h6>
              <p className="max-lg:text-sm">+2348100009968</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded px-5 py-6 shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4DDE7]">
              <MailIcon className="text-primary h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h6 className="text-dark-text font-semibold lg:text-lg">
                Email Address
              </h6>
              <p className="max-lg:text-sm">mandccakess@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded px-5 py-6 shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4DDE7]">
              <MapPinIcon className="text-primary h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h6 className="text-dark-text font-semibold lg:text-lg">
                Location
              </h6>
              <p className="max-lg:text-sm">
                49 Rufus Aigbodun Cresent
                <br />
                Jahi Abuja
              </p>
            </div>
          </div>
        </div>
      </Container>
      <Container className="py-8 text-center lg:py-12 max-w-2xl">
        <h6
          className={cn(
            "text-dark-text mb-4 text-xl font-semibold lg:text-3xl",
            poltawskiNowy.className,
          )}
        >
          How helpful were we today?
        </h6>
        <p>
          Your feedback is the secret ingredient to our success - Share your
          thoughts with us !{" "}
          <span className="text-primary">Send us a message.</span>
        </p>
      </Container>
    </main>
  );
}
