import { useState } from "react";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function ListingPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setfiles] = useState({});
  const [imageFileUploading, setimageFileUplaoding] = useState(null);
  const [uploadError, setuploadError] = useState(false);
  const [uploadProgress, setuplaodProgress] = useState(null);
  const [uploading, setuploading] = useState(false);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [submitError, setSubmitError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  console.log(formData);
  console.log(formData.imageUrls.length);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setuploading(true);
      setuploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setformData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setuploadError(false);
          setuploading(false);
        })
        .catch((err) => {
          setuploadError("Image upload failed ( 2mb max per each image)");
        });
    } else {
      setuploadError("Error uploading images");
      setuploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      //   setimageFileUplaoding(true);
      //   setuploadError(null);
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);
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
          reject(error);
          //   setuploadError(error);
          //   setimageFileUplaoding(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            // setimageFileUplaoding(false);
          });
        }
      );
    });
  };

  const handleImageDelete = (index) => {
    setformData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setformData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setSubmitError("you must upload atlest one image");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setSubmitError("Discount Price must be lowe than regular Price");
      }
      setSubmitLoading(true);
      setSubmitError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setSubmitLoading(false);
      if (data.succes === false) {
        setSubmitError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setSubmitError(err);
      setSubmitLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Create Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col sm:flex-row'
      >
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-6 flex-wrap pt-3'>
            <div className='flex gap-3 items-center'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className='flex gap-3 items-center'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className='flex gap-3 items-center'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000'
                required
                className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <span>Regular Price</span>
                <span className='font-light text-xs'>($ / Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className='flex gap-3 items-center'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000'
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                />
                <div className='flex flex-col items-center'>
                  <span>Discount Price</span>
                  <span className='font-light text-xs '>($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-3 flex-1 p-4 ml-3'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setfiles(e.target.files)}
              type='file'
              id='images'
              accept='images/*'
              multiple
              className='p-2 border border-gray-400 rounded-lg w-full'
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-2 border border-green-700 text-green-700 uppercase rounded-lg hover:shadow-lg disabled:opacity-80 '
            >
              {uploading ? "Uploading..." : "upload"}
            </button>
          </div>
          {uploadError && <p className='text-red-700 text-sm'>{uploadError}</p>}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className='flex justify-between p-3 items-center'
                key={url}
              >
                <img
                  src={url}
                  alt=''
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleImageDelete(index)}
                  className='text-red-700 p-3 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={submitLoading || uploading}
            className='uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 shadow-lg'
          >
            {submitLoading ? "Creating..." : "Create"}
          </button>
          {submitError && <p className='text-red-700'>{submitError}</p>}
        </div>
      </form>
    </main>
  );
}
