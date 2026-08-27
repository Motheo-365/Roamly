import { useState, useEffect } from "react";
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
    const [activeSection, setActiveSection] = useState<string>("home");

    useEffect(() => {
        if (location.pathname !== "/") return;

        const sections = ["home", "explore", "trips", "budget"];
        
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200; // Offset for navbar header height

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;

                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Trigger initial state check

        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    if (location.pathname !== "/") {
        return null;
    }

    return (
        <nav className="navigation">
            <div className="navigation-links">
                <button 
                    type="button" 
                    className={activeSection === "home" ? "active" : ""} 
                    onClick={() => scrollToSection("home")}
                >
                    Home
                </button>

                <button 
                    type="button" 
                    className={activeSection === "explore" ? "active" : ""} 
                    onClick={() => scrollToSection("explore")}
                >
                    Explore
                </button>

                <button 
                    type="button" 
                    className={activeSection === "trips" ? "active" : ""} 
                    onClick={() => scrollToSection("trips")}
                >
                    Trips
                </button>
            </div>
        </nav>
    );
}

export default Navigation;