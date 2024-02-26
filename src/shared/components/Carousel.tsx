import React, { useState } from "react";
import { Image, Video } from "../types";
// import { Image, Video } from "./types";

interface CarouselProps {
  images: Image[];
  videos: Video[];
}

const Carousel: React.FC<CarouselProps> = ({ images, videos }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % (images.length + videos.length));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (currentSlide - 1 + (images.length + videos.length)) %
        (images.length + videos.length),
    );
  };

  return (
    <div className="carousel">
      {(images.length > 0 || videos.length > 0) && (
        <div className={`slide ${currentSlide === 0 ? "active" : ""}`}>
          {images.length > 0 && (
            <img
              src={images[currentSlide].src}
              alt={images[currentSlide].alt}
            />
          )}
          {videos.length > 0 && (
            <video controls>
              <source
                src={videos[currentSlide - images.length].src}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
      <button onClick={prevSlide}>Previous</button>
      <button onClick={nextSlide}>Next</button>
    </div>
  );
};

export default Carousel;
