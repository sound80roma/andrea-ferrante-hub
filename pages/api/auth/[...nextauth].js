import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { compare } from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default NextAuth({
  pages: { signIn: "/login", }, // devo mettere mla mia pagina di login

  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email e Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(creds);
        if (!parsed.success) return null;

        const rows = await sql`
          SELECT id, email, password_hash, role, name
          FROM users
          WHERE email = ${parsed.data.email}
          LIMIT 1
        `;
        const user = rows[0];
        if (!user) return null;

        const ok = await compare(parsed.data.password, user.password_hash);
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          role: user.role ?? "user",
          name: user.name ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role || "user";
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
});
