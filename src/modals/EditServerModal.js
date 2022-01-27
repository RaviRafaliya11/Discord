import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Firebase/firebase";
import { useRouter } from "next/router";
import { EditServerModalState } from "../atoms/ModalAtoms";
import { deleteObject, ref } from "firebase/storage";

export default function EditServerModal() {
  const query = useRouter();
  const [open, setOpen] = useRecoilState(EditServerModalState);
  const [loading, setLoading] = useState(false);
  const [serverName, setServerName] = useState(`${query.query.slug}`);

  useEffect(() => {
    setServerName(`${query.query.slug}`);
  }, [query.query]);

  const EditServer = async () => {
    if (loading || !serverName) return;
    setLoading(true);
    await updateDoc(doc(db, "Servers", `${query.query.sid}`), {
      servername: serverName,
    });
    setOpen(false);
    setLoading(false);
    query.push(`/channels/${serverName}?sid=${query.query.sid}`);
  };

  const DeleteServer = async () => {
    if (loading) return;
    setLoading(true);
    await deleteDoc(doc(db, "Servers", `${query.query.sid}`));
    const desertRef = ref(storage, `Servers/${query.query.sid}/image`);
    await deleteObject(desertRef);
    setOpen(false);
    setLoading(false);
    query.push(`/channels/me`);
  };
  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)} center>
        <div className="">
          <p className="text-3xl text-black font-bold text-center p-7">
            Edit Server
          </p>
          <div>
            <p className="text-sm font-semibold">SERVER NAME</p>
            <input
              className="p-1 w-full mt-2"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              type="text"
              placeholder="Enter new name"
              style={{ border: "1px solid gray" }}
            />
            <p className="text-xs mt-2">
              <span className="font-bold mr-2">Note:</span>Kindley Do not
              Include <span className="font-bold">Special Characters</span> in
              Server name.
            </p>
          </div>

          <div className="flex items-center justify-between mt-5">
            <button
              onClick={EditServer}
              disabled={!serverName}
              className="text-white font-semibold rounded"
              style={{
                backgroundColor: "#404EED",
                padding: "6px 16px 6px 16px",
                cursor: serverName ? "" : "not-allowed",
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
              onClick={DeleteServer}
              className="text-white font-semibold rounded"
              style={{
                backgroundColor: "#dc2626",
                padding: "6px 16px 6px 16px",
                cursor: serverName ? "" : "not-allowed",
              }}
            >
              Delete Server
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
