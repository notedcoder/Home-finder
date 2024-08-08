import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { ImLocation2 } from "react-icons/im";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
const ListingItem = ({ listing, id, onDelete, onEdit }) => {
  return (
    <li className="relative bg-white flex flex-col shadow-md hover:shadow-lg rounded-md overflow-hidden transition duration-150  ">
      <Link to={`/category/${listing.type}/${id}`} className="contents">
        <img
          src={listing.imgUrls[0]}
          alt=""
          className="h-[170px] w-full object-cover hover:scale-105 transition duration-200 ease-in"
          loading={"lazy"}
        />
        <Moment
          fromNow
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-lg px-2 py-1 shadow-lg"
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <ImLocation2 className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold  text-xl truncate ">{listing.name}</p>
          <p className="text-[#557d9d] mt-2 font-semibold">
            $
            {listing.offer
              ? listing.Discountedprice.toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )
              : listing.Regularprice.toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )}
            {listing.type === "rent" && " / month"}
          </p>
          <div className=" flex space-x-3 items-center mt-2">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `1 Bed`}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `1 Bath`}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute right-2 bottom-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute right-2 bottom-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onEdit(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer "
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
};

export default ListingItem;
