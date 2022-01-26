import { signOut } from "next-auth/react";
import { BsPlus, BsGear } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { CreateServerModalState } from "../atoms/ModalAtoms";
import { collection, onSnapshot, query } from "@firebase/firestore";
import { db } from "../Firebase/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

const SideBar = () => {
  const [open, setOpen] = useRecoilState(CreateServerModalState);
  const [servers, setServers] = useState([]);

  useEffect(
    () =>
      onSnapshot(query(collection(db, "Servers")), (snapshot) => {
        setServers(snapshot.docs);
      }),
    [db]
  );

  return (
    <div
      className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg justify-between"
    >
      <div>
        <Link href={`/channels/me`}>
          <div className="sidebar-icon group">
            <FaDiscord size="28" />
            <span className="sidebar-tooltip group-hover:scale-100">
              Discord{" "}
            </span>
          </div>
        </Link>

        <hr className="sidebar-hr" />
        {servers.map((server) => (
          <Server
            key={server.id}
            data={{ id: server.id, serverdata: server.data() }}
          />
        ))}
        <hr className="sidebar-hr" />
        <div className="sidebar-icon group" onClick={() => setOpen(true)}>
          <BsPlus size="32" />
          <span className="sidebar-tooltip group-hover:scale-100">
            Add Server{" "}
          </span>
        </div>
      </div>

      <div>
        <hr className="sidebar-hr" />
        <div className="sidebar-icon group" onClick={signOut}>
          <BsGear size="22" />
          <span className="sidebar-tooltip group-hover:scale-100">Signout</span>
        </div>
      </div>
    </div>
  );
};
const Server = ({ data }) => {
  return (
    <Link
      href={{
        pathname: `/channels/${data.serverdata.servername}}`,
        query: { id: `${data.id}` },
      }}
    >
      <div className="sidebar-icon group ">
        <img
          className="sidebar-icon group w-full h-full object-cover"
          src={data.serverdata.image}
        />
        <span className="sidebar-tooltip group-hover:scale-100">
          {data.serverdata.servername}{" "}
        </span>
      </div>
    </Link>
  );
};
export default SideBar;
