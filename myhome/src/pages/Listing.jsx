import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Spinner } from "../components/Spinner";
import SwiperCore, {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
} from "swiper";
import { ImLocation2 } from "react-icons/im";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { BsShareFill } from "react-icons/bs";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLandLord, setContactLandLord] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const params = useParams();
  const auth = getAuth();
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    setLoading(true);
    async function fetchListingDetails() {
      const id = params.listingId;
      const docRef = doc(db, "listings", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListingDetails();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="relative">
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="absolute top-[13%] lg:top-[10%] right-[3%] z-50 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <BsShareFill className="text-lg font-light text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p className="absolute z-50 p-2 top-[30%] lg:top-[22%] right-[8%] lg:right-[5%] font-semibold border-2 border-slate-400 rounded-md bg-white">
          Link Copied
        </p>
      )}

      <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        {/* details */}
        <div className="w-full h-auto">
          <p className="text-2xl font-bold mb-3 text-blue-900 ">
            {listing.name} - ${" "}
            {listing.offer
              ? listing.Discountedprice.toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )
              : listing.Regularprice.toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center space-x-4 font-semibold mb-2">
            <ImLocation2 className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%] mt-3">
            <p className="bg-red-800 text-white w-full max-w-[200px] rounded-md p-1 text-center font-semibold shadow-md">
              For {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-800 text-white w-full max-w-[200px] rounded-md p-1 text-center font-semibold shadow-md">
                ${+listing.Regularprice - +listing.Discountedprice} discount
              </p>
            )}
          </div>

          <p className="mt-3 mb-2">
            <span className="font-semibold">Description - </span>
            {listing.discription}
          </p>

          <ul className="flex items-center space-x-2 lg:space-x-10 text-sm mt-3 mb-6">
            <li className="flex items-center whitespace-nowrap font-semibold ">
              <FaBed className=" text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap font-semibold ">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap font-semibold ">
              <FaParking className="text-lg mr-1" />
              {+listing.parking
                ? `
              Parking Spot`
                : "Not Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap font-semibold ">
              <FaChair className="text-lg mr-1" />
              {+listing.furnished
                ? `
              Furnished`
                : "Not furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandLord && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setContactLandLord(true);
                }}
                className="px-7 py-3 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duyration-150 ease-in-out"
              >
                Contact LandLord
              </button>
            </div>
          )}
          {contactLandLord && <Contact listing={listing} />}
        </div>
        {/* map */}
        <div className=" bg-blue-400 h-[200px] w-full md:h-[400px] mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.latitude, listing.longitude]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listing.latitude, listing.longitude]}>
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
          ,
        </div>
      </div>
    </main>
  );
};

export default Listing;
