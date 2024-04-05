import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  updateStart,
  updateFailure,
  updateSucces,
  deleteUserStart,
  logoutSuccess,
  deleteUserFailure,
  deleteUserSuccess,
} from "../redux/userSlice";
import { Link } from "react-router-dom";

export function Profile() {
  const [formdata, setformdata] = useState({});
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setuplaodProgress] = useState(null);
  const [uplaodError, setuploadError] = useState(null);
  const [imageFileUploading, setimageFileUplaoding] = useState(null);
  const [imageURL, setimageURL] = useState(null);
  const [updateSuccess, setupdateSuccess] = useState(null);
  const filepickerRef = useRef(null);
  const dispatch = useDispatch();
  const [showListingError, setshowListingError] = useState(false);
  const [userListings, setuserListings] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setimageURL(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const uploadimage = () => {
      setimageFileUplaoding(true);
      setuploadError(null);
      const name = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("upload is" + progress + "% done");
          setuplaodProgress(Math.round(progress));
          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          setuploadError(error);
          setimageFileUplaoding(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setformdata((prev) => ({ ...prev, profilePicture: downloadURL }));
            setimageFileUplaoding(false);
          });
        }
      );
    };
    imageFile && uploadimage();
  }, [imageFile]);

  const handlelogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSucces(data));
      setupdateSuccess("updated successfully");
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleListings = async () => {
    try {
      setshowListingError(false);
      const res = await fetch(`/api/users/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setshowListingError(true);
        return;
      }
      setuserListings(data);
    } catch (err) {
      console.log(err.message);
      setshowListingError(true);
    }
  };

  const handleDeleteListings = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setuserListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <input
          type='file'
          onChange={handleImageChange}
          accept='image/*'
          ref={filepickerRef}
          hidden
        />
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
          <img
            src={imageURL || currentUser.profilePicture}
            alt='user'
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
            onClick={() => filepickerRef.current.click()}
          />
        </div>
        <p className='text-sm self-center'>
          {uplaodError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : uploadProgress > 0 && uploadProgress < 100 ? (
            <span className='text-slate-700'>{`Uploading ${uploadProgress}%`}</span>
          ) : uploadProgress === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.email}
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading || imageFileUploading}
          className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'
        >
          update
        </button>
        <button className='p-3 bg-blue-600 text-white rounded-lg uppercase hover:bg-blue-500'>
          <Link to='/listing'>
            <p>Create Listing</p>
          </Link>
        </button>
      </form>
      {updateSucces && (
        <div className='text-green-800 my-5 text-center'>{updateSuccess}</div>
      )}
      <div className='flex justify-between mt-3 text-red-600'>
        <span
          className='cursor-pointer hover:underline'
          onClick={handleDelete}
        >
          Delete Account
        </span>
        <span
          onClick={handlelogout}
          className='cursor-pointer hover:underline'
        >
          Sign Out
        </span>
      </div>
      <button
        className='text-green-700 w-full'
        onClick={handleListings}
      >
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingError ? "Error showing Listings..." : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your listings
          </h1>
          {userListings.map((listing) => (
            <div
              className='flex justify-between border border-gray-300 rounded-lg p-2 mb-2'
              key={listing._id}
            >
              <div className='flex items-center'>
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='image'
                    className='w-16 h-16 object-contain'
                  />
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <p className='truncate ml-3 font-semibold  hover:underline'>
                    {listing.name}
                  </p>
                </Link>
              </div>
              <div className='flex flex-col gap-1 justify-center items-center'>
                <button
                  onClick={() => handleDeleteListings(listing._id)}
                  className='text-red-700'
                >
                  DELETE
                </button>
                <Link to={`/editListing/${listing._id}`}>
                  <button className='text-green-700'>EDIT</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
