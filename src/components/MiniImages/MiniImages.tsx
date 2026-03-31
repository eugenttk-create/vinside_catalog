import { useRef } from "react";
import { resolveImageSrc } from "../../utils/resolveImgSrc";

interface MiniImagesProps {
  images: string[];
  activeImg: string;
  onSelect: (img: string) => void;
}

const MiniImages: React.FC<MiniImagesProps> = ({
  images,
  activeImg,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    e.stopPropagation();
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.stopPropagation();
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="catalog-parts__mini-images-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      {images.map((i) => (
        <img
          key={i}
          src={resolveImageSrc(i)}
          alt={i}
          draggable={false}
          className={`catalog-parts__mini-img ${
            activeImg === i ? "catalog-parts__mini-img_active" : ""
          }`}
          onClick={() => activeImg !== i && onSelect(i)}
        />
      ))}
    </div>
  );
};

export default MiniImages;
