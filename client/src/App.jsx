import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import ScrolltoTop from "./components/ScrollToTop";
import { Register } from "./pages/Register";
import { PrivateRoute } from "./components/PrivateRoute";
import { useSelector } from "react-redux";
import { ListingPage } from "./pages/ListingPage";
import { UserListing } from "./pages/UserListing";
import { EditListing } from "./pages/EditListing";

export default function () {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <ScrolltoTop />
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/about'
          element={<About />}
        />
        <Route element={<PrivateRoute />}>
          <Route
            path='/profile'
            element={<Profile />}
          />
          <Route
            path='/listing'
            element={<ListingPage />}
          />
          <Route
            path='/listing/:id'
            element={<UserListing />}
          />
          <Route
            path='/editListing/:id'
            element={<EditListing />}
          />
        </Route>
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}
