import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListingItem } from "../components/ListingItem";

export function Search() {
  const [sidebarData, setsidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [listings, setlistings] = useState([]);
  const [showMore, setshowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      offerFromUrl ||
      orderFromUrl
    ) {
      setsidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListing = async () => {
      setshowMore(false);
      setloading(true);
      const searchQuery = urlParams.toString();
      console.log(searchQuery);
      const res = await fetch(`/api/listing/search?${searchQuery}`);
      const data = await res.json();
      if (data.length > 9) {
        setshowMore(true);
      } else {
        setshowMore(false);
      }
      console.log(res);
      setlistings(data);
      setloading(false);
    };
    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setsidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setsidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setsidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setsidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShoeMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/search?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setshowMore(false);
    }
    setlistings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='top-0 p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-7'
        >
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:{" "}
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='search...'
              className='border w-full p-3 rounded-lg focus:outline:none'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label
              htmlFor=''
              className='font-semibold'
            >
              Type:
            </label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent&Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label
              htmlFor=''
              className='font-semibold'
            >
              Amenitites:
            </label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label
              htmlFor=''
              className='font-semibold'
            >
              Sort
            </label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className='border rounded-lg p-3 focus:outline-none'
              id='sort_order'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>latest</option>
              <option value='createdAt_asc'>oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          listing Results
        </h1>
        <div className='p-7 flex flex-wrap gap-2'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listings Found</p>
          )}
          {loading && <p className='text-xl text-center w-full'>Loading...</p>}
          {!loading &&
            listings.map((listing) => (
              <ListingItem
                key={listing._id}
                listing={listing}
              />
            ))}
        </div>
        {showMore && (
          <button
            className='text-green-700 hover:underline p-7 text-center w-full'
            onClick={onShoeMoreClick}
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}
