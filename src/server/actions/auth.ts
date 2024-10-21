"use server";
import * as bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { db } from "../db";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { ActionResult } from "@/utils/types";
import { lucia } from "@/auth";
import { users } from "../db/schema";
import { createUser, getUserByusername } from "../db/queries";

export async function signup(
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  console.log("Signup action working in the server");
  try {
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    const existingUser = await getUserByusername(username);
    if (existingUser.length > 0) {
      return {
        error: "User already exists",
      };
    }

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return {
        error: "Invalid password",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = generateIdFromEntropySize(10);

    await createUser(userId, username, passwordHash);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("../");
  } catch (e) {
    console.log(e);
    return { error: "Error signing up" };
  }
}

export async function signIn(
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  console.log("Signin action working in the server");
  try {
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return {
        error: "Invalid password",
      };
    }
    const existingUser = await getUserByusername(username);
    if (
      existingUser.length > 0 &&
      existingUser[0]?.password &&
      bcrypt.compareSync(password, existingUser[0]?.password as string)
    ) {
      const session = await lucia.createSession(existingUser[0]?.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return redirect("../");
    } else {
      return { error: "Invalid password or username number" };
    }
  } catch (e) {
    console.log(e);
    return { error: "Error signing up" };
  }
}
