import React from "react";

const ImageRenderer = ({ value }) => {
  return (
    <img
      src={value}
      alt="Product"
      style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }}
    />
  );
};

export default ImageRenderer;
