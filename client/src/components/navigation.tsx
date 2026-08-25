import { NavLink } from "react-router-dom";
import "../styles/navigation.css"

function Navigation() {
    return (
        <nav className="navigation">
            <div className="navigation-brand">
                <NavLink to="/" className="brand-link">
                    <span className="brand-mark">R</span>
                    <span className="brand-name">Roamly</span>
                </NavLink>
            </div>

            <div className="navigation-links">
                <NavLink to="/" end>
                    Home
                </NavLink>

                <NavLink to="/posts">
                    Posts
                </NavLink>

                <NavLink to="/about">
                    About
                </NavLink>

                <NavLink to="/profile">
                    Profile
                </NavLink>
            </div>
        </nav>
    );
}

export default Navigation;