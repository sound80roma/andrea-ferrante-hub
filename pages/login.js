// pages/login.js
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // se arrivi da una pagina protetta, NextAuth passa ?callbackUrl=/quella-pagina
  const callbackUrl =
    typeof router.query.callbackUrl === "string"
      ? router.query.callbackUrl
      : "/dashboard";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    setLoading(false);

    if (!res || res.error) {
      alert(res?.error || "Credenziali non valide");
      return;
    }
    router.push(res.url || callbackUrl);
  };

  return (
    <main style={{ minHeight: "100vh" }} className="grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold">Accedi</h1>

        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="es. admin@demo.it"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full rounded px-3 py-2 border hover:bg-gray-50" disabled={loading}>
          {loading ? "Accesso..." : "Entra"}
        </button>
      </form>
    </main>
  );
}
