import { motion } from "framer-motion";
import { useState } from "react";

import Navigation from "../components/ui/navigation";
import Map from "../components/ui/map";
import Carousel from "../components/ui/carousel";
import Explore from "./explore";
import CreateTrip from "./createTrip";
import Budget from "./budget";

import type { LocationResult } from "../services/locationServices"

import "../styles/home.css"

function Dashboard() {
    const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);

    return (
        <div className="home-page">
            <Navigation />

            <div className="narrative-content">
                <motion.section
                    id="home"
                    className="home-content narrative-section"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <div className="home-main">
                        <h1>Where will you go next?</h1>
                        <p>Plan your next adventure with Roamly.</p>
                    </div>

                    <Carousel />
                </motion.section>

                <motion.section
                    id="explore"
                    className="narrative-section explore-section"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <Explore onLocationSelect={setSelectedLocation}/>
                </motion.section>

                <motion.section
                    id="trips"
                    className="narrative-section trips-section"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <CreateTrip />
                </motion.section>

                <motion.section
                    id="budget"
                    className="narrative-section budget-section"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.7, ease: "easeOut" }} 
                >
                    <Budget/>
                </motion.section>
            </div>

            <aside className="home-map">
                <Map selectedLocation={selectedLocation}/>
            </aside>

    </div>
    );
}

export default Dashboard;