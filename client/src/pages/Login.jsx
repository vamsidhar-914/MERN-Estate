import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginStart, LoginSuccess, LoginFailure } from "../redux/userSlice";

export function Login() {
  const [formdata, setformdata] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value });
  };
  console.log(formdata);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(LoginStart());
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        // if (data.statusCode === 500) {
        //   seterror("user already exists");
        // }
        dispatch(LoginFailure(data.message));
        return;
      }
      dispatch(LoginSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(LoginFailure(err.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign in</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 '
      >
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
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
          disabled={loading}
          className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'
        >
          {loading ? "loading..." : "sign in"}
        </button>
      </form>
      <div className='flex gap-2 pt-3'>
        <p>Doesn't have an account?</p>
        <Link to='/register'>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 text-center mt-5'>{error}</p>}
    </div>
  );
}
