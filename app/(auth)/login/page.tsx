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

const loginSchema = z.object({
  email: z
    .email({
      message: "Please enter a valid email address.",
    })
    .min(1, "Email is required"),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { alertMessage } = useMessage();

  const { mutateAsync, isPending } = useMutationAction<T.LoginResponse>({
    url: ENDPOINTS.LOGIN,
    onSuccess: (data) => {
      alertMessage(data.message, "success");
    },
    onError: (error: any) => {
      alertMessage(
        error?.response?.data?.detail || "An error occurred",
        "error",
      );
    },
  });

  async function onSubmit(values: LoginFormValues) {
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
            Welcome Back
          </h1>
          <p className="text-text mt-2">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="off"
          >
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
                    <PasswordInput
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-primary text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className={cn("w-full", isPending && "opacity-50")}
              size="lg"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <span className="text-text">Don&apos;t have an account? </span>
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
