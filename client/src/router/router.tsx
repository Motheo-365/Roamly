import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "../pages/login";
import Signup from "../pages/signup";
import Dashboard from "../pages/dashboard"
import TripDashboard from "../pages/tripDashboard";

import AuthLayout from "../components/auth/authLayout";

function ApplicationRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            <Route path="/" element={<Dashboard />} />

            <Route
                path="/trips/:tripId"
                element={<TripDashboard />}
            />

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}

export default function Router() {
    return (
        <BrowserRouter>
            <ApplicationRoutes />
        </BrowserRouter>
    );
}