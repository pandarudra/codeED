"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
