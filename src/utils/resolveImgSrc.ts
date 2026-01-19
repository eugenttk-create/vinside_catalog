import CarImage from "../assets/car_cover.png";
const IMG_URL = import.meta.env.VITE_API_IMG_BASE;

export const resolveImageSrc = (src?: string | null) => {
  if (!src) return CarImage;

  if (/^(https?:)?\/\//i.test(src)) {
    return src;
  }

  return `${IMG_URL}${src}`;
};
