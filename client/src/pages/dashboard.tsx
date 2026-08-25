import Navigation from "../components/ui/navigation";
import Map from "../components/ui/map";

import "../styles/home.css"

function Dashboard() {
    return (
        <div className="home-page">
            <section className="home-content">
                <Navigation />

                <div className="home-main">
                    <h1>
                        Where will you go next?
                    </h1>

                    <p>
                        Plan your next adventure with Roamly.
                    </p>
                </div>
            </section>

            <section className="home-map">
                <Map />
            </section>

        </div>
    );
}

export default Dashboard;