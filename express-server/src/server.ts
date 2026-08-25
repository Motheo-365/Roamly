// Starts the application
import "./config.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Roamly API running on port ${PORT}`);
});