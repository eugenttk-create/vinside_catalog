const IMG_URL = import.meta.env.VITE_API_IMG_BASE;

export const FALLBACK_IMAGE = new URL(
  "../assets/car_cover.png",
  import.meta.url
).href;

export const resolveImageSrc = (src?: string | null) => {
  if (!src || src.trim() === "") {
    return FALLBACK_IMAGE;
  }

  if (/^(https?:)?\/\//i.test(src)) {
    return src;
  }

  return `${IMG_URL}${src}`;
};
