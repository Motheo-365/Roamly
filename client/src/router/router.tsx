import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Login from "../pages/login";
import Signup from "../pages/signup";
import Dashboard from "../pages/dashboard"

import AuthLayout from "../components/auth/authLayout";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authenitication */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>

                {/* Application */}
                <Route path="/" element={<Dashboard/>} />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}