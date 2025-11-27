import "./Widget.css";
import { useState, useEffect } from "react";
import { useCatalogs } from "../../hooks/catalogs/useCatalogs";
import { useModels } from "../../hooks/models/useModels";

interface WidgetProps {
  catalogId: string;
  setCatalogId: React.Dispatch<React.SetStateAction<string>>;
}

const Widget: React.FC<WidgetProps> = ({ catalogId, setCatalogId }) => {
  const [vin, setVin] = useState("");
  const { catalogs, catalogsError, getCatalogs, catalogsLoading } =
    useCatalogs();
  const { getModels, modelsError, modelsLoading } = useModels();

  const handleSelectChange = (e: any) => {
    setCatalogId(e.target.value);
    setVin("");
  };

  const handleSearchButtonClick = () => {
    getModels(catalogId);
  };

  useEffect(() => {
    getCatalogs();
  }, []);

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
            onChange={(e) => setVin(e.target.value)}
          />
          <p className="widget__example-vin">
            Example VIN:{" "}
            <span
              className="widget__example-vin widget__example-vin_blue"
              onClick={() => setVin("XW8AN2NE3JH035743")}
            >
              XW8AN2NE3JH035743
            </span>
          </p>
        </div>
        <div className="widget__input-container">
          <p className="title widget__input-title">Please select a vehicle</p>
          <select
            name="widget-car-select"
            id="widget-car-select"
            className="widget__input input"
            disabled={catalogsLoading || catalogsError !== null}
            onChange={(e) => handleSelectChange(e)}
          >
            {catalogId === "" && (
              <option value="initial">
                {catalogsLoading
                  ? "Loading..."
                  : catalogsError !== null
                  ? `${catalogsError}`
                  : "Select a vehicle..."}
              </option>
            )}
            {catalogs &&
              catalogs.map((catalog) => {
                return (
                  <option value={catalog.id} key={catalog.id}>
                    {catalog.name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <button
        className="widget__button button"
        disabled={(vin === "" && catalogId === "") || modelsLoading}
        onClick={handleSearchButtonClick}
      >
        {modelsLoading ? "Loading..." : "Search"}
      </button>
      {modelsError && (
        <span className="widget__error error">{modelsError}</span>
      )}
    </div>
  );
};

export default Widget;
