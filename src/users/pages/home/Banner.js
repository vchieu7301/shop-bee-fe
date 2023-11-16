import React from "react";
import { Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Banner_1 from "../../assets/Banner_1.png";
import Banner_2 from "../../assets/Banner_2.png";
import Banner_3 from "../../assets/Banner_3.png";

const images = [Banner_1, Banner_2, Banner_3];

const Banner = () => {

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", position: "relative" }}>
     <Carousel
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            infiniteLoop
            stopOnHover
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  maxWidth: "100%",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <img
                  src={image}
                  alt={`#${index + 1}`}
                  style={{ width: "100%" }}
                />
              </Box>
            ))}
          </Carousel>
    </Box>
  );
};

export default Banner;
