"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,

} from "lucide-react";
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
import { toast } from "sonner";
import { signup } from "@/server/actions/auth";

const signUpSchema = z
  .object({
    username: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid username number"),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters long, contain at least one uppercase letter and one number.",
      ),
    repassword: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters long, contain at least one uppercase letter and one number.",
      ),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });
type SignUpFormData = z.infer<typeof signUpSchema>;

async function signUpAction(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const result = signUpSchema.safeParse(rawFormData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    Object.values(errors).forEach((error) => {
      if (error) toast.error(error[0]);
    });
    return { errors };
  }
  console.log("Sign up attempt with:", formData.get("username"));
  const signupResult = await signup(null, formData);

  if (signupResult.error) {
    toast.error(signupResult.error);
    return { error: signupResult.error };
  }

  toast.success("Sign up successful");
  return { success: true };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full rounded-md px-4 py-2 font-semibold text-white transition duration-300 ease-in-out"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing up...
        </>
      ) : (
        "Sign up"
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

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useFormState(signUpAction, { errors: {} });

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
              Create an Account
            </CardTitle>
            <CardDescription className="primary-text text-center">
              Enter your details to sign up for a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  username Number
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="tel"
                    placeholder="99999999"
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
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
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
              <div className="space-y-2">
                <Label
                  htmlFor="repassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="repassword"
                    name="repassword"
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
                  {state.errors?.repassword && (
                    <ErrorMessage message={state.errors.repassword[0]} />
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
                    Or sign up with
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
              Already have an account?{" "}
              <Link
                href="#"
                className="font-medium text-blue-500 hover:text-blue-600"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
