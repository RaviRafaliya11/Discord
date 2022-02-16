import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { HiOutlineMenu } from "react-icons/hi";
export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <header className="bg-[#404EED] flex items-center justify-between py-4 px-6 md:px-20">
      <img
        onClick={() => router.push("/")}
        src="/discord-full-logo.svg"
        className="w-32 h-12 object-contain cursor-pointer"
        alt=""
      />

      <div className="hidden lg:flex  space-x-12 ">
        <p className="cursor-pointer font-semibold  text-white hover:underline">
          Download
        </p>
        <p className="cursor-pointer font-semibold  text-white hover:underline">
          Nitro
        </p>

        <p className="cursor-pointer font-semibold  text-white hover:underline">
          Safety
        </p>
        <p className="cursor-pointer font-semibold  text-white hover:underline">
          Support
        </p>
        <p className="cursor-pointer font-semibold  text-white hover:underline">
          Blog
        </p>
        <p className="cursor-pointer font-semibold  text-white hover:underline">
          Careers
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={session ? () => router.push("/") : signIn}
          className="bg-white p-2 rounded-full text-xs md:text-sm px-4 focus:outline-none hover:shadow-2xl hover:text-[#5865f2] transition duration-200 ease-in-out whitespace-nowrap font-medium"
        >
          {session ? "Open Discord" : "Login"}
        </button>
        <HiOutlineMenu className="h-9 w-9 text-white cursor-pointer lg:hidden" />
      </div>
    </header>
  );
}
