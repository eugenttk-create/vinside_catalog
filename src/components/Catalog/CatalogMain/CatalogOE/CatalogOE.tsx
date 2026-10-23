import shared from "../../../../styles/common.module.css";
import CatalogOEFilters from "./CatalogOEFilters/CatalogOEFilters";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useGroups } from "../../../../hooks/groups/useGroups";
import { useOE } from "../../../../hooks/OE/useOE";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import { useState, useMemo, useEffect } from "react";
import PageLoader from "../../../Loaders/PageLoader/PageLoader";

const CatalogOE: React.FC = () => {
  const { OE, getOEGroups, OELoading, setIsOESearch } = useOE();
  const { handleSetCarId } = useParameters();
  const { setIsSidebarVisible } = useGroups();
  const { handleAddBreadcrumb } = useBreadcrumbs();
  const [selectedBrand, setSelectedBrand] = useState("");

  const filteredModels = useMemo(() => {
    if (!OE?.models) return [];
    if (!selectedBrand) return OE.models;
    return OE.models.filter((m) => m.brand === selectedBrand);
  }, [OE, selectedBrand]);

  const handleRowClick = (carId: string, name: string) => {
    getOEGroups(carId);
    handleSetCarId(carId);
    handleAddBreadcrumb("oe-group", name, carId);
  };

  useEffect(() => {
    setIsOESearch(true);
  }, []);

  useEffect(() => {
    setIsSidebarVisible(false);
    return () => {
      setIsSidebarVisible(true);
    };
  }, []);

  return (
    <div>
      {OELoading ? (
        <PageLoader />
      ) : (
        <div className={shared["table-container"]}>
          <CatalogOEFilters
            selectedBrand={selectedBrand}
            onBrandSelect={setSelectedBrand}
          />
          <div className={shared["table-wrapper"]}>
            <table className={shared["table"]}>
              <thead className={shared["table-header"]}>
                <tr className={shared["table-row"]}>
                  <th className={shared["table-header-el"]}>Brand</th>
                  <th className={shared["table-header-el"]}>Model</th>
                  <th className={shared["table-header-el"]}>Year</th>
                </tr>
              </thead>
              <tbody className={shared["table-body"]}>
                {filteredModels.map((m) => (
                  <tr
                    className={`${shared["table-row"]} ${shared["table-row_oe"]}`}
                    key={`${m.carId}-${m.model}`}
                    onClick={() =>
                      handleRowClick(m.carId, `${m.brand} ${m.model}`)
                    }
                  >
                    <td className={shared["table-data"]}>
                      <span className={shared["table-data-text"]}>{m.brand}</span>
                    </td>
                    <td className={shared["table-data"]}>
                      <span className={shared["table-data-text"]}>{m.model}</span>
                    </td>
                    <td className={shared["table-data"]}>
                      <span className={shared["table-data-text"]}>{m.year}</span>
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
