import styles from "./Widget.module.css";
import shared from "../../styles/common.module.css";
import { useState, useEffect, useRef } from "react";
import { useCatalogs } from "../../hooks/catalogs/useCatalogs";
import { useModels } from "../../hooks/models/useModels";
import { useGroups } from "../../hooks/groups/useGroups";
import { useOE } from "../../hooks/OE/useOE";
import { useBreadcrumbs } from "../../hooks/breadcrumbs/useBreadcrumbs";
import { useTranslation } from "../../hooks/translation/useTranslation";
import { resolveImageSrc } from "../../utils/resolveImgSrc";
import { Search, X } from "lucide-react";
import { Notifications } from "../Notifications/Notifications";
import DefaultLoader from "../Loaders/DefaultLoader/DefaultLoader";
import RegionSelectPopup from "../RegionSelectPopup/RegionSelectPopup";

const Widget: React.FC = () => {
  const { t } = useTranslation();
  const [vin, setVin] = useState("");
  const { catalogs, getCatalogs, catalogsLoading, catalogsError } =
    useCatalogs();
  const {
    getModels,
    modelsError,
    modelsLoading,
    catalogId,
    setCatalogId,
    handleOpenCatalog,
    handleSetSelectedBrand,
    handleSetIsVinSearch,
    catalogOpened,
  } = useModels();
  const { getOE, OELoading, setIsOESearch } = useOE();
  const {
    getGroupsByVin,
    groupsLoading,
    groupsError,
    vinInfo,
    clearPendingRegions,
    pendingRegions,
    pendingVin,
  } = useGroups();
  const { breadcrumbs, handleAddBreadcrumb } = useBreadcrumbs();
  const selectRef = useRef<HTMLSelectElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [clearLeft, setClearLeft] = useState(0);

  const INPUT_PADDING_LEFT = 16;
  const isFullView = window.__WIDGET_FULL_VIEW__ === true;

  useEffect(() => {
    if (measureRef.current) {
      const textWidth = measureRef.current.offsetWidth;
      setClearLeft(INPUT_PADDING_LEFT + textWidth + 8);
    }
  }, [vin]);

  useEffect(() => {
    getCatalogs();
  }, []);

  useEffect(() => {
    if (vinInfo?.vin) {
      const exists = breadcrumbs.some(
        (b) => b.type === "vin" && b.id === vinInfo.vin,
      );
      if (!exists) handleAddBreadcrumb("vin", vinInfo.vin, vinInfo.vin);
    }
  }, [vinInfo]);

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVin(e.target.value);
    if (catalogId) setCatalogId("");
  };

  const handleClearVin = () => {
    setVin("");
    if (catalogId) setCatalogId("");
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setCatalogId(selectedId);

    if (selectRef.current) {
      const selectedOption =
        selectRef.current.options[selectRef.current.selectedIndex];
      handleSetSelectedBrand(selectedOption.textContent || "");
    }

    if (vin) setVin("");
  };

  const handleSearchButtonClick = async () => {
    if (vin) {
      if (vin.replaceAll(" ", "").length === 17) {
        try {
          const res = await getGroupsByVin(vin.replaceAll(" ", ""));
          if (res.type === "car") {
            handleOpenCatalog();
            handleSetIsVinSearch(true);
            setVin("");
          }
        } catch (error) {}
      } else {
        try {
          const res = await getOE(vin);
          if (res.meta.requestStatus === "fulfilled") {
            handleOpenCatalog();
            setIsOESearch(true);
            handleAddBreadcrumb("oe", vin, vin);
            setVin("");
          }
        } catch (error) {}
      }
    } else if (catalogId) {
      const res = await getModels(catalogId);
      if (res.meta.requestStatus === "fulfilled") {
        handleOpenCatalog();
        handleSetIsVinSearch(false);
      }
    }
  };

  const isButtonDisabled =
    (vin === "" && catalogId === "") ||
    groupsLoading ||
    OELoading ||
    modelsLoading ||
    catalogsLoading ||
    catalogOpened;

  const isInputDisabled =
    groupsLoading ||
    OELoading ||
    modelsLoading ||
    catalogsLoading ||
    catalogOpened;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || isButtonDisabled) return;
      handleSearchButtonClick();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isButtonDisabled, vin, catalogId]);

  return (
    <div className={`${styles["widget"]}${isFullView ? ` ${styles["widget_full"]}` : ""}`}>
      <Notifications />
      <h1 className={styles["widget__title"]}>{t.widget_title}</h1>
      <div className={styles["widget__inputs"]}>
        <div className={styles["widget__input-container"]}>
          <p className={`${shared["title"]} ${styles["widget__input-title"]}`}>{t.widget_vin_input}</p>
          <div className={styles["widget__input-search-container"]}>
            <input
              type="text"
              id="widget-vin-input"
              className={`${styles["widget__input"]} ${shared["input"]}`}
              value={vin}
              onChange={handleVinChange}
              disabled={isInputDisabled}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !isButtonDisabled &&
                  !modelsLoading &&
                  !groupsLoading
                ) {
                  handleSearchButtonClick();
                }
              }}
            />

            <span
              ref={measureRef}
              className={styles["widget__input-measure"]}
              aria-hidden="true"
            >
              {vin}
            </span>

            {vin && !isButtonDisabled && (
              <button
                type="button"
                className={styles["widget__clear-button"]}
                style={{ left: `${clearLeft}px` }}
                onClick={handleClearVin}
                aria-label="Clear input"
              >
                <X className={`${shared["icon"]} ${styles["widget__clear-icon"]}`} />
              </button>
            )}

            <button
              className={styles["widget__search-button"]}
              onClick={handleSearchButtonClick}
              disabled={isButtonDisabled}
            >
              {modelsLoading || groupsLoading || OELoading ? (
                <DefaultLoader />
              ) : (
                <Search className={`${shared["icon"]} ${styles["widget__search-icon"]}`} />
              )}
            </button>
          </div>

          {!isFullView && (
            <div className={styles["widget__examples"]}>
              <p className={styles["widget__example-vin"]}>
                {t.widget_example_vin}:{" "}
                <span
                  className={`${styles["widget__example-vin"]} ${styles["widget__example-vin_blue"]}`}
                  onClick={() =>
                    handleVinChange({
                      target: { value: "XW8AN2NE3JH035743" },
                    } as any)
                  }
                >
                  XW8AN2NE3JH035743
                </span>
              </p>
              <p className={styles["widget__example-vin"]}>
                Example №:{" "}
                <span
                  className={`${styles["widget__example-vin"]} ${styles["widget__example-vin_blue"]}`}
                  onClick={() =>
                    handleVinChange({
                      target: { value: "5Q0407365A" },
                    } as any)
                  }
                >
                  5Q0407365A
                </span>
              </p>
            </div>
          )}
        </div>
        {isFullView && (
          <div className={styles["widget__input-container"]}>
            <p className={`${shared["title"]} ${styles["widget__input-title"]}`}>
              {t.widget_vehicle_select}
            </p>
            <select
              name="widget-car-select"
              ref={selectRef}
              id="widget-car-select"
              className={`${styles["widget__input"]} ${shared["input"]}`}
              disabled={catalogsLoading || catalogsError !== null}
              value={catalogId}
              onChange={handleSelectChange}
            >
              <option value="">
                {catalogsLoading
                  ? t.widget_loading
                  : t.widget_vehicle_select_placeholder}
              </option>
              {catalogs?.map((catalog) => (
                <option value={catalog.id} key={catalog.id}>
                  {catalog.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {isFullView && (
        <div className={styles["widget__examples"]}>
          <p className={styles["widget__example-vin"]}>
            {t.widget_example_vin}:{" "}
            <span
              className={`${styles["widget__example-vin"]} ${styles["widget__example-vin_blue"]}`}
              onClick={() =>
                handleVinChange({
                  target: { value: "XW8AN2NE3JH035743" },
                } as any)
              }
            >
              XW8AN2NE3JH035743
            </span>
          </p>
          <p className={styles["widget__example-vin"]}>
            Example №:{" "}
            <span
              className={`${styles["widget__example-vin"]} ${styles["widget__example-vin_blue"]}`}
              onClick={() =>
                handleVinChange({
                  target: { value: "5Q0407365A" },
                } as any)
              }
            >
              5Q0407365A
            </span>
          </p>
        </div>
      )}
      {!isFullView && (
        <ul className={styles["widget__cells"]}>
          {catalogs?.map((c) => {
            return (
              <li
                className={`${styles["widget__cell"]}${catalogId === c.id ? ` ${styles["widget__cell_active"]}` : ""}`}
                key={c.id}
                onClick={async () => {
                  setCatalogId(c.id);
                  handleSetSelectedBrand(c.name);
                  if (vin) setVin("");

                  const res = await getModels(c.id);
                  if (res.meta.requestStatus === "fulfilled") {
                    handleOpenCatalog();
                    handleSetIsVinSearch(false);
                  }
                }}
              >
                <img
                  src={resolveImageSrc(c.img)}
                  alt={`${c.id}-${c.name}`}
                  className={styles["widget__cell-img"]}
                  loading="lazy"
                />
                <p className={styles["widget__cell-title"]}>{c.name}</p>
              </li>
            );
          })}
        </ul>
      )}
      {isFullView && (
        <button
          className={`${styles["widget__button"]} ${shared["button"]}`}
          disabled={isButtonDisabled || modelsLoading || groupsLoading}
          onClick={handleSearchButtonClick}
        >
          {modelsLoading || groupsLoading
            ? t.widget_loading
            : t.widget_search_button}
        </button>
      )}
      {(modelsError || groupsError) && (
        <span className={`${styles["widget__error"]} ${shared["error"]}`}>
          {modelsError || groupsError}
        </span>
      )}
      <RegionSelectPopup
        isActive={pendingRegions.length > 0}
        regions={pendingRegions}
        vin={pendingVin}
        onClose={clearPendingRegions}
        onConfirm={async (regionId) => {
          try {
            clearPendingRegions();
            const res = await getGroupsByVin(pendingVin, regionId);
            if (res.type === "car") {
              handleOpenCatalog();
              handleSetIsVinSearch(true);
            }
          } catch (error) {}
        }}
      />
    </div>
  );
};

export default Widget;
