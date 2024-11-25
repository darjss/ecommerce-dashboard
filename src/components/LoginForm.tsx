"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FacebookIcon } from "@/lib/svg/FacebookIcon";
import { GoogleIcon } from "@/lib/svg/GoogleIcon";
import { signIn } from "@/server/actions/auth";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid username number"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must be at least 8 characters long, contain at least one uppercase letter and one number.",
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

async function loginAction(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const result = loginSchema.safeParse(rawFormData);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const signInResult = await signIn(null, formData);

  if (signInResult.error) {
    toast.error(signInResult.error);
    return { error: signInResult.error };
  }

  toast.success("Sign up successful");
  return { success: true };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full rounded-md bg-purple-500 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-purple-600"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

function ErrorMessage({ message }: { message: string | undefined }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <AlertCircle className="mr-1 h-4 w-4" />
      {message}
    </motion.div>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useFormState(loginAction, { errors: {} });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-purple-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="you@example.com"
                    required
                    className={`border-gray-200 pl-10 focus:border-purple-500 focus:ring-purple-500 ${
                      state.errors?.username ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {state.errors?.username && (
                    <ErrorMessage message={state.errors.username[0]} />
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-purple-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className={`border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${
                      state.errors?.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <AnimatePresence>
                  {state.errors?.password && (
                    <ErrorMessage message={state.errors.password[0]} />
                  )}
                </AnimatePresence>
              </div>
              <SubmitButton />
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <GoogleIcon />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <FacebookIcon />
                  Facebook
                </Button>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="#"
                className="font-medium text-purple-500 hover:text-purple-600"
              >
                Sign up now
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
