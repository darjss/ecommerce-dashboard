// "use server";

// import { lucia as auth } from "@/auth";
// import { cookies } from "next/headers";

// export async function validateSession() {
//   const cookieStore = await cookies();
//   const sessionId = cookieStore.get(auth.sessionCookieName)?.value;

//   if (!sessionId) {
//     return null;
//   }

//   const { session, user } = await auth.validateSession(sessionId);

//   try {
//     if (session && session.fresh) {
//       const sessionCookie = auth.createSessionCookie(session.id);
//       await cookieStore.set(
//         sessionCookie.name,
//         sessionCookie.value,
//         sessionCookie.attributes,
//       );
//     }
//     if (!session) {
//       const sessionCookie = auth.createBlankSessionCookie();
//       await cookieStore.set(
//         sessionCookie.name,
//         sessionCookie.value,
//         sessionCookie.attributes,
//       );
//     }
//   } catch (error) {
//     console.error(error);
//   }

//   return session ? { user, session } : null;
// }
