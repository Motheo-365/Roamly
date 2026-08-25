import "./config.js";
import tripService from "./services/tripService.js";

async function testTripService() {
    try {
        const trips = await tripService.getTripsByUserId(0);

        console.log("Trips returned by TripService:");
        console.log(trips);

    } catch (error) {
        console.error("Service test failed:", error);
    }
}

testTripService();