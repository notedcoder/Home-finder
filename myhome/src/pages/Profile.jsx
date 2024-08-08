import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
const Profile = () => {
  const auth = getAuth();
  const [edit, setEdit] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const navigate = useNavigate();
  const onLogout = () => {
    auth.signOut();
  };
  const handleOnChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update the displayName in the firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //update in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: name,
        });
        toast.success("Profile Details Update");
      }
    } catch (error) {
      toast.error("Could not save the changes");
    }
  };

  useEffect(() => {
    async function fetchUserListing() {
      const listingRef = collection(db, "listings");

      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    }
    fetchUserListing();
  }, [auth.currentUser.uid]);

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const docRef = doc(db, "listings", id);
      await deleteDoc(docRef);
      const updatedListings = listings.filter((listing) => {
        return listing.id !== id;
      });
      setListings(updatedListings);
      toast.success("Listing deleted successfully");
    }
  };
  const onEdit = (id) => {
    navigate(`/edit-listing/${id}`);
  };
  return (
    <>
      <section className="max-w-6xl mx-auto flex flex-col justify-center items-center">
        <h1 className="text-3xl text-center mt-6 font-bold">Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form action="">
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleOnChange}
              disabled={!edit}
              className={`mb-6 w-full px-[15px] py-[2px] text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out ${
                edit ? "bg-red-200" : "bg-transparent"
              }`}
            />
            <input
              type="text"
              id="email"
              value={email}
              className="mb-6 w-full px-[15px] py-[2px] text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out"
              disabled
            />
            <div className="flex justify-between text-sm md:text-base ">
              <p className="flex items-center">
                Do you want to change your name?
                <span
                  onClick={() => {
                    edit && onSubmit();
                    setEdit(!edit);
                  }}
                  className="text-red-600 hover:text-red-700 active:text-red-800 cursor-pointer transition duration-150 ease-in-out ml-1"
                >
                  {!edit ? "Edit" : "Save Changes"}
                </span>
              </p>
              <Link
                to={"/"}
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out cursor-pointer"
              >
                Sign out
              </Link>
            </div>
          </form>

          <button
            type="button"
            className="mt-[1.5rem] w-full bg-blue-600 text-white uppercase px-7 py-3 rounded shadow-md hover:bg-blue-700 transition duration-150 hover:shadow-lg active:bg-blue-800 font-medium "
          >
            <Link
              to={"/create-listing"}
              className="flex justify-center items-center"
            >
              <FcHome className="mr-[1rem] text-3xl rounded-full bg-red-200 p-1 border-2 border-red-200" />
              Sell or Rent Your Home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="my-10 text-2xl text-center font-semibold ">
              My Listings
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 mt-6 mb-6 gap-4">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
