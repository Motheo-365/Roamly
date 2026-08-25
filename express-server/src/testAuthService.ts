import authService from "./services/authService.js";

async function test() {

    try {

        const user = await authService.register(
            "test@roamly.com",
            "password123"
        );

        console.log("User created:");
        console.log({
            id: user.id,
            email: user.email
        });

    } catch (error) {
        console.error("Test failed:", error);
    }

    process.exit(0);
}

test();