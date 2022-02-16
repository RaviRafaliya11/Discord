import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsHash } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import { AiFillSetting } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useRecoilState } from "recoil";
import {
  CreateChannelModalState,
  EditChannelModalState,
  EditServerModalState,
} from "../atoms/ModalAtoms";
import { collection, onSnapshot, query, doc } from "@firebase/firestore";
import { db } from "../Firebase/firebase";
import { useSession } from "next-auth/react";

const ChannelBar = ({ content }) => {
  const [open, setOpen] = useRecoilState(CreateChannelModalState);
  const [openEditServer, setOpenEditServer] =
    useRecoilState(EditServerModalState);
  const { data: session } = useSession();
  const urlparams = useRouter();
  const [server, setServer] = useState([]);
  const [channels, setChannels] = useState([]);

  useEffect(
    () =>
      onSnapshot(doc(db, "Servers", `${urlparams.query.sid}`), (snapshot) => {
        setServer(snapshot.data());
      }),
    [db, urlparams.query.sid]
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "Servers", `${urlparams.query.sid}`, "Channels")),
        (snapshot) => {
          setChannels(snapshot.docs);
        }
      ),
    [db, urlparams.query.sid]
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
            {session.user.email === server?.email && (
              <div>
                <AiFillSetting
                  onClick={() => setOpenEditServer(true)}
                  className="w-5 h-5 mr-3 dark:text-[#7289da] hover:rotate-90 cursor-pointer transition-all duration-300 ease-linear"
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="px-4 dark:text-gray-300 font-semibold">Channels</p>
            {session.user.email === server?.email ? (
              <HiPlus
                onClick={() => setOpen(true)}
                className="w-6 h-6 mr-3 dark:text-white bg-gray-400 dark:bg-gray-600 rounded-full cursor-pointer p-1 dark:hover:bg-gray-500 hover:-rotate-90  transition-all duration-300 ease-linear"
              />
            ) : null}
          </div>
          <div className="channel-container">
            {channels.map((channel) => (
              <Channel
                key={channel.id}
                owner={session.user.email === server?.email}
                data={{
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

const Channel = ({ data, owner }) => {
  const [openEditChannel, setOpenEditChannel] = useRecoilState(
    EditChannelModalState
  );
  const router = useRouter();
  const selected = data.cid === router.query.cid;
  return (
    <>
      <div
        className={`flex items-center justify-between w-full mt-1 ml-2 px-2 py-1 hover:bg-gray-500 group ${
          selected && "bg-gray-400 dark:bg-gray-500 text-black"
        }`}
      >
        <div
          className={`flex items-center w-full cursor-pointer text-gray-500 group-hover:text-white ${
            selected && "text-black dark:text-white"
          }`}
          onClick={() =>
            router.push(
              `/channels/${router.query.slug}?cid=${data.cid}&sid=${router.query.sid}&cn=${data.cn}`
            )
          }
        >
          <BsHash size="24" />
          <p className="truncate flex-grow">{data.channeldata.name}</p>
          {owner && selected && (
            <FiEdit
              onClick={() => setOpenEditChannel(true)}
              className={`text-gray-500 cursor-pointer flex-none group-hover:text-white ${
                selected && "dark:text-white"
              }`}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChannelBar;
