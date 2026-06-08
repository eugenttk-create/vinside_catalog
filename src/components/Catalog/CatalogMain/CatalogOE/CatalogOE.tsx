import "./CatalogOE.css";
import CatalogOEFilters from "./CatalogOEFilters/CatalogOEFilters";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useOE } from "../../../../hooks/OE/useOE";
import { useState, useMemo } from "react";
import PageLoader from "../../../Loaders/PageLoader/PageLoader";

const CatalogOE: React.FC = () => {
  const { OE, getOEGroups, OELoading } = useOE();
  const { handleSetCarId } = useParameters();
  const [selectedBrand, setSelectedBrand] = useState("");

  const filteredModels = useMemo(() => {
    if (!OE?.models) return [];
    if (!selectedBrand) return OE.models;
    return OE.models.filter((m) => m.brand === selectedBrand);
  }, [OE, selectedBrand]);

  const handleRowClick = (carId: string) => {
    getOEGroups(carId), handleSetCarId(carId);
  };

  return (
    <div>
      {OELoading ? (
        <PageLoader />
      ) : (
        <div className="table-container">
          <CatalogOEFilters
            selectedBrand={selectedBrand}
            onBrandSelect={setSelectedBrand}
          />
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-header-el">Brand</th>
                  <th className="table-header-el">Model</th>
                  <th className="table-header-el">Year</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredModels.map((m) => (
                  <tr
                    className="table-row"
                    key={`${m.carId}-${m.model}`}
                    onClick={() => handleRowClick(m.carId)}
                  >
                    <td className="table-data">
                      <span className="table-data-text">{m.brand}</span>
                    </td>
                    <td className="table-data">
                      <span className="table-data-text">{m.model}</span>
                    </td>
                    <td className="table-data">
                      <span className="table-data-text">{m.year}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogOE;
