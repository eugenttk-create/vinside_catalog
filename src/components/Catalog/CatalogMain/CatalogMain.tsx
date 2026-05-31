import "./CatalogMain.css";
import { ChevronRight, Grid2X2, Menu } from "lucide-react";
import CatalogModels from "./CatalogModels/CatalogModels";
import CatalogParameters from "./CatalogParameters/CatalogParameters";
import CatalogGroups from "./CatalogGroups/CatalogGroups";
import CatalogParts from "./CatalogParts/CatalogParts";
import CatalogBrands from "./CatalogBrands/CatalogBrands";
import { useEffect, useState } from "react";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useParts } from "../../../hooks/parts/useParts";
import { useModels } from "../../../hooks/models/useModels";
import PageLoader from "../../Loaders/PageLoader/PageLoader";

interface CatalogMainProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
  isSidebarActive: boolean;
  setIsSidebarAvtive: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatalogMain: React.FC<CatalogMainProps> = ({
  modelId,
  setModelId,
  setIsSidebarAvtive,
  isSidebarActive,
}) => {
  const { parametersLoading, parameters, carId } = useParameters();
  const { groupsFlat, groupsLoading, isAiSearch } = useGroups();
  const { parts, partsLoading } = useParts();
  const { models, modelsLoading, isVinSearch } = useModels();
  const [switchState, setSwitchState] = useState("cards");

  const toggleSwitch = () => {
    if (switchState === "list") {
      setSwitchState("cards");
    } else {
      setSwitchState("list");
    }
  };

  useEffect(() => {
    if (isAiSearch) {
      setSwitchState("list");
    } else {
      setSwitchState("cards");
    }
  }, [isAiSearch]);

  return (
    <div
      className={`catalog-main ${
        parts?.partGroups &&
        parts.partGroups.length > 0 &&
        parts.partGroups[0].parts?.length > 0
          ? "catalog-main_parts"
          : ""
      }`}
    >
      {!isSidebarActive && (
        <button
          className="catalog__sidebar-toggle"
          onClick={() => setIsSidebarAvtive(true)}
        >
          <ChevronRight className="icon" />
        </button>
      )}
      {((parts?.partGroups.length === 0 && models.length !== 0) ||
        (isVinSearch === true && parts?.partGroups.length === 0)) && (
        <div className="cards-section__switch-container">
          <div className="cards-section__switch">
            <button
              className={`cards-section__switch-button ${
                switchState === "cards"
                  ? "cards-section__switch-button_active"
                  : ""
              }`}
              onClick={toggleSwitch}
            >
              <Grid2X2 className="icon" />
            </button>
            <button
              className={`cards-section__switch-button ${
                switchState === "list"
                  ? "cards-section__switch-button_active"
                  : ""
              }`}
              onClick={toggleSwitch}
            >
              <Menu className="icon" />
            </button>
          </div>
        </div>
      )}
      {(parametersLoading ||
        groupsLoading ||
        partsLoading ||
        modelsLoading) && <PageLoader />}

      {parts?.partGroups &&
      parts.partGroups.length > 0 &&
      parts.partGroups[0].parts?.length > 0 ? (
        <CatalogParts modelId={modelId} setModelId={setModelId} />
      ) : groupsFlat.length > 0 && carId ? (
        <CatalogGroups carId={carId} switchState={switchState} />
      ) : parameters.length > 0 ? (
        <CatalogParameters modelId={modelId} switchState={switchState} />
      ) : models.length > 0 ? (
        <CatalogModels setModelId={setModelId} switchState={switchState} />
      ) : (
        !modelsLoading && !groupsLoading && <CatalogBrands />
      )}
    </div>
  );
};

export default CatalogMain;
