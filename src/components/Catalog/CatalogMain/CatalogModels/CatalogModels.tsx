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
  catalog?: string | null;
  cabin?: string | null;
  engine?: string | null;
  gearbox?: string | null;
  steering?: string | null;
  suspension?: string | null;
  wheel_base?: string | null;
  production?: string | null;
  pet?: string | null;
  pat?: string | null;
  prefix?: string | null;
  type?: string | null;
  pic?: string | null;
} | null;

const CatalogModels: React.FC<CatalogModelsProps> = ({
  setModelId,
  switchState,
}) => {
  const { models } = useModels();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<InfoPopupDescription>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

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
                setCurrentTitle={setCurrentTitle}
                activeCardId={activeCardId}
                setActiveCardId={setActiveCardId}
              />
            );
          })}
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
    <CatalogModelsTable setModelId={setModelId} />
  );
};

export default CatalogModels;
