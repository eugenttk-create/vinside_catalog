import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useModels } from "../../../../hooks/models/useModels";
import CatalogParameterCard from "./CatalogParameterCard/CatalogParameterCard";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";

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

  const lastParameter = parameters[parameters.length - 1];

  return (
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
        />
      ))}
    </ul>
  );
};

export default CatalogParameters;
