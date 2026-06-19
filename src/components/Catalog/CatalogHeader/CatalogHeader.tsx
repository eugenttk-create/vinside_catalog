import { Home, Search, Menu, X } from "lucide-react";
import { useModels } from "../../../hooks/models/useModels";
import { useParts } from "../../../hooks/parts/useParts";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useBreadcrumbs } from "../../../hooks/breadcrumbs/useBreadcrumbs";
import "./CatalogHeader.css";
import { useState } from "react";
// import Settings from "./Settings/Settings";

interface CatalogHeaderProps {
  isSidebarActive: boolean;
  setIsSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  isSidebarActive,
  setIsSidebarActive,
}) => {
  const [vin, setVin] = useState("");
  // const [isSettingsActive, setIsSettingsActive] = useState(false);
  const {
    handleResetBreadcrumbs,
    handleAddBreadcrumb,
    breadcrumbs,
    handleTrimBreadcrumbs,
  } = useBreadcrumbs();
  const { handleResetParameters } = useParameters();
  const {
    handleResetModels,
    handleCloseCatalog,
    handleSetSelectedBrand,
    isVinSearch,
    handleSetIsVinSearch,
    handleOpenCatalog,
    catalogId,
  } = useModels();
  const { handleResetParts } = useParts();
  const {
    handleResetGroups,
    vinInfo,
    getGroupsByVin,
    searchGroups,
    setIsAiSearch,
    setAiSearchQuery,
    aiSearchQuery,
  } = useGroups();

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

  // const toggleSettings = () => {
  //   setIsSettingsActive(!isSettingsActive);
  // };

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

  const handleSearchParts = async () => {
    if (aiSearchQuery && vinInfo) {
      try {
        const res = await searchGroups(catalogId, vinInfo.carId, aiSearchQuery);
        if (res.meta.requestStatus === "fulfilled") {
          const vinIndex = breadcrumbs.findIndex((b) => b.type === "vin");
          if (vinIndex !== -1) {
            handleTrimBreadcrumbs(vinIndex);
          }
          //@ts-ignore
          if (res.payload.type === "parts") {
            handleAddBreadcrumb("parts-search", aiSearchQuery, aiSearchQuery);
          } else {
            handleResetParts();
            handleAddBreadcrumb("search", aiSearchQuery, aiSearchQuery);
            setIsAiSearch(true);
          }
        }
      } catch (e) {}
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
          {!isVinSearch && (
            <form
              className="catalog-header__input-container"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchByVin();
              }}
            >
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
            </form>
          )}
          {isVinSearch && vinInfo && (
            <div className="catalog-header__input-container">
              <p className="catalog-header__vin-info">
                {vinInfo.brand}&nbsp;&mdash;&nbsp;{vinInfo.model}
                &nbsp;&mdash;&nbsp;{vinInfo.vin}
              </p>
            </div>
          )}
          {isVinSearch && (
            <form
              className="catalog-header__input-container"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchParts();
              }}
            >
              <input
                type="text"
                placeholder="AI Search"
                className="catalog-header__input input"
                id="catalog-header-part-search"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
              />
              <Search
                className="icon catalog-header__icon"
                onClick={handleSearchParts}
              />
            </form>
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
      {/* <div className="catalog-header__right">
        {" "}
        <div className="catalog-header__buttons">
          <button
            className="catalog-header__button icon-button"
            onClick={toggleSettings}
          >
            <SettingsIcon className="icon" />
          </button>
          <button className="catalog-header__button icon-button">
            <User className="icon" />
          </button>
          <Settings isActive={isSettingsActive} />
        </div>
      </div> */}
    </header>
  );
};

export default CatalogHeader;
