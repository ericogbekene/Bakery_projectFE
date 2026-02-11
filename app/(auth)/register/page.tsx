"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import ENDPOINTS from "@/constants/endpoints";
import useMessage from "@/hooks/use-message";
import useMutationAction from "@/hooks/use-mutation-action";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";
//import type { AxiosError } from "axios";

const registerSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z
    .email({
      message: "Please enter a valid email address.",
    })
    .min(1, "Email is required"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { alertMessage } = useMessage();

  const { mutateAsync, isPending } = useMutationAction<{
    message: string;
    user_id: string;
    access: string;
    email: string;
  }>({
    url: ENDPOINTS.CREATE_ACCOUNT,
    onSuccess: (data) => {
      alertMessage(data.message, "success");
      form.reset();
    },
    onError: (error: AxiosError) => {
      // Check if error has field-specific validation errors
      const data = error?.response?.data;
      let hasFieldErrors = false;
      // If data is an object and not null
      if (data && typeof data === "object" && !Array.isArray(data)) {
        // Try to treat as Record<string, string[]>
        const errorData = data as Record<string, string[]> & { detail?: string };
        Object.keys(errorData).forEach((fieldName) => {
          if (
            fieldName in form.getValues() &&
            Array.isArray(errorData[fieldName])
          ) {
            form.setError(fieldName as keyof RegisterFormValues, {
              type: "server",
              message: (errorData[fieldName] as string[])[0], // Take the first error message
            });
            hasFieldErrors = true;
          }
        });
        if (!hasFieldErrors) {
          alertMessage(errorData.detail || "An error occurred", "error");
        }
      } else {
        // fallback for unknown error shape
        alertMessage("An error occurred", "error");
      }
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    await mutateAsync(values);
  }

  return (
    <main className="bg-primary-100 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1
            className={cn(
              "text-dark-text text-4xl font-bold",
              poltawskiNowy.className,
            )}
          >
            Create Account
          </h1>
          <p className="text-text mt-2">Join our bakery family today</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={cn("w-full", isPending && "opacity-50")}
              size="lg"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <span className="text-text">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
