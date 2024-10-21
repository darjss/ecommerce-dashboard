// import { Lucia } from "lucia";
// import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
// import { db } from "./server/db";
// import { users, sessions } from "./server/db/schema";
// import { cache } from "react";
// import * as context from "next/headers";

// const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

// export const lucia = new Lucia(adapter, {
//   sessionCookie: {
//     attributes: {
//       // set to `true` when using HTTPS
//       secure: process.env.NODE_ENV === "production",
//     },
//   },
//   getUserAttributes: (attributes) => {
//     return {
//       username: attributes.username,
//     };
//   },
// });

// // IMPORTANT! Call this function in your root layout
// export const initializeLucia = cache(async() => {
//   const sessionId =
//     await context.cookies().get(lucia.sessionCookieName)?.value ?? null;
//   return { sessionId };
// });

// // for TypeScript users
// declare module "lucia" {
//   interface Register {
//     Lucia: typeof lucia;
//     DatabaseUserAttributes: DatabaseUserAttributes;
//   }
// }

// interface DatabaseUserAttributes {
//   username: string;
// }



// // IMPORTANT! Export this type alias
// export type Auth = typeof lucia;
