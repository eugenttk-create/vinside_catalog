import shared from "../../../../styles/common.module.css";
import styles from "./CatalogParameters.module.css";
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
  const { parameters, getParameters, isAllParamsMode, selectedParameters } =
    useParameters();
  const { catalogId } = useModels();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<InfoPopupDescription>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const answeredKeys = new Set(
    parameters
      .filter((param) =>
        param.values.some((value) => selectedParameters.includes(value.idx)),
      )
      .map((param) => param.key),
  );

  const handleSelect = (idx: string, name: string) => {
    getParameters(catalogId, modelId, idx);
    handleAddBreadcrumb("parameter", name, idx);
  };

  if (isAllParamsMode) {
    const visibleParameters = parameters.filter(
      (param) => !answeredKeys.has(param.key),
    );

    return (
      <>
        {visibleParameters.map((param) => (
          <div className={shared["parameters-group"]} key={param.key}>
            <h3 className={`${styles["parameters-group__title"]} ${shared["title"]}`}>{param.name}</h3>
            {switchState === "cards" ? (
              <ul className={`${shared["cards-section"]} ${shared["cards-section_grid"]}`}>
                {param.values.map((val) => (
                  <CatalogParameterCard
                    key={val.idx}
                    idx={val.idx}
                    name={val.value}
                    imageSrc={val.img}
                    onClick={(idx) => handleSelect(idx, val.value)}
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
            ) : (
              <CatalogParametersTable
                values={param.values}
                modelId={modelId}
                onClick={(idx, name) => handleSelect(idx, name)}
              />
            )}
          </div>
        ))}
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
    );
  }

  const lastParameter = parameters[parameters.length - 1];

  return switchState === "cards" ? (
    <>
      <ul
        className={`${shared["cards-section"]} ${switchState === "cards" ? shared["cards-section_grid"] : shared["cards-section_list"]}`}
      >
        {lastParameter.values.map((val) => (
          <CatalogParameterCard
            key={val.idx}
            idx={val.idx}
            name={val.value}
            imageSrc={val.img}
            onClick={(idx) => handleSelect(idx, val.value)}
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
      onClick={(idx, name) => handleSelect(idx, name)}
    />
  );
};

export default CatalogParameters;
