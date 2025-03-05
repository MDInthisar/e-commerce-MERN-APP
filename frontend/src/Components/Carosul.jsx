import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import './Carosul.css'
import img1 from "../assets/c1.png";
import img2 from "../assets/c2.png";
import img3 from "../assets/c3.png";
import img4 from "../assets/c4.png";
import img5 from "../assets/c5.png";

const Carosul = () => {
  return (
    <div className="carousel-container">
    <Carousel
      className="carousel"
      showIndicators={true}
      centerMode={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={1500}
      showThumbs={false}
    >
      <div>
        <img src={img1} alt="Image 1" />
      </div>
      <div>
        <img src={img4} alt="Image 4" />
      </div>
      <div>
        <img src={img5} alt="Image 5" />
      </div>
      <div>
        <img src={img2} alt="Image 2" />
      </div>
      <div>
        <img src={img3} alt="Image 3" />
      </div>
    </Carousel>
  </div>
  )
}

export default Carosul