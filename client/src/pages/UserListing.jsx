import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Contact } from "../components/Contact";

export function UserListing() {
  SwiperCore.use(Navigation);
  const params = useParams();
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setloading(true);
        const listingId = params.id;
        const res = await fetch(`/api/listing/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          seterror(true);
          setloading(false);
          return;
        }
        setdata(data);
        setloading(false);
      } catch (err) {
        seterror(true);
        setloading(false);
        seterror(false);
      }
    };
    fetchListing();
  }, [params.id]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>something went wrong!</p>
      )}
      {data && !loading && !error && (
        <div>
          <Swiper navigation>
            {data.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[450px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-3'>
            <p className='text-2xl font-semibold'>
              {data.name} - ${" "}
              {data.offer
                ? data.discountPrice.toLocaleString("en-US")
                : data.regularPrice.toLocaleString("en-US")}
              {data.type === "rent" && " / month"}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {data.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {data.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {data.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+data.regularPrice - +data.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {data.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {data.bedrooms > 1
                  ? `${data.bedrooms} beds `
                  : `${data.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {data.bathrooms > 1
                  ? `${data.bathrooms} baths `
                  : `${data.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {data.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {data.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && data.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white p-3 mt-3 rounded-lg uppercase hover:opactiy-95'
              >
                contact landlord
              </button>
            )}
            {contact && (
              <Contact
                data={data}
                setcontact={setContact}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
