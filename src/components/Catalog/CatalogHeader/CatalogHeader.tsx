import styles from "./CatalogHeader.module.css";
import shared from "../../../styles/common.module.css";
import { Home, Search, Menu, X, Settings as SettingsIcon } from "lucide-react";
import { useModels } from "../../../hooks/models/useModels";
import { useParts } from "../../../hooks/parts/useParts";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useBreadcrumbs } from "../../../hooks/breadcrumbs/useBreadcrumbs";
import { useOE } from "../../../hooks/OE/useOE";
import { useAnalogs } from "../../../hooks/analogs/useAnalogs";

import { useState } from "react";
import Settings from "./Settings/Settings";

interface CatalogHeaderProps {
  isSidebarActive: boolean;
  setIsSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  isSidebarActive,
  setIsSidebarActive,
}) => {
  const [vin, setVin] = useState("");
  const [oeQuery, setOeQuery] = useState("");
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const { handleResetOE, OE, isOESearch, getOE, setIsOESearch } = useOE();
  const { handleResetAnalogs } = useAnalogs();
  const { handleResetBreadcrumbs, handleAddBreadcrumb } = useBreadcrumbs();
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
    handleResetOE();
    handleResetAnalogs();
  };

  const toggleSettings = () => {
    setIsSettingsActive(!isSettingsActive);
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

  const handleSearchByOE = async () => {
    if (oeQuery) {
      try {
        const res = await getOE(oeQuery);
        if (res.meta.requestStatus === "fulfilled") {
          handleResetGroups();
          handleResetParts();
          handleResetParameters();
          handleResetAnalogs();
          handleSetIsVinSearch(false);
          setIsOESearch(true);
          handleAddBreadcrumb("oe", oeQuery, oeQuery);
          setOeQuery("");
        }
      } catch (error) {}
    }
  };

  return (
    <header className={styles["catalog-header"]}>
      <div className={styles["catalog-header__left"]}>
        <div className={styles["catalog-header__buttons"]}>
          <button
            className={`${shared["catalog-header__button"]} ${shared["icon-button"]}`}
            onClick={handleResetAndCloseCatalog}
          >
            <Home className={shared["icon"]} />
          </button>
          <button
            className={`${shared["catalog-header__button"]} ${shared["icon-button"]} ${styles["catalog-header__button_burger"]}`}
            onClick={toggleSidebar}
          >
            {isSidebarActive ? (
              <X className={shared["icon"]} />
            ) : (
              <Menu className={shared["icon"]} />
            )}
          </button>
        </div>
        <div className={styles["catalog-header__inputs"]}>
          {isOESearch && OE && (
            <div className={styles["catalog-header__input-container"]}>
              <p className={styles["catalog-header__vin-info"]}>{OE.oe_number}</p>
            </div>
          )}
          {!isVinSearch && (
            <form
              className={styles["catalog-header__input-container"]}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchByVin();
              }}
            >
              <input
                type="text"
                placeholder="VIN"
                className={`${styles["catalog-header__input"]} ${shared["input"]}`}
                id="catalog-header-vin-input"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
              <Search
                className={`${shared["icon"]} ${styles["catalog-header__icon"]}`}
                onClick={handleSearchByVin}
              />
            </form>
          )}
          {isVinSearch && vinInfo && (
            <div className={styles["catalog-header__input-container"]}>
              <p className={styles["catalog-header__vin-info"]}>
                {vinInfo.brand}&nbsp;&mdash;&nbsp;{vinInfo.model}
                &nbsp;&mdash;&nbsp;{vinInfo.vin}
              </p>
            </div>
          )}
          {isVinSearch && (
            <form
              className={styles["catalog-header__input-container"]}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchByOE();
              }}
            >
              <input
                type="text"
                placeholder="OE Number"
                className={`${styles["catalog-header__input"]} ${shared["input"]}`}
                id="catalog-header-oe-search"
                value={oeQuery}
                onChange={(e) => setOeQuery(e.target.value)}
              />
              <Search
                className={`${shared["icon"]} ${styles["catalog-header__icon"]}`}
                onClick={handleSearchByOE}
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
      <div className={styles["catalog-header__right"]}>
        <div className={styles["catalog-header__buttons"]}>
          <button
            className={`${shared["catalog-header__button"]} ${shared["icon-button"]}`}
            onClick={toggleSettings}
            type="button"
            aria-label="Settings"
          >
            <SettingsIcon className={shared["icon"]} />
          </button>
          <Settings isActive={isSettingsActive} />
        </div>
      </div>
    </header>
  );
};

export default CatalogHeader;
