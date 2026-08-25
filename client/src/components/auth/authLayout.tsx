import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from 'react';

import { authQuotes } from "../../data/authQuotes"

import "../../styles/login.css";

function AuthLayout() {
    const location = useLocation();
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((current) => (current + 1) % authQuotes.length);
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    });

    const currentQuote = authQuotes[quoteIndex];

    return (
        <main className="auth-page">

            {/* LEFT SIDE — NEVER ANIMATES */}
            <section className="auth-visual">
                <div className="auth-overlay">
                    <div className="brand">
                        <span className="brand-name">Roamly</span>
                    </div>

                    <div className="auth-quote">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={quoteIndex}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -20
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36,1]
                                }}
                            >

                            </motion.div>
                        </AnimatePresence>
                        <p>{ currentQuote.quote }</p>
                        <span>
                            { currentQuote.subtitle }
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