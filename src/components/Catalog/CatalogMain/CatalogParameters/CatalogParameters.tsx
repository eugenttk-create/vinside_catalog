import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useModels } from "../../../../hooks/models/useModels";
import CatalogParameterCard from "./CatalogParameterCard/CatalogParameterCard";

interface CatalogParametersProps {
  modelId: string;
}

const CatalogParameters: React.FC<CatalogParametersProps> = ({ modelId }) => {
  const { parameters, getParameters } = useParameters();
  const { catalogId } = useModels();

  const lastParameter = parameters[parameters.length - 1];

  return (
    <ul className="cards-section">
      {lastParameter.values.map((val) => (
        <CatalogParameterCard
          key={val.idx}
          idx={val.idx}
          name={val.value}
          imageSrc={""}
          onClick={(idx) => getParameters(catalogId, modelId, idx)}
        />
      ))}
    </ul>
  );
};

export default CatalogParameters;
