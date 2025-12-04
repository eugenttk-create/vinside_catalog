import { Package, Home, SettingsIcon, User, Search } from "lucide-react";
import { useModels } from "../../../hooks/models/useModels";
import { useParts } from "../../../hooks/parts/useParts";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import "./CatalogHeader.css";

const CatalogHeader: React.FC = () => {
  const { handleResetParameters } = useParameters();
  const { handleResetModels, handleCloseCatalog } = useModels();
  const { handleResetParts } = useParts();
  const { handleResetGroups } = useGroups();

  const handleResetAndCloseCatalog = () => {
    handleResetModels();
    handleResetParts();
    handleResetGroups();
    handleResetParameters();
    handleCloseCatalog();
  };

  return (
    <header className="catalog-header">
      <div className="catalog-header__left">
        <button className="catalog-header__button icon-button">
          <Package className="icon" />
        </button>
        <button
          className="catalog-header__button icon-button"
          onClick={handleResetAndCloseCatalog}
        >
          <Home className="icon" />
        </button>
        <div className="catalog-header__input-container">
          <input
            type="text"
            placeholder="VIN"
            className="catalog-header__input input"
            id="catalog-header-vin-input"
          />
          <Search className="icon catalog-header__icon" />
        </div>
        <div className="catalog-header__input-container">
          <input
            type="text"
            placeholder="Search"
            className="catalog-header__input input"
            id="catalog-header-search-input"
          />
          <Search className="icon catalog-header__icon" />
        </div>
      </div>
      <div className="catalog-header__right">
        {" "}
        <button className="catalog-header__button icon-button">
          <SettingsIcon className="icon" />
        </button>
        <button className="catalog-header__button icon-button">
          <User className="icon" />
        </button>
      </div>
    </header>
  );
};

export default CatalogHeader;
