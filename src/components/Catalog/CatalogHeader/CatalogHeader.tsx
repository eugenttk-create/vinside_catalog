import { Home, SettingsIcon, User, Search, Menu, X } from "lucide-react";
import { useModels } from "../../../hooks/models/useModels";
import { useParts } from "../../../hooks/parts/useParts";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useBreadcrumbs } from "../../../hooks/breadcrumbs/useBreadcrumbs";
import "./CatalogHeader.css";
import { useState } from "react";

interface CatalogHeaderProps {
  isSidebarActive: boolean;
  setIsSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  isSidebarActive,
  setIsSidebarActive,
}) => {
  const [vin, setVin] = useState("");
  const { handleResetBreadcrumbs } = useBreadcrumbs();
  const { handleResetParameters } = useParameters();
  const {
    handleResetModels,
    handleCloseCatalog,
    handleSetSelectedBrand,
    isVinSearch,
    handleSetIsVinSearch,
    handleOpenCatalog,
  } = useModels();
  const { handleResetParts } = useParts();
  const { handleResetGroups, vinInfo, getGroupsByVin } = useGroups();

  const handleResetAndCloseCatalog = () => {
    handleSetSelectedBrand("");
    handleResetBreadcrumbs();
    handleResetModels();
    handleResetParts();
    handleResetGroups();
    handleResetParameters();
    handleCloseCatalog();
    handleSetIsVinSearch(false);
  };

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const handleSearchByVin = async () => {
    if (vin !== "") {
      handleResetAndCloseCatalog();
      try {
        handleOpenCatalog();
        await getGroupsByVin(vin);
        handleSetIsVinSearch(true);
        setVin("");
      } catch (error) {}
    }
  };

  return (
    <header className="catalog-header">
      <div className="catalog-header__left">
        <div className="catalog-header__buttons">
          <button
            className="catalog-header__button icon-button"
            onClick={handleResetAndCloseCatalog}
          >
            <Home className="icon" />
          </button>
          <button
            className="catalog-header__button icon-button catalog-header__button_burger"
            onClick={toggleSidebar}
          >
            {isSidebarActive ? (
              <X className="icon" />
            ) : (
              <Menu className="icon" />
            )}
          </button>
        </div>
        <div className="catalog-header__inputs">
          {" "}
          {!isVinSearch && (
            <div className="catalog-header__input-container">
              <input
                type="text"
                placeholder="VIN"
                className="catalog-header__input input"
                id="catalog-header-vin-input"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
              <Search
                className="icon catalog-header__icon"
                onClick={handleSearchByVin}
              />
            </div>
          )}
          {isVinSearch && vinInfo && (
            <div className="catalog-header__input-container">
              <p className="catalog-header__vin-info">
                {vinInfo.brand}&nbsp;&mdash;&nbsp;{vinInfo.model}
                &nbsp;&mdash;&nbsp;{vinInfo.vin}
              </p>
            </div>
          )}
          {/* <div className="catalog-header__input-container">
            <input
              type="text"
              placeholder="Search"
              className="catalog-header__input input"
              id="catalog-header-search-input"
            />
            <Search className="icon catalog-header__icon" />
          </div> */}
        </div>
      </div>
      <div className="catalog-header__right">
        {" "}
        <div className="catalog-header__buttons">
          <button className="catalog-header__button icon-button">
            <SettingsIcon className="icon" />
          </button>
          <button className="catalog-header__button icon-button">
            <User className="icon" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CatalogHeader;
