import { useState } from "react";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useModels } from "../../../../hooks/models/useModels";
import CatalogParameterCard from "./CatalogParameterCard/CatalogParameterCard";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import InfoPopup from "../../../InfoPopup/InfoPopup";
import type { InfoPopupDescription } from "../CatalogModels/CatalogModels";
import CatalogParametersTable from "./CatalogParametersTable/CatalogParametersTable";

interface CatalogParametersProps {
  modelId: string;
  switchState: string;
}

const CatalogParameters: React.FC<CatalogParametersProps> = ({
  modelId,
  switchState,
}) => {
  const { handleAddBreadcrumb } = useBreadcrumbs();
  const { parameters, getParameters } = useParameters();
  const { catalogId } = useModels();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<InfoPopupDescription>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const lastParameter = parameters[parameters.length - 1];

  return switchState === "cards" ? (
    <>
      <ul
        className={`cards-section ${
          switchState === "cards" ? "cards-section_grid" : "cards-section_list"
        }`}
      >
        {lastParameter.values.map((val) => (
          <CatalogParameterCard
            key={val.idx}
            idx={val.idx}
            name={val.value}
            imageSrc={""}
            onClick={(idx) => {
              getParameters(catalogId, modelId, idx);
              handleAddBreadcrumb("parameter", val.value, val.idx);
            }}
            description={val.description}
            switchState={switchState}
            setIsInfoActive={setIsInfoActive}
            setCurrentDescription={setCurrentDescription}
            setPopupPosition={setPopupPosition}
            setCurrentTitle={setCurrentTitle}
            activeCardId={activeCardId}
            setActiveCardId={setActiveCardId}
          />
        ))}
      </ul>
      <InfoPopup
        isActive={isInfoActive}
        description={currentDescription}
        onClose={() => {
          setIsInfoActive(false);
          setActiveCardId(null);
        }}
        position={popupPosition}
        title={currentTitle}
      />
    </>
  ) : (
    <CatalogParametersTable
      values={lastParameter.values}
      modelId={modelId}
      onClick={(idx, name) => {
        getParameters(catalogId, modelId, idx);
        handleAddBreadcrumb("parameter", name, idx);
      }}
    />
  );
};

export default CatalogParameters;
