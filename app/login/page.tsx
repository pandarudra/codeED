"use client";

import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black bg-opacity-90">
      <div className="w-full max-w-md px-6 py-10 md:rounded-2xl rounded-none bg-zinc-900 shadow-xl space-y-6 text-center">
        {/* App Name */}
        <h1 className="text-4xl md:text-5xl d-font bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text animate-fade-in transition-transform duration-300 hover:scale-105 hover:drop-shadow-glow">
          duocode
        </h1>

        <p className="text-sm text-neutral-400">Sign in to continue</p>

        {/* Sign-in Button */}
        <div className="flex justify-center">
          <button
            className="group/btn relative flex items-center justify-center space-x-2 w-full h-10 rounded-md bg-zinc-800 hover:bg-zinc-700 transition text-neutral-300 text-sm font-medium shadow-[0_0_1px_1px_#262626]"
            onClick={() => signIn("google")}
          >
            <IconBrandGoogle className="w-4 h-4" />
            <span>Sign in with Google</span>
            <BottomGradient />
          </button>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
