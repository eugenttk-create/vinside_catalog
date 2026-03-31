interface Position {
  number: number | string;
  coordinates: [number, number, number, number];
  img?: string;
}

interface ImageOverlayProps {
  positions: Position[];
  hoverImgPos: string | null;
  hoverTablePos: string | null;
  onHoverEnter: (key: string) => void;
  onHoverLeave: () => void;
  onSelect: (key: string) => void;
  computeOverlayStyle: (
    coords: [number, number, number, number]
  ) => React.CSSProperties;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  positions,
  hoverImgPos,
  hoverTablePos,
  onHoverEnter,
  onHoverLeave,
  onSelect,
  computeOverlayStyle,
}) => (
  <>
    {positions.map((p) => {
      const key = String(p.number);
      const style = computeOverlayStyle(p.coordinates);
      return (
        <div
          key={key}
          style={style}
          onMouseEnter={() => onHoverEnter(key)}
          onMouseLeave={onHoverLeave}
          onClick={() => onSelect(key)}
          className={`catalog-parts__highlight ${
            hoverImgPos === key || hoverTablePos === key
              ? "catalog-parts__highlight_active"
              : ""
          }`}
        />
      );
    })}
  </>
);

export default ImageOverlay;
