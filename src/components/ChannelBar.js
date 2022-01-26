import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsHash } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import { useRecoilState } from "recoil";
import { CreateChannelModalState } from "../atoms/ModalAtoms";
import { collection, onSnapshot, query, doc } from "@firebase/firestore";
import { db } from "../Firebase/firebase";
import { useSession } from "next-auth/react";
import Link from "next/link";

const topics = ["tailwind-css", "react"];

const ChannelBar = ({ content }) => {
  const [open, setOpen] = useRecoilState(CreateChannelModalState);
  const { data: session } = useSession();
  const urlparams = useRouter();
  const [server, setServer] = useState([]);
  const [channels, setChannels] = useState([]);

  useEffect(
    () =>
      onSnapshot(doc(db, "Servers", `${urlparams.query.id}`), (snapshot) => {
        setServer(snapshot.data());
      }),
    [db, urlparams]
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "Servers", `${urlparams.query.id}`, "Channels")),
        (snapshot) => {
          setChannels(snapshot.docs);
        }
      ),
    [db, urlparams]
  );

  return (
    <div className="channel-bar shadow-lg">
      {content ? (
        <>
          {" "}
          <div className="channel-block">
            <h5 className="channel-block-text line-clamp-2">
              {server?.servername}
            </h5>
          </div>
          <div className="flex justify-between items-center">
            <p className="px-4 dark:text-gray-300 font-semibold">Channels</p>
            {session.user.email === server?.email ? (
              <HiPlus
                onClick={() => setOpen(true)}
                className="w-6 h-6 mr-3 dark:text-white bg-gray-400 dark:bg-gray-600 rounded-full cursor-pointer p-1 dark:hover:bg-gray-500"
              />
            ) : null}
          </div>
          <div className="channel-container">
            {channels.map((channel) => (
              <Channel
                key={channel.id}
                data={{
                  id: urlparams.query.id,
                  cn: channel.data().name,
                  cid: channel.id,
                  channeldata: channel.data(),
                }}
              />
            ))}
          </div>
        </>
      ) : null}
      {/* ChannelBlock */}
    </div>
  );
};

const Channel = ({ data }) => {
  return (
    <Link
      href={{
        pathname: `/channels/${data.channeldata.name}}`,
        query: { id: `${data.id}`, cn: `${data.cn}`, cid: `${data.cid}` },
      }}
    >
      <div className="channel-heading group">
        <BsHash size="24" className="text-gray-400" />
        <p className="channel-text group-hover:text-white truncate">
          {data.channeldata.name}
        </p>
      </div>
    </Link>
  );
};

export default ChannelBar;
