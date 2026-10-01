import "./CatalogMain.css";
import { ChevronRight, Grid2X2, Menu } from "lucide-react";
import CatalogModels from "./CatalogModels/CatalogModels";
import CatalogParameters from "./CatalogParameters/CatalogParameters";
import CatalogGroups from "./CatalogGroups/CatalogGroups";
import CatalogParts from "./CatalogParts/CatalogParts";
import CatalogBrands from "./CatalogBrands/CatalogBrands";
import CatalogOE from "./CatalogOE/CatalogOE";
import CatalogAnalogs from "./CatalogAnalogs/CatalogAnalogs";
import CatalogAnalogDetail from "./CatalogAnalogDetail/CatalogAnalogDetail";
import { useEffect, useState } from "react";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useParts } from "../../../hooks/parts/useParts";
import { useModels } from "../../../hooks/models/useModels";
import { useOE } from "../../../hooks/OE/useOE";
import { useAnalogs } from "../../../hooks/analogs/useAnalogs";
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
  const { OE, OELoading } = useOE();
  const {
    isAnalogsView,
    isAnalogDetailView,
    analogsLoading,
    analogInfoLoading,
  } = useAnalogs();
  const [switchState, setSwitchState] = useState("cards");

  const toggleSwitch = () => {
    if (switchState === "list") {
      setSwitchState("cards");
    } else {
      setSwitchState("list");
    }
  };

  const hasExtraDescriptionData = (
    description: Record<string, unknown> | null | undefined
  ): boolean => {
    if (!description) return false;
    return Object.values(description).some(
      (value) => value != null && String(value).trim() !== ""
    );
  };

  const modelsHaveExtraData = models.some((m) =>
    hasExtraDescriptionData(m.description as Record<string, unknown> | null)
  );

  const parametersHaveExtraData = parameters.some((param) =>
    param.values.some((val) =>
      hasExtraDescriptionData(val.description as Record<string, unknown> | null)
    )
  );

  const groupsHaveExtraData = groupsFlat.some((g) =>
    hasExtraDescriptionData(g.description as Record<string, unknown> | null)
  );

  useEffect(() => {
    if (isAiSearch) {
      setSwitchState("list");
      return;
    }

    // Decide default view based on currently visible data set
    if (groupsFlat.length > 0 && carId) {
      setSwitchState(groupsHaveExtraData ? "list" : "cards");
    } else if (parameters.length > 0) {
      setSwitchState(parametersHaveExtraData ? "list" : "cards");
    } else if (models.length > 0) {
      setSwitchState(modelsHaveExtraData ? "list" : "cards");
    } else {
      setSwitchState("cards");
    }
  }, [
    isAiSearch,
    groupsFlat.length,
    carId,
    parameters.length,
    models.length,
    groupsHaveExtraData,
    parametersHaveExtraData,
    modelsHaveExtraData,
  ]);

  const hasPartsResponse = parts?.partGroups && parts.partGroups.length > 0;

  const showViewSwitch =
    !hasPartsResponse &&
    !isAnalogsView &&
    (models.length > 0 ||
      parameters.length > 0 ||
      (groupsFlat.length > 0 && !!carId) ||
      isVinSearch);

  return (
    <div
      className={`catalog-main ${
        hasPartsResponse && !isAnalogsView ? "catalog-main_parts" : ""
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
      {showViewSwitch && (
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
        modelsLoading ||
        OELoading ||
        analogsLoading ||
        analogInfoLoading) && <PageLoader />}

      {isAnalogDetailView ? (
        <CatalogAnalogDetail />
      ) : isAnalogsView ? (
        <CatalogAnalogs />
      ) : hasPartsResponse ? (
        <CatalogParts modelId={modelId} setModelId={setModelId} />
      ) : groupsFlat.length > 0 && carId ? (
        <CatalogGroups carId={carId} switchState={switchState} />
      ) : OE ? (
        <CatalogOE />
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
