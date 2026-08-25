import "./config.js";
import tripRepository from "./repositories/tripRepository.js";

async function testTripRepository() {
    try {
        const trips = await tripRepository.getTripsByUserId(0);

        console.log("Trips for user 0:");
        console.log(trips);
    } catch (error) {
        console.error("Repository test failed:", error);
    }
}

testTripRepository();