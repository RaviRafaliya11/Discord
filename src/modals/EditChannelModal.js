import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Firebase/firebase";
import { useRouter } from "next/router";
import { EditChannelModalState } from "../atoms/ModalAtoms";
import { deleteObject, ref } from "firebase/storage";

export default function EditChannelModal() {
  const query = useRouter();
  const [open, setOpen] = useRecoilState(EditChannelModalState);
  const [loading, setLoading] = useState(false);
  const [channelName, setChannelName] = useState(`${query.query.cn}`);

  useEffect(() => {
    setChannelName(`${query.query.cn}`);
  }, [query.query]);

  const EditServer = async () => {
    if (loading || !channelName) return;
    setLoading(true);
    await updateDoc(
      doc(
        db,
        "Servers",
        `${query.query.sid}`,
        "Channels",
        `${query.query.cid}`
      ),
      {
        name: channelName,
      }
    );
    setOpen(false);
    setLoading(false);
    query.push(
      `/channels/${query.query.slug}?cid=${query.query.cid}&sid=${query.query.sid}&cn=${channelName}`
    );
  };

  const DeleteChannel = async () => {
    if (loading) return;
    setLoading(true);

    await deleteDoc(
      doc(db, "Servers", `${query.query.sid}`, "Channels", `${query.query.cid}`)
    );
    setOpen(false);
    setLoading(false);
    query.push(`/channels/${query.query.slug}?sid=${query.query.sid}`);
  };
  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)} center>
        <div className="">
          <p className="text-3xl text-black font-bold text-center p-7">
            Edit Server
          </p>
          <div>
            <p className="text-sm font-semibold">CHANNEL NAME</p>
            <input
              className="p-1 w-full mt-2"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              type="text"
              placeholder="Enter new name"
              style={{ border: "1px solid gray" }}
            />
            <p className="text-xs mt-2">
              <span className="font-bold mr-2">Note:</span>Kindley Do not
              Include <span className="font-bold">'#' (hastag)</span> in Channel
              name.
            </p>
          </div>

          <div className="flex items-center justify-between mt-5">
            <button
              onClick={EditServer}
              disabled={!channelName}
              className="text-white font-semibold rounded"
              style={{
                backgroundColor: "#404EED",
                padding: "6px 16px 6px 16px",
                cursor: channelName ? "" : "not-allowed",
              }}
            >
              {!loading ? (
                <>Save Changes</>
              ) : (
                <div className="flex items-center">
                  <img src="/loader.svg" className="w-6 h-6 mr-2" />
                  Saving...
                </div>
              )}
            </button>
            <button
              onClick={DeleteChannel}
              className="text-white font-semibold rounded"
              style={{
                backgroundColor: "#dc2626",
                padding: "6px 16px 6px 16px",
                cursor: channelName ? "" : "not-allowed",
              }}
            >
              Delete Channel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
