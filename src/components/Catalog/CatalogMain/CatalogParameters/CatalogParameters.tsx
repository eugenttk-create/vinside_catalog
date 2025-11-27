import { useParameters } from "../../../../hooks/parameters/useParameters";
import CatalogParameterCard from "./CatalogParameterCard/CatalogParameterCard";

interface CatalogParametersProps {
  modelId: string;
  catalogId: string;
}

const CatalogParameters: React.FC<CatalogParametersProps> = ({
  modelId,
  catalogId,
}) => {
  const { parameters, getParameters } = useParameters();

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
