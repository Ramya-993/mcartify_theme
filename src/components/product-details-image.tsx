import Image from "next/image";
import React, { useState } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Don't forget to import these CSS files in your _app.tsx or layout file
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/navigation';

interface Iimage {
  imageURL: string;
}

interface IproductImages {
  images: Iimage[];
}

const ProductImage = ({ images }: IproductImages) => {
  const [selectedImage, setSelectedImage] = useState(images && images.length > 0 ? images[0].imageURL : "");

  // Function to handle thumbnail click
  const handleThumbnailClick = (imageURL: string) => {
    setSelectedImage(imageURL);
  };

  return (
    <div>
      {/* Main Selected Image */}
      <div className="main-image-container mb-4">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Selected product image"
            height={500}
            width={500}
          />
        )}
      </div>

      {/* Thumbnails Swiper */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images?.map((image, id) => (
          <div
            key={id}
            onClick={() => setSelectedImage(image.imageURL)}
            className={`
              relative shrink-0 cursor-pointer border-2 transition-all
              ${
                selectedImage === image.imageURL
                  ? "border-blue-500"
                  : "border-transparent"
              }
            `}
            style={{ width: "100px", height: "100px" }}
          >
            <Image
              src={image.imageURL}
              alt="Product thumbnail"
              fill
              className="object-fit"
            />
          </div>
        ))}
      </div>
    
    </div>
  );
};

export default ProductImage;