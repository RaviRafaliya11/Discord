import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";

export default function SignIn({ providers }) {
  return (
    <div className="flex flex-col items-center space-y-20 pt-48 bg-[#202225] h-screen">
      <Head>
        <title>Discord</title>
        <link rel="icon" href="/discord-icon.svg" />
      </Head>
      <img src={`/discord-icon.svg`} className="w-56 h-56" />

      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
              onClick={() =>
                signIn(provider.id, { callbackUrl: "/channels/me" })
              }
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#5865F2] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with {provider.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
