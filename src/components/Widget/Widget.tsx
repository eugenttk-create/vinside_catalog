import "./Widget.css";
import { useState, useEffect, useRef } from "react";
import { useCatalogs } from "../../hooks/catalogs/useCatalogs";
import { useModels } from "../../hooks/models/useModels";
import { useGroups } from "../../hooks/groups/useGroups";
import { useOE } from "../../hooks/OE/useOE";
import { useBreadcrumbs } from "../../hooks/breadcrumbs/useBreadcrumbs";
import { useTranslation } from "../../hooks/translation/useTranslation";
import { resolveImageSrc } from "../../utils/resolveImgSrc";
import { Search, X } from "lucide-react";
import DefaultLoader from "../Loaders/DefaultLoader/DefaultLoader";

const Widget: React.FC = () => {
  const { t } = useTranslation();
  const [vin, setVin] = useState("");
  const { catalogs, getCatalogs, catalogsLoading } = useCatalogs();
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
  const { getGroupsByVin, groupsLoading, groupsError, vinInfo } = useGroups();
  const { breadcrumbs, handleAddBreadcrumb } = useBreadcrumbs();
  // const selectRef = useRef<HTMLSelectElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [clearLeft, setClearLeft] = useState(0);

  const INPUT_PADDING_LEFT = 16;

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
        (b) => b.type === "vin" && b.id === vinInfo.vin
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

  // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedId = e.target.value;
  //   setCatalogId(selectedId);

  //   if (selectRef.current) {
  //     const selectedOption =
  //       selectRef.current.options[selectRef.current.selectedIndex];
  //     handleSetSelectedBrand(selectedOption.textContent || "");
  //   }

  //   if (vin) setVin("");
  // };

  const handleSearchButtonClick = async () => {
    if (vin) {
      if (vin.length === 17) {
        try {
          await getGroupsByVin(vin);
          handleOpenCatalog();
          handleSetIsVinSearch(true);
          setVin("");
        } catch (error) {}
      } else {
        try {
          await getOE(vin);
          handleOpenCatalog();
          setIsOESearch(true);
          handleAddBreadcrumb("oe", vin, vin);
          setVin("");
        } catch (error) {}
      }
    } else if (catalogId) {
      getModels(catalogId);
      handleOpenCatalog();
      handleSetIsVinSearch(false);
    }
  };

  const isButtonDisabled =
    (vin === "" && catalogId === "") ||
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
    <div className="widget">
      <h1 className="widget__title">{t.widget_title}</h1>
      <div className="widget__inputs">
        <div className="widget__input-container">
          <p className="title widget__input-title">{t.widget_vin_input}</p>
          <div className="widget__input-search-container">
            <input
              type="text"
              id="widget-vin-input"
              className="widget__input input"
              value={vin}
              onChange={handleVinChange}
              disabled={isButtonDisabled}
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
              className="widget__input-measure"
              aria-hidden="true"
            >
              {vin}
            </span>

            {vin && !isButtonDisabled && (
              <button
                type="button"
                className="widget__clear-button"
                style={{ left: `${clearLeft}px` }}
                onClick={handleClearVin}
                aria-label="Clear input"
              >
                <X className="icon widget__clear-icon" />
              </button>
            )}

            <button
              className="widget__search-button"
              onClick={handleSearchButtonClick}
              disabled={isButtonDisabled}
            >
              {modelsLoading || groupsLoading || OELoading ? (
                <DefaultLoader />
              ) : (
                <Search className="icon widget__search-icon" />
              )}
            </button>
          </div>
        </div>
        {/* <div className="widget__input-container">
          <p className="title widget__input-title">{t.widget_vehicle_select}</p>
          <select
            name="widget-car-select"
            ref={selectRef}
            id="widget-car-select"
            className="widget__input input"
            disabled={catalogsLoading || catalogsError !== null}
            value={catalogId}
            onChange={handleSelectChange}
          >
            <option value="">
              {catalogsLoading
                ? t.widget_loading
                : catalogsError
                ? `${catalogsError}`
                : t.widget_vehicle_select_placeholder}
            </option>
            {catalogs?.map((catalog) => (
              <option value={catalog.id} key={catalog.id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div> */}
      </div>
      <div className="widget__examples">
        <p className="widget__example-vin">
          {t.widget_example_vin}:{" "}
          <span
            className="widget__example-vin widget__example-vin_blue"
            onClick={() =>
              handleVinChange({
                target: { value: "XW8AN2NE3JH035743" },
              } as any)
            }
          >
            XW8AN2NE3JH035743
          </span>
        </p>
        <p className="widget__example-vin">
          Example №:{" "}
          <span
            className="widget__example-vin widget__example-vin_blue"
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
      <ul className="widget__cells">
        {catalogs?.map((c) => {
          return (
            <li
              className={`widget__cell${
                catalogId === c.id ? " widget__cell_active" : ""
              }`}
              key={c.id}
              onClick={() => {
                setCatalogId(c.id);
                handleSetSelectedBrand(c.name);
                if (vin) setVin("");
              }}
            >
              <img
                src={resolveImageSrc(c.img)}
                alt={`${c.id}-${c.name}`}
                className="widget__cell-img"
                loading="lazy"
              />
              <p className="widget__cell-title">{c.name}</p>
            </li>
          );
        })}
      </ul>
      {/* <button
        className="widget__button button"
        disabled={isButtonDisabled || modelsLoading || groupsLoading}
        onClick={handleSearchButtonClick}
      >
        {modelsLoading || groupsLoading
          ? t.widget_loading
          : t.widget_search_button}
      </button> */}
      {(modelsError || groupsError) && (
        <span className="widget__error error">
          {modelsError || groupsError}
        </span>
      )}
    </div>
  );
};

export default Widget;
