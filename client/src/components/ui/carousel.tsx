import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { images } from "../../data/images";
import "../../styles/carousel.css";

function Carousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => current === images.length - 1 ? 0 : current + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (images.length === 0) {
        return null;
    }

    const activeImage = images[activeIndex];

    return (
        <section className="travel-carousel" aria-label="Travel inspiration">
            <div className="carousel-frame">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                        key={activeImage.link}
                        className="carousel-image"
                        src={activeImage.link}
                        alt={activeImage.caption}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                </AnimatePresence>

                <div className="carousel-caption">
                    <span>
                        {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                    </span>
                    <p>{activeImage.caption}</p>
                </div>
            </div>

            <div className="carousel-dots" role="tablist" aria-label="Choose travel image">
                {images.map((image, index) => (
                    <button
                        key={image.link}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Show image ${index + 1}`}
                        className={index === activeIndex ? "carousel-dot active" : "carousel-dot"}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </section>
    );
}

export default Carousel;