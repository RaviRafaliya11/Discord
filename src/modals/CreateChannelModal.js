import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { CreateChannelModalState } from "../atoms/ModalAtoms";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useRouter } from "next/router";

export default function CreateChannelModal() {
  const [open, setOpen] = useRecoilState(CreateChannelModalState);
  const [loading, setLoading] = useState(false);
  const [channelName, setChannelName] = useState(null);
  const query = useRouter();

  const CreateChannel = async () => {
    if (loading || !channelName) return;
    setLoading(true);
    const docRef = await addDoc(
      collection(db, "Servers", query.query.sid, "Channels"),
      {
        name: channelName,
        timestamp: serverTimestamp(),
      }
    );
    setOpen(false);
    setLoading(false);
    query.push(
      `/channels/${query.query.slug}?cid=${docRef.id}&sid=${query.query.sid}&cn=${channelName}`
    );
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)} center>
        <div className="">
          <p className="text-3xl text-black font-bold text-center p-7">
            Create Channel
          </p>
          <div>
            <p className="text-sm font-semibold">CHANNEL NAME</p>
            <input
              className="p-1 w-full mt-2"
              onChange={(e) => setChannelName(e.target.value)}
              type="text"
              placeholder="Enter server name"
              style={{ border: "1px solid gray" }}
            />
            <p className="text-xs mt-2">
              <span className="font-bold mr-2">Note:</span>Kindley Do not
              Include <span className="font-bold">'#'</span> in Channel name.
            </p>
            <p className="text-xs mt-2">
              By creating a channel, you agree to Discord's{" "}
              <span className="font-bold" style={{ color: "blue" }}>
                Community Guidlines.
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center mt-5">
            <button
              onClick={CreateChannel}
              disabled={!channelName}
              className="text-white font-semibold rounded"
              style={{
                backgroundColor: "#404EED",
                padding: "6px 16px 6px 16px",
                cursor: channelName ? "" : "not-allowed",
              }}
            >
              {!loading ? (
                <>Create</>
              ) : (
                <div className="flex items-center">
                  <img src="/loader.svg" className="w-6 h-6 mr-2" />
                  Creating...
                </div>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
