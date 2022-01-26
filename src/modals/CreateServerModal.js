import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { CreateServerModalState } from "../atoms/ModalAtoms";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db, storage } from "../Firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function CreateServerModal() {
  const [open, setOpen] = useRecoilState(CreateServerModalState);
  const { data: session } = useSession();
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [serverName, setServerName] = useState(null);
  const [loading, setLoading] = useState(false);
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (renderEvent) => {
      setSelectedFile(renderEvent.target.result);
    };
  };

  const CreateServer = async () => {
    if (loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, "Servers"), {
      ownername: session.user.name,
      email: session.user.email,
      profileimage: session.user.image,
      servername: serverName,
      timestamp: serverTimestamp(),
    });
    const imageRef = ref(storage, `Servers/${docRef.id}/image`);
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "Servers", docRef.id), {
          image: downloadURL,
        });
      }
    );
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)} center>
        <div className="">
          <p className="text-3xl text-black font-bold text-center">
            Customize your server
          </p>
          <h3 className="text-gray-500 mt-2 text-center">
            Give your new server a personality with a name and an icon.
          </h3>

          <div className=" mt-5 flex items-center justify-center">
            {selectedFile ? (
              <img
                className="w-full object-contain cursor-pointer"
                style={{ width: "100px", height: "100px" }}
                src={selectedFile}
                onClick={() => setSelectedFile(null)}
                alt=""
              />
            ) : (
              <img
                className="cursor-pointer "
                src="/images/addimage.png"
                style={{ width: "60px", height: "60px" }}
                onClick={() => filePickerRef.current.click()}
              />
            )}
          </div>
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="leading-6 font-medium text-gray-900">
                Upload a photo
              </h3>
              <div>
                <input
                  ref={filePickerRef}
                  type="file"
                  hidden
                  accept="image/png, image/gif, image/jpeg"
                  onChange={addImageToPost}
                />
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold">SERVER NAME</p>

              <input
                className="p-1 w-full mt-2"
                onChange={(e) => setServerName(e.target.value)}
                type="text"
                placeholder="Enter server name"
                style={{ border: "1px solid gray" }}
              />
            </div>
            <p className="text-xs mt-2">
              By creating a server, you agree to Discord's{" "}
              <span className="font-bold" style={{ color: "blue" }}>
                Community Guidlines.
              </span>
            </p>

            <div className="flex items-center justify-center mt-5">
              <button
                onClick={CreateServer}
                disabled={!selectedFile && !serverName}
                className="text-white font-semibold rounded"
                style={{
                  backgroundColor: "#404EED",
                  padding: "6px 16px 6px 16px",
                  cursor: selectedFile && serverName ? "" : "not-allowed",
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
        </div>
      </Modal>
    </div>
  );
}
