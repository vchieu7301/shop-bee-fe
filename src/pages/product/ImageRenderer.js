import React from "react";

const ImageRenderer = ({ value }) => {
  const apiUrl = process.env.REACT_APP_API_URL; 
  const imageUrl = apiUrl + "/images/" + value;
  return (
    <img
      src={imageUrl}
      alt="product_img"
      style={{
        maxWidth: "20%",
    maxHeight: "20%",
    width: "auto",
    height: "auto",
    display: "block",
  }}
    />
  );
};

export default ImageRenderer;
