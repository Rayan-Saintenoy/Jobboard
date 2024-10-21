import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            return null;
          }

          const parsedResponse = await response.json();

          const accessToken = parsedResponse.access_token;
          const is_recruiter = parsedResponse.is_recruiter;
          const is_admin = parsedResponse.is_admin;

          return {
            accessToken,
            is_recruiter,
            is_admin,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.isRecruiter = user.is_recruiter;
        token.isAdmin = user.is_admin;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.accessToken = token.accessToken;
      session.user.isRecruiter = token.isRecruiter;
      session.user.isAdmin = token.isAdmin;

      return session;
    },
    redirect: async () => {
      return Promise.resolve("/");
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});
