import { buildHoverTargetMap } from "../../utils/positionGropus";
import { useMemo } from "react";

interface Position {
  number: number | string;
  coordinates: [number, number, number, number];
  img?: string;
}

interface ImageOverlayProps {
  positions: Position[];
  hoverImgPos: string | null;
  hoverTablePos: string | null;
  selectedPos: string | null;
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
  selectedPos,
}) => {
  const hoverTargetMap = useMemo(
    () => buildHoverTargetMap(positions),
    [positions]
  );

  return (
    <>
      {positions.map((p, idx) => {
        const key = String(p.number);
        const ck = p.coordinates.join(",");
        const hoverTarget = hoverTargetMap.get(ck) ?? key;
        const style = computeOverlayStyle(p.coordinates);

        const isActive =
          hoverImgPos === key || hoverTablePos === key || selectedPos === key;

        return (
          <div
            key={`${key}-${idx}`}
            style={style}
            onMouseEnter={() => onHoverEnter(hoverTarget)}
            onMouseLeave={onHoverLeave}
            onClick={() => onSelect(hoverTarget)}
            className={`catalog-parts__highlight ${
              isActive ? "catalog-parts__highlight_active" : ""
            }`}
          />
        );
      })}
    </>
  );
};

export default ImageOverlay;
