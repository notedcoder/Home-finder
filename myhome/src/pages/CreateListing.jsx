import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnables] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    discription: "",
    offer: true,
    Regularprice: 400,
    Discountedprice: 300,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const onchange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => {
        return { ...prevState, images: e.target.files };
      });
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+Discountedprice >= +Regularprice) {
      setLoading(false);
      toast.error(
        "Discounted Price can not be equal or more than Regular price"
      );
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }

    let geolocation = {};
    if (!geoLocationEnabled) {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            switch (snapshot.state) {
              case "paused":
                toast.done("Upload is paused");
                break;
              case "running":
                toast.done("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      userRef: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.Discountedprice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing Created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    discription,
    offer,
    Regularprice,
    Discountedprice,
    images,
    latitude,
    longitude,
  } = formData;

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md mx-auto p-2">
      <h1 className="text-center text-3xl font-bold mt-[1rem]">
        Create a Listing
      </h1>
      <form action="" onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="w-full flex justify-between">
          <button
            id="type"
            value="sell"
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              type === "sell"
                ? "bg-white text-black"
                : "text-white bg-slate-600"
            }`}
          >
            Sell
          </button>
          <button
            id="type"
            value={"rent"}
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              type === "rent"
                ? "bg-white text-black"
                : "text-white bg-slate-600"
            }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onchange}
          placeholder="Property Name"
          maxLength={"32"}
          minLength={"10"}
          className="outline-none px-3 w-full py-2 bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 text-gray-700"
        />

        <div className="flex space-x-6 mb-6">
          <div className="w-[25%]">
            <p className="text-lg  font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onchange}
              min={1}
              max={50}
              required
              className="w-full text-center outline-none px-4 py-2 text-xl bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 text-gray-700 "
            />
          </div>
          <div className="w-[25%]">
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onchange}
              min={1}
              max={50}
              required
              className="w-full text-center outline-none px-4  py-2 text-xl bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 text-gray-700 "
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="w-full flex justify-between">
          <button
            id="parking"
            value={true}
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              parking ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            Yes
          </button>
          <button
            id="parking"
            value={false}
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              !parking ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="w-full flex justify-between">
          <button
            id="furnished"
            value={true}
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              furnished ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            Yes
          </button>
          <button
            id="furnished"
            value={false}
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              !furnished ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onchange}
          placeholder="Property Address"
          className="outline-none px-3 w-full py-2 bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 text-gray-700"
        />
        {!geoLocationEnabled && (
          <div className="flex space-x-6 justify-start">
            <div className="">
              <p className="font-semibold text-lg">Latitude : </p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onchange}
                min="-90"
                max="90"
                required
                className="w-full text-center outline-none px-4 py-2 text-xl bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 text-gray-700 "
              />
            </div>
            <div>
              <p className="font-semibold text-lg">Longitude : </p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onchange}
                min="-180"
                max="180"
                required
                className="w-full text-center outline-none px-4 py-2 text-xl bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 text-gray-700 "
              />
            </div>
          </div>
        )}
        <p className="text-lg font-semibold">Discription</p>
        <textarea
          type="text"
          id="discription"
          value={discription}
          onChange={onchange}
          placeholder="Discription"
          className="outline-none px-3 w-full py-2 bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 text-gray-700"
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="w-full flex justify-between">
          <button
            id="offer"
            value={true}
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              offer ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            Yes
          </button>
          <button
            id="offer"
            value={false}
            type="button"
            onClick={onchange}
            className={`font-medium shadow-md text-sm active:shadow-xl focus:shadow-xl uppercase hover:shadow-xl rounded-xl w-[45%] px-7 py-3 ${
              !offer ? "bg-white text-black" : "text-white bg-slate-600"
            }`}
          >
            No
          </button>
        </div>
        <div className="mt-6">
          <div className="">
            <p className="text-lg  font-semibold">Regular Price</p>
            <div className="flex w-full  justify-between items-center space-x-6">
              <input
                type="number"
                id="Regularprice"
                value={Regularprice}
                onChange={onchange}
                required
                className="w-[70%] text-center outline-none px-4 py-2 text-xl bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  text-gray-700 "
              />
              {type === "rent" && (
                <div>
                  <p className="text-md w-full">$ / Month</p>
                </div>
              )}
              {type === "sale" && <div></div>}
            </div>
          </div>
        </div>
        {offer && (
          <div className="mt-6">
            <div className="">
              <p className="text-lg  font-semibold">Discounted Price</p>
              <div className="flex w-full  justify-between items-center space-x-6">
                <input
                  type="number"
                  id="Discountedprice"
                  value={Discountedprice}
                  onChange={onchange}
                  required
                  className="w-[70%] text-center outline-none px-4 py-2 text-xl bg-white border-2 border-gray-300 rounded transition
          duration-750 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  text-gray-700 "
                />
                {type === "rent" && (
                  <div>
                    <p className="text-md w-full">$ / Month</p>
                  </div>
                )}
                {type === "sale" && <div></div>}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col w-full ">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-sm text-gray-400">
            The first Image will cover (max 6)
          </p>
          <input
            type="file"
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600 cursor-pointer"
            id="images"
            onChange={onchange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
        </div>

        <button
          type="submit"
          className="w-full my-6 bg-blue-600 text-white font-medium px-7 py-3 uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-2xl focus:bg-blue-800 active:bg-blue-800 active:shadow-2xl transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}
