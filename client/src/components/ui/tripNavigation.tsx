import { useLocation, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import "../../styles/navigation.css";

const scrollToSection = (sectionId: string) => {
  if (sectionId === "top" || sectionId === "home") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    return;
  }

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

function TripNavigation() {
  const location = useLocation();
  const { tripId } = useParams();

  const [activeSection, setActiveSection] = useState<string>("home");
  const basePath = tripId ? `/trips/${tripId}` : "";

  // Track scroll position to highlight section in view
  useEffect(() => {
    // Only track scroll if on the main dashboard page
    if (!tripId || location.pathname !== basePath) {
      return;
    }

    const sections = ["home", "itinerary", "budget"];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Triggers when section enters top-middle viewport
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [location.pathname, basePath, tripId]);

  if (!tripId) {
    return null;
  }

  const displayedSection =
    location.pathname.includes("/itinerary")
      ? "itinerary"
      : location.pathname.includes("/budget")
        ? "budget"
        : activeSection;

  return (    
    <nav className="trip-navigation">
      <div className="navigation-links">
         <Link 
            to="/home" 
            className="navigation-home-link"
        >
            ←
        </Link>

        <button
          type="button"
          className={displayedSection === "itinerary" ? "active" : ""}
          onClick={() => scrollToSection("itinerary")}
        >
          Itinerary
        </button>

        <button
          type="button"
          className={displayedSection === "budget" ? "active" : ""}
          onClick={() => scrollToSection("budget")}
        >
          Budget
        </button>
      </div>
    </nav>
  );
}

export default TripNavigation;