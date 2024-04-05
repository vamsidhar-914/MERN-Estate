import { useState } from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

export function ImageSlider({ imageUrls }) {
  const [imageindex, setImageIndex] = useState(0);
  return (
    <div className=''>
      <img src='https://st3.depositphotos.com/1025323/12621/i/450/depositphotos_126213022-stock-photo-vision-of-circular-destination.jpg' />
      <button>
        <ArrowBigLeft />
      </button>
      <button>
        <ArrowBigRight />
      </button>
    </div>
  );
}
