import "./CatalogModels.css";
import CatalogModelCard from "./CatalogModelCard/CatalogModelCard";
import { useModels } from "../../../../hooks/models/useModels";
import { useState } from "react";
import InfoPopup from "../../../InfoPopup/InfoPopup";

interface CatalogModelsProps {
  setModelId: React.Dispatch<React.SetStateAction<string>>;
  switchState: string;
}

export type InfoPopupDescription = {
  modelType: string | null;
  productionFrom: string | null;
  productionTo: string | null;
  series: string | null;
} | null;

const CatalogModels: React.FC<CatalogModelsProps> = ({
  setModelId,
  switchState,
}) => {
  const { models } = useModels();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<InfoPopupDescription>(null);

  return (
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
              />
            );
          })}
      </ul>
      <InfoPopup
        isActive={isInfoActive}
        description={currentDescription}
        onClose={() => setIsInfoActive(false)}
      />
    </>
  );
};

export default CatalogModels;
