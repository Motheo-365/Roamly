import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/login.css";

function AuthLayout() {
    const location = useLocation();

    return (
        <main className="auth-page">

            {/* LEFT SIDE — NEVER ANIMATES */}
            <section className="auth-visual">
                <div className="auth-overlay">
                    <div className="brand">
                        <span className="brand-name">Roamly</span>
                    </div>

                    <div className="auth-quote">
                        <p>Discover somewhere new.</p>
                        <span>
                            Your journeys, beautifully planned.
                        </span>
                    </div>
                </div>
            </section>

            {/* RIGHT SIDE — ANIMATES */}
            <section className="auth-content">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={location.pathname}
                        className="auth-panel"
                        initial={{
                            x: "100%",
                        }}
                        animate={{
                            x: 0,
                        }}
                        exit={{
                            x:  "-100%",
                        }}
                        transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                      <Outlet />
                    </motion.div>
                </AnimatePresence>
            </section>

        </main>
    );
}

export default AuthLayout;