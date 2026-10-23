import catalogPartsStyles from "../Catalog/CatalogMain/CatalogParts/CatalogParts.module.css";
import { MIN_SCALE, MAX_SCALE } from "../../utils/constants";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}) => (
  <div className={catalogPartsStyles["catalog-parts__zoom-controls"]}>
    <button
      className={catalogPartsStyles["catalog-parts__zoom-btn"]}
      onClick={onZoomOut}
      disabled={scale <= MIN_SCALE}
    >
      −
    </button>
    <span
      className={catalogPartsStyles["catalog-parts__zoom-value"]}
      onClick={onReset}
      style={{ cursor: "pointer" }}
      title="Сбросить масштаб"
    >
      {Math.round(scale * 100)}%
    </span>
    <button
      className={catalogPartsStyles["catalog-parts__zoom-btn"]}
      onClick={onZoomIn}
      disabled={scale >= MAX_SCALE}
    >
      +
    </button>
  </div>
);

export default ZoomControls;
