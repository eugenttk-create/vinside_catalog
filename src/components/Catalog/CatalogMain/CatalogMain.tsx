import "./CatalogMain.css";
import CatalogModels from "./CatalogModels/CatalogModels";

interface CatalogMainProps {
  catalogId: string;
}

const CatalogMain: React.FC<CatalogMainProps> = ({ catalogId }) => {
  return (
    <div className="catalog-main">
      <CatalogModels catalogId={catalogId} />
    </div>
  );
};

export default CatalogMain;
