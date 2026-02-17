import "./Widget.css";
import { useState, useEffect } from "react";
import { useCatalogs } from "../../hooks/catalogs/useCatalogs";
import { useModels } from "../../hooks/models/useModels";
import { useGroups } from "../../hooks/groups/useGroups";
import { useBreadcrumbs } from "../../hooks/breadcrumbs/useBreadcrumbs";
import { useRef } from "react";

const Widget: React.FC = () => {
  const [vin, setVin] = useState("");
  const { catalogs, catalogsError, getCatalogs, catalogsLoading } =
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
  } = useModels();
  const { getGroupsByVin, groupsLoading, groupsError, vinInfo } = useGroups();
  const { breadcrumbs, handleAddBreadcrumb } = useBreadcrumbs();
  const selectRef = useRef<HTMLSelectElement>(null);

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
      try {
        await getGroupsByVin(vin);
        handleOpenCatalog();
        handleSetIsVinSearch(true);
        setVin("");
      } catch (error) {}
    } else if (catalogId) {
      getModels(catalogId);
      handleOpenCatalog();
      handleSetIsVinSearch(false);
    }
  };

  const isButtonDisabled = vin === "" && catalogId === "";

  return (
    <div className="widget">
      <h1 className="widget__title">Search for a vehicle model</h1>
      <div className="widget__inputs">
        <div className="widget__input-container">
          <p className="title widget__input-title">Please enter your VIN</p>
          <input
            type="text"
            id="widget-vin-input"
            className="widget__input input"
            value={vin}
            onChange={handleVinChange}
          />
        </div>
        <div className="widget__input-container">
          <p className="title widget__input-title">Please select a vehicle</p>
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
                ? "Loading..."
                : catalogsError
                ? `${catalogsError}`
                : "Select a vehicle..."}
            </option>
            {catalogs?.map((catalog) => (
              <option value={catalog.id} key={catalog.id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="widget__example-vin">
        Example VIN:{" "}
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
      <button
        className="widget__button button"
        disabled={isButtonDisabled || modelsLoading || groupsLoading}
        onClick={handleSearchButtonClick}
      >
        {modelsLoading || groupsLoading ? "Loading..." : "Search"}
      </button>
      {(modelsError || groupsError) && (
        <span className="widget__error error">
          {modelsError || groupsError}
        </span>
      )}
    </div>
  );
};

export default Widget;
