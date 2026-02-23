import "./CatalogModels.css";
import CatalogModelCard from "./CatalogModelCard/CatalogModelCard";
import { useModels } from "../../../../hooks/models/useModels";
import { useState } from "react";
import InfoPopup from "../../../InfoPopup/InfoPopup";
import CatalogModelsTable from "./CatalogModelsTable/CatalogModelsTable";

interface CatalogModelsProps {
  setModelId: React.Dispatch<React.SetStateAction<string>>;
  switchState: string;
}

export type InfoPopupDescription = {
  model_type?: string | null;
  year_from?: string | null;
  year_to?: string | null;
  series?: string | null;
  code?: string | null;
  sales_term?: string | null;
  sales_type?: string | null;
} | null;

const CatalogModels: React.FC<CatalogModelsProps> = ({
  setModelId,
  switchState,
}) => {
  const { models } = useModels();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<InfoPopupDescription>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  return switchState === "cards" ? (
    <>
      <ul
        className={`models cards-section ${
          switchState === "cards" ? "cards-section_grid" : "cards-section_list"
        }`}
      >
        {models &&
          models.map((model) => {
            return (
              <CatalogModelCard
                modelId={model.id}
                imageSrc={model.img}
                key={model.id}
                name={model.name}
                setModelId={setModelId}
                description={model.description}
                setIsInfoActive={setIsInfoActive}
                setCurrentDescription={setCurrentDescription}
                switchState={switchState}
                setPopupPosition={setPopupPosition}
              />
            );
          })}
      </ul>
      <InfoPopup
        isActive={isInfoActive}
        description={currentDescription}
        onClose={() => setIsInfoActive(false)}
        position={popupPosition}
      />
    </>
  ) : (
    <CatalogModelsTable setModelId={setModelId} />
  );
};

export default CatalogModels;
