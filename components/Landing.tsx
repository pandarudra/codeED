"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Code2,
  Users,
  Zap,
  Shield,
  Palette,
  Download,
  Github,
  Twitter,
  Mail,
  Play,
  UserPlus,
  FileCode,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LandingBG from "./LandingBG";

const Landing = () => {
  const router = useRouter();

  const handleJoinGithub = () => {
    window.open("https://github.com/pandarudra/codeED", "_blank");
  };

  const handleStartDemo = () => {
    // Client-side demo logic
    console.log("Starting live demo...");
  };
  const handleWatchDemo = () => {
    // Client-side demo video logic
    console.log("Playing demo video...");
  };

  return (
    <div className="flex flex-col min-h-screen relative text-white ">
      <div className="fixed inset-0 -z-10 w-full h-full">
        <LandingBG />
      </div>
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-transparent backdrop-blur-sm justify-center">
        <Link href="/" className="flex items-center justify-center">
          <Code2 className="h-8 w-8 text-zinc-400" />
          <span className="ml-2 text-2xl font-bold text-white d-font">
            duocode
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
          >
            How It Works
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
          >
            FAQ
          </Link>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            size="sm"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white d-font "
          >
            Sign In
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full  py-12 md:py-24 lg:py-36 xl:py-48 bg-transparent ">
          <div className="container  px-4 md:px-14 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge
                    variant="secondary"
                    className="w-fit bg-blue-500/10 text-blue-400 border-blue-500/20"
                  >
                    🚀 Now in Beta
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-5xl/none text-white d-font">
                    Code Together in Real-Time
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-lg d-font">
                    Collaborate with teammates, write code together, and build
                    faster — all in your browser. Experience seamless real-time
                    collaboration with syntax highlighting and multi-language
                    support.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                    onClick={handleStartDemo}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Try Live Demo
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-white border-gray-700 hover:bg-gray-800 hover:border-gray-600 hover:text-white "
                    onClick={handleJoinGithub}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>10,000+ developers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Code2 className="h-4 w-4" />
                    <span>50+ languages</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1120&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    width="600"
                    height="400"
                    alt="CodeTogether Editor Preview"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl border border-gray-800"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
                  <Button
                    size="lg"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
                    onClick={handleWatchDemo}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full d-font py-12 md:py-24 lg:py-32 bg-transparent"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Everything you need to code together
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Powerful features designed to make collaborative coding
                  seamless and productive.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Real-Time Collaboration
                  </h3>
                  <p className="text-center text-gray-400">
                    See changes instantly as your team types. Multiple cursors,
                    live editing, and conflict resolution built-in.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <Code2 className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    50+ Languages
                  </h3>
                  <p className="text-center text-gray-400">
                    Full syntax highlighting and IntelliSense for JavaScript,
                    Python, Java, C++, and many more languages.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-purple-500/10 p-3">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Lightning Fast
                  </h3>
                  <p className="text-center text-gray-400">
                    Optimized for speed with minimal latency. Changes sync in
                    milliseconds across all connected users.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-red-500/10 p-3">
                    <Shield className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Secure Sessions
                  </h3>
                  <p className="text-center text-gray-400">
                    End-to-end encryption and secure room management. Your code
                    stays private and protected.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-yellow-500/10 p-3">
                    <Palette className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Custom Themes
                  </h3>
                  <p className="text-center text-gray-400">
                    Choose from popular themes like VS Code Dark, Monokai, or
                    create your own custom color scheme.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-indigo-500/10 p-3">
                    <Download className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Export & Share
                  </h3>
                  <p className="text-center text-gray-400">
                    Download your code, share via GitHub, or export as various
                    file formats with one click.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-900"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-gray-700 d-font text-gray-300"
                >
                  How It Works
                </Badge>
                <h2 className="text-3xl d-font font-bold tracking-tighter sm:text-5xl text-white">
                  Start coding together in 3 simple steps
                </h2>
                <p className="max-w-[900px] d-font text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started with collaborative coding in under a minute.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-blue-600 p-4 text-white">
                  <UserPlus className="h-8 w-8" />
                </div>
                <div className="space-y-2 d-font">
                  <h3 className="text-xl font-bold text-white">
                    1. Create or Join Room
                  </h3>
                  <p className="text-gray-400">
                    Create a new coding room or join an existing one with a
                    simple room code. No signup required to get started.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-green-600 p-4 text-white">
                  <Code2 className="h-8 w-8" />
                </div>
                <div className="space-y-2 d-font">
                  <h3 className="text-xl font-bold text-white">
                    2. Start Typing Together
                  </h3>
                  <p className="text-gray-400 d-font">
                    Begin coding collaboratively with real-time synchronization.
                    See everyone's cursors and changes instantly.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-purple-600 p-4 text-white">
                  <FileCode className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl d-font font-bold text-white">
                    3. Export & Share
                  </h3>
                  <p className="text-gray-400 d-font">
                    Download your collaborative work, push to GitHub, or share
                    the final code with your team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-gray-700 d-font text-gray-300"
                >
                  Built With
                </Badge>
                <h2 className="text-3xl d-font font-bold tracking-tighter sm:text-4xl text-white">
                  Powered by modern technologies
                </h2>
                <p className="max-w-[900px] d-font text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Built with the latest and most reliable technologies for
                  optimal performance.
                </p>
              </div>
            </div>
            <div className="flex w-full grid-cols-2 lg:grid-cols-6 items-center justify-center gap-8 lg:gap-12 py-12">
              {[
                { name: "React", logo: "/landingassets/reactjs.png" },
                { name: "Next.js", logo: "/landingassets/nextjs.png" },
                { name: "TypeScript", logo: "/landingassets/typescript.png" },
                { name: "Tailwind CSS", logo: "/landingassets/talwind.png" },
                { name: "Socket.io", logo: "/landingassets/socketio.svg" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center space-y-2 bg-transparent"
                >
                  <Image
                    src={tech.logo || "/placeholder.svg"}
                    width={120}
                    height={60}
                    alt={`${tech.name} logo`}
                    className="aspect-[2/1] object-contain object-center bg-transparent "
                  />
                  <span className="text-sm font-medium text-gray-400">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 from-gray-950 via-gray-600 to-gray-900"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-gray-700 text-gray-300 d-font"
                >
                  FAQ
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter d-font sm:text-4xl text-white">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about CodeTogether.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6 py-12">
              {[
                {
                  question: "What programming languages are supported?",
                  answer:
                    "We support over 50 programming languages including JavaScript, Python, Java, C++, Go, Rust, and many more. Full syntax highlighting and IntelliSense are available for all supported languages.",
                },
                {
                  question: "How many people can collaborate in one room?",
                  answer:
                    "Up to 10 people can collaborate simultaneously in a single room. For larger teams, please contact us for enterprise solutions.",
                },
                {
                  question: "Is my code secure and private?",
                  answer:
                    "Yes, all sessions are encrypted end-to-end. Your code is never stored on our servers permanently, and rooms are automatically deleted after 24 hours of inactivity.",
                },
                {
                  question: "Do I need to create an account?",
                  answer:
                    "No account is required for basic usage. However, creating an account allows you to save your rooms, access history, and unlock additional features.",
                },
                {
                  question: "Can I integrate with GitHub?",
                  answer:
                    "Yes, you can directly push your collaborative code to GitHub repositories, create pull requests, and sync with existing projects.",
                },
                {
                  question: "Is there a mobile app?",
                  answer:
                    "CodeTogether works great in mobile browsers. We're also working on dedicated mobile apps for iOS and Android, coming soon!",
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {faq.question}
                    </h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white d-font">
                  Ready to start coding together?
                </h2>
                <p className="max-w-[600px] text-blue-100 d-font md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who are already collaborating in
                  real-time.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-gray-600 hover:text-black hover:bg-white backdrop-blur-sm"
                  onClick={() => router.push("/login")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Coding Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-gray-600 hover:text-black  hover:bg-white backdrop-blur-sm"
                  onClick={handleJoinGithub}
                >
                  <Github className="mr-2 h-4 w-4" />
                  View Source Code
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-gray-950">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-blue-400" />
          <p className="text-xs text-gray-400 d-font">
            © 2025 duocode. All rights reserved.
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="https://github.com/pandarudra/codeED"
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            <Twitter className="h-4 w-4" />
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
          >
            <Mail className="h-4 w-4" />
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Landing;
