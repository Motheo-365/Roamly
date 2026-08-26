import { useLocation } from "react-router-dom";
import "../../styles/navigation.css";

const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
};

function Navigation() {
    const location = useLocation();

    if (location.pathname !== "/") {
        return null;
    }

    return (
        <nav className="navigation">
            <div className="navigation-brand">
                <button
                    type="button"
                    className="brand-link"
                    onClick={() => scrollToSection("home")}
                >
                </button>
            </div>

            <div className="navigation-links">
                <button type="button" onClick={() => scrollToSection("home")}>
                    Home
                </button>

                <button type="button" onClick={() => scrollToSection("explore")}>
                    Explore
                </button>

                <button type="button" onClick={() => scrollToSection("explore")}>
                    About
                </button>

                <button type="button" onClick={() => scrollToSection("home")}>
                    Profile
                </button>
            </div>
        </nav>
    );
}

export default Navigation;