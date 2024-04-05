import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { ListingItem } from "../components/ListingItem";

export function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setrentListings] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/search?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/search?type=rent&limit=4");
        const data = await res.json();
        setrentListings(data);
        fetchSaleRatings();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchSaleRatings = async () => {
      try {
        const res = await fetch("/api/listing/search?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOfferListings();
  }, []);

  // FIXME: fix image slider in home as well as userListing page.its not loading png images
  return (
    <>
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          This estate hub is the best place to find your next perfect place to
          live
          <br />
          we have wide range of properties for you to choose from
        </div>
        <Link
          className='text-xs sm:text-sm text-blue-800 hover:underline'
          to='/search'
        >
          Lets get started...
        </Link>
      </div>
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent offers
              </h2>
              <Link
                className='text-sm text-blue-800 hover:underline'
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem
                  listing={listing}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for rent
              </h2>
              <Link
                className='text-sm text-blue-800 hover:underline'
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem
                  listing={listing}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for sale
              </h2>
              <Link
                className='text-sm text-blue-800 hover:underline'
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem
                  listing={listing}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
