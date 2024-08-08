import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Contact = ({ listing }) => {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function getLandLordInfo() {
      const docRef = doc(db, "users", listing.userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandLordInfo();
  }, [listing.userRef]);

  const onchange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      {landlord !== null && (
        <div className="flex flex-col w-full ">
          <p className="">
            Contact {landlord.name} for {listing.name.toLowerCase()}
          </p>

          <div>
            <textarea
              name="message"
              id="message"
              rows="2"
              onChange={onchange}
              value={message}
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded outline-none transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 my-2 "
            ></textarea>
          </div>

          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              type="button"
              className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center font-semibold mb-6"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Contact;
