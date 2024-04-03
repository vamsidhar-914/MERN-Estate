import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Contact({ data, setcontact }) {
  const [landlord, setlandlord] = useState(null);
  const [message, setmessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${data.userRef}`);
        const result = await res.json();
        setlandlord(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [data.userRef]);

  return (
    <div>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between'>
            <p>
              Contact <span className='font-semibold'>{landlord.username}</span>{" "}
              for{" "}
              <span className='font-semibold'>{data.name.toLowerCase()}</span>
            </p>
            <button
              className='text-red-700 hover:underline'
              onClick={() => setcontact(false)}
            >
              X
            </button>
          </div>
          <textarea
            className='w-full border border-gray-700 p-3 rounded-lg'
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            placeholder='enter your message'
          />
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${data.name}&body=${message}`}
            className='bg-slate-700 text-white p-3 text-center rounded-lg uppercase hover:opacity-95'
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
