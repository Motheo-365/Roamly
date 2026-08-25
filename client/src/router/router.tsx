import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Login from "../pages/login";
import Signup from "../pages/signup";
import AuthLayout from "../components/auth/authLayout";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}