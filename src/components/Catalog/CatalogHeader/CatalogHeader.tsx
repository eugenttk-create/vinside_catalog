import { Package, Home, SettingsIcon, User, Search } from "lucide-react";
import "./CatalogHeader.css";

const CatalogHeader: React.FC = () => {
  return (
    <header className="catalog-header">
      <div className="catalog-header__left">
        <button className="catalog-header__button icon-button">
          <Package className="icon" />
        </button>
        <button className="catalog-header__button icon-button">
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
