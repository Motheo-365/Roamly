import { motion } from "framer-motion";
import Navigation from "../components/ui/navigation";
import Map from "../components/ui/map";
import Explore from "./explore";

import "../styles/home.css"

function Dashboard() {
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
                </motion.section>

                <motion.section
                    id="explore"
                    className="narrative-section explore-section"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <Explore />
                </motion.section>
            </div>

            <aside className="home-map">
                <Map />
            </aside>

        </div>
    );
}

export default Dashboard;