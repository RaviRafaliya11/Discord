import Head from "next/head";
import Link from "next/link";

export default function FourOFour() {
  return (
    <div className="flex flex-col items-center space-y-20 pt-20 bg-[#202225] h-screen">
      <Head>
        <title>Discord</title>
        <link rel="icon" href="/discord-icon.svg" />
      </Head>
      <img src={`/discord-icon.svg`} className="w-56 h-56" />
      <div className="mt-5">
        <p className="font-semibold text-white text-xl">
          Looking for something?
        </p>
        <p className="mt-1 text-slate-400">
          We&apos;re sorry. The Web address you entered is not a functioning
          page on our site.
        </p>
        <p className="mt-1 text-center text-lg text-slate-400">
          Go to Discord&apos;s{" "}
          <Link href="/">
            <span className="underline font-semibold text-white cursor-pointer">
              Home
            </span>
          </Link>{" "}
          Page
        </p>
      </div>
    </div>
  );
}
