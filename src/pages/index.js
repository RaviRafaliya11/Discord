import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  return (
    <>
      {" "}
      <Head>
        <title>Discord</title>
        <link rel="icon" href="/discord-icon.svg" />
      </Head>
      <div className="flex flex-col items-center space-y-20 py-20 bg-[#202225] h-screen ">
        <img src={`/discord-full-logo.svg`} className="w-56 h-56" />

        <div className="flex flex-wrap items-center justify-center gap-10">
          <button
            className="bg-[#5865F2] w-60 font-medium flex items-center justify-center rounded-full p-4 text-lg hover:shadow-2xl text-white hover:text-black focus:outline-none transition duration-200 ease-in-out"
            onClick={() => router.push("/channels/me")}
          >
            Discover Channels
          </button>
          <button
            className="bg-white hover:text-white w-72 font-medium flex items-center justify-center rounded-full p-4 text-lg hover:shadow-2xl hover:bg-gray-800 focus:outline-none transition duration-200 ease-in-out"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
