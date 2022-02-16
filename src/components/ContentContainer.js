import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { ImSpinner9 } from "react-icons/im";
import { MdEmail } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import TopNavigation from "./TopNavigation ";
import { db } from "../Firebase/firebase";
import Moment from "react-moment";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { useSession, signOut } from "next-auth/react";

const ContentContainer = ({ content, serverhome }) => {
  const queryparams = useRouter();
  const { data: session } = useSession();
  const [sendmsg, setSendMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [server, setServer] = useState([]);
  useEffect(
    () =>
      onSnapshot(doc(db, "Servers", `${queryparams.query.sid}`), (snapshot) => {
        setServer(snapshot.data());
      }),
    [db, queryparams.query.sid]
  );

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!sendmsg) return;
    const messageToSend = sendmsg;
    setSendMsg("");
    await addDoc(
      collection(
        db,
        "Servers",
        `${queryparams.query.sid}`,
        "Channels",
        `${queryparams.query.cid}`,
        "Messages"
      ),
      {
        message: messageToSend,
        useremail: session.user.email,
        userimage: session.user.image,
        username: session.user.name,
        timestamp: serverTimestamp(),
      }
    );
    scrollToBottom();
  };

  useEffect(() => {
    setLoading(true);
    onSnapshot(
      query(
        collection(
          db,
          "Servers",
          `${queryparams.query.sid}`,
          "Channels",
          `${queryparams.query.cid}`,
          "Messages"
        ),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        setMessages(snapshot.docs);
        setLoading(false);
      }
    );
  }, [db, queryparams.query.cid]);

  return (
    <div className="content-container">
      {content ? (
        <>
          <TopNavigation
            content={content}
            channelname={
              queryparams.query.cn
                ? queryparams.query.cn
                : queryparams.query.slug
            }
          />
          {!serverhome ? (
            <div className="h-screen m-10">
              <div className="flex flex-wrap gap-5">
                <img
                  src={server?.image}
                  alt=""
                  className=" w-[40%] h-[50%] rounded-md"
                />
                <div className="dark:text-gray-300">
                  <p className="text-3xl">{server?.servername}</p>
                  <p className="mt-3">Created By:</p>
                  <div className="flex items-center mt-1 space-x-3">
                    <img
                      src={server?.profileimage}
                      className="w-7 h-7 rounded-full"
                    />
                    <p className="capitalize">{server?.ownername}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-list h-screen">
              {loading ? (
                <div className="dark:text-white m-auto">
                  <ImSpinner9 className="w-12 h-12 animate-spin" />
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <Message
                      key={message.id}
                      useremail={session.user.email}
                      data={{
                        id: message.id,
                        messagedata: message.data(),
                      }}
                    />
                  ))}
                </>
              )}

              <div ref={bottomRef} className="pb-5" />
            </div>
          )}

          {/* Message Box */}

          {queryparams.query.cid && (
            <form onSubmit={sendMessage}>
              <div className="bottom-bar">
                <PlusIcon />
                <input
                  onChange={(e) => setSendMsg(e.target.value)}
                  value={sendmsg}
                  type="text"
                  placeholder="Enter message..."
                  className="bottom-bar-input"
                />
                {sendmsg && (
                  <IoSend
                    onClick={(e) => sendMessage(e)}
                    size="22"
                    className="text-green-500 dark:shadow-lg mx-2 dark:text-primary cursor-pointer"
                  />
                )}
              </div>
            </form>
          )}
        </>
      ) : (
        <>
          <TopNavigation content={content} />
          <div className="w-screen h-screen">
            <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-20 lg:my-0">
              <div className="w-full lg:w-3/5 rounded-lg lg:rounded-lg shadow-2xl bg-white opacity-75 mx-3 lg:mx-0 lg:flex">
                <div className="p-4 md:p-12 text-center lg:text-left">
                  <img
                    src={session?.user?.image}
                    alt=" "
                    className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-40 w-40 bg-cover bg-center"
                  />
                  <h1 className="text-3xl font-bold pt-8 lg:pt-0 capitalize text-black">
                    {session?.user?.name}
                  </h1>
                  <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-purple-500 opacity-25"></div>
                  <p className="pt-4 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                    <MdEmail className="w-5 h-5 mr-2" />
                    {session?.user?.email}
                  </p>
                  <p className="pt-8 text-sm">Thankyou for Joining Discord.</p>
                  <div className="pt-12 pb-8">
                    <button
                      onClick={signOut}
                      className="relative inline-flex items-center justify-start  px-5 py-3 overflow-hidden font-bold rounded group bg-[#404EED]"
                    >
                      <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-black opacity-100 group-hover:-translate-x-8"></span>
                      <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                        Signout
                      </span>
                    </button>
                  </div>
                </div>
                <img
                  src={session?.user?.image}
                  alt=" "
                  className="hidden lg:block rounded-full shadow-xl mx-auto -mt-16 h-40 w-40 bg-cover bg-center"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Message = ({ data, useremail }) => {
  const queryparams = useRouter();
  const DeleteMessage = async () => {
    await deleteDoc(
      doc(
        db,
        "Servers",
        `${queryparams.query.sid}`,
        "Channels",
        `${queryparams.query.cid}`,
        "Messages",
        `${data.id}`
      )
    );
  };
  return (
    <div className={"post"}>
      <div className="avatar-wrapper">
        <img src={`${data.messagedata.userimage}`} alt="" className="avatar" />
      </div>
      <div className="post-content">
        <p className="post-owner">
          {data.messagedata.username}
          <small className="timestamp">
            <Moment fromNow interval={1000} className="pr-5 text-xs">
              {data.messagedata.timestamp?.toDate()}
            </Moment>
          </small>
        </p>
        <p className="post-text">{data.messagedata.message}</p>
      </div>
      {data.messagedata.useremail === useremail && (
        <AiFillDelete
          className="w-5 h-5 text-red-500 cursor-pointer"
          onClick={DeleteMessage}
        />
      )}
    </div>
  );
};

const PlusIcon = () => (
  <BsPlusCircleFill
    size="22"
    className="text-green-500 dark:shadow-lg mx-2 dark:text-primary"
  />
);

export default ContentContainer;
