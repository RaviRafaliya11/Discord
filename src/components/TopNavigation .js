import { useSession } from "next-auth/react";
import { FaSearch, FaHashtag, FaRegBell, FaMoon, FaSun } from "react-icons/fa";
import useDarkMode from "../hooks/useDarkMode";

const TopNavigation = ({ content, channelname }) => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  const { data: session } = useSession();
  return (
    <div className="top-navigation">
      <FaHashtag size="20" className="title-hashtag" />
      {/* Title */}
      <h5 className="title-text">
        {content ? (
          <>{channelname && `${channelname}`}</>
        ) : (
          <>{session && `${session.user.name}`}</>
        )}
      </h5>
      {/* Theme */}
      <span onClick={handleMode}>
        {darkTheme ? (
          <FaSun size="24" className="top-navigation-icon" />
        ) : (
          <FaMoon size="24" className="top-navigation-icon" />
        )}
      </span>
      {/* Search */}
      <div className="search">
        <input className="search-input" type="text" placeholder="Search..." />
        <FaSearch size="18" className="text-secondary my-auto" />
      </div>
      <FaRegBell size="24" className="top-navigation-icon" />

      <img
        src={session?.user?.image}
        className="top-navigation-icon w-8 h-8 rounded-full"
      />
    </div>
  );
};

export default TopNavigation;
