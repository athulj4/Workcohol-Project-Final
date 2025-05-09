import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ImageGallery({ images }) {
  const [mainSliderRef, setMainSliderRef] = useState(null);
  const [thumbnailSliderRef, setThumbnailSliderRef] = useState(null);

  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
  };

  const thumbnailSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: images.length > 4 ? 4 : images.length,
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  // Fallback image if no images are provided
  if (!images || images.length === 0) {
    images = [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg'
    ];
  }

  return (
    <div className="image-gallery">
      <div className="main-slider mb-4">
        <Slider 
          {...mainSettings} 
          ref={slider => setMainSliderRef(slider)}
          asNavFor={thumbnailSliderRef}
        >
          {images.map((image, index) => (
            <div key={index} className="outline-none">
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`Property image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      <div className="thumbnail-slider">
        <Slider 
          {...thumbnailSettings} 
          ref={slider => setThumbnailSliderRef(slider)}
          asNavFor={mainSliderRef}
        >
          {images.map((image, index) => (
            <div key={index} className="outline-none px-1">
              <div className="h-20 md:h-24 cursor-pointer rounded-md overflow-hidden opacity-70 hover:opacity-100 transition-opacity duration-200">
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ImageGallery;