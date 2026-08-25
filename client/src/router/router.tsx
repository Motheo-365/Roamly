import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "../components/navigation";

import Login from "../pages/login";
import Signup from "../pages/signup";
// import Dashboard from "../pages/dashboard";
// import Trips from "../pages/trips";
// import TripDetails from "../pages/tripDetails";

export default function Router() {
  return (
    <BrowserRouter>
        <Navigation/>
        
        <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Application */}
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:tripId" element={<TripDetails />} /> */}

        {/* Fallback */}
        <Route
            path="*"
            element={<Navigate to="/login" replace />}
        />
        </Routes>
    </BrowserRouter>
  );
}