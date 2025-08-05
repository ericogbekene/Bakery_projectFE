"use client";

import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email().min(1, "Email is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  photo: z.instanceof(File).optional(),
  message: z.string().min(1, "Message is required"),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      message: undefined,
      phone_number: undefined,
      photo: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <main>
      <Container className="my-12 space-y-8 lg:my-16">
        <header className="text-center">
          <h2
            className={cn(poltawskiNowy.className, "mb-1 text-3xl lg:text-4xl")}
          >
            Custom Orders
          </h2>
          <p>
            Have a vision for your dream cake, dessert, or pastry? Let us bring
            it to life!
          </p>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto max-w-2xl space-y-6"
          >
            <div className="grid grid-cols-1 space-y-6 gap-x-6 md:grid-cols-2">
              <FormField
                name="first_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="First name"
                        className="bg-custom-green-100 h-14 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="last_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Last name"
                        className="bg-custom-green-100 h-14 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Email Address"
                        type="email"
                        className="bg-custom-green-100 h-14 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Phone Number"
                        type="tel"
                        className="bg-custom-green-100 h-14 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="photo"
              control={form.control}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      className="bg-custom-green-100 h-14 w-full"
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us if you want a 'Happy Birthday' written on the cake or cake board or any  extra information"
                      className="bg-custom-green-100 w-full h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size={"lg"} className="w-full">
              Submit Order
            </Button>
          </form>
        </Form>
      </Container>
    </main>
  );
}
