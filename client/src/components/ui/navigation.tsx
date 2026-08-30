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
        if (location.pathname !== "/home") return;

        const sections = ["home", "explore", "trips"];

        const handleScroll = () => {
            let visibleSection = "home";
            let closestDistance = Number.POSITIVE_INFINITY;

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (!element) continue;

                const rect = element.getBoundingClientRect();
                const viewportCenter = window.innerHeight * 0.35;
                const distance = Math.abs(rect.top - viewportCenter);

                if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                    setActiveSection(sectionId);
                    return;
                }

                if (distance < closestDistance) {
                    closestDistance = distance;
                    visibleSection = sectionId;
                }
            }

            setActiveSection(visibleSection);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [location.pathname]);

    if (location.pathname !== "/home") {
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