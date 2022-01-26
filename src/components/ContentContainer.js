import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
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
} from "@firebase/firestore";
import { useSession } from "next-auth/react";

const ContentContainer = ({ content }) => {
  const queryparams = useRouter();
  const { data: session } = useSession();
  const [sendmsg, setSendMsg] = useState(null);
  const [messages, setMessages] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageToSend = sendmsg;
    setSendMsg("");
    await addDoc(
      collection(
        db,
        "Servers",
        `${queryparams.query.id}`,
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
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(
            db,
            "Servers",
            `${queryparams.query.id}`,
            "Channels",
            `${queryparams.query.cid}`,
            "Messages"
          ),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          setMessages(snapshot.docs);
        }
      ),
    [db, queryparams]
  );

  return (
    <div className="content-container">
      {content ? (
        <>
          <TopNavigation content={content} channelname={queryparams.query.cn} />
          <div className="content-list h-screen">
            {messages.map((message) => (
              <Message
                key={message.id}
                data={{
                  id: message.id,
                  messagedata: message.data(),
                }}
              />
            ))}

            {/* <Post
              name="Ada"
              timestamp="one week ago"
              text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
          ipsum dolor sit amet consectetur adipisicing elit.`}
            /> */}
          </div>

          {/* Message Box */}

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
        </>
      ) : (
        <>
          <TopNavigation content={content} />

          <div className="content-list w-screen h-screen"></div>
        </>
      )}
    </div>
  );
};

const Message = ({ data }) => {
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
