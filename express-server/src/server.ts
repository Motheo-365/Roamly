import "./config.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Roamly API running on port ${PORT}`);
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});

server.on("close", () => {
    console.log("SERVER CLOSED");
});