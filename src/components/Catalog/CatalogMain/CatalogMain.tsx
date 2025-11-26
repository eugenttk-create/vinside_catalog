import "./CatalogMain.css";
import CatalogModels from "./CatalogModels/CatalogModels";
import CatalogParameters from "./CatalogParameters/CatalogParameters";
import CatalogGroups from "./CatalogGroups/CatalogGroups";
import CatalogParts from "./CatalogParts/CatalogParts";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useParts } from "../../../hooks/parts/useParts";
import PageLoader from "../../Loaders/PageLoader/PageLoader";

interface CatalogMainProps {
  catalogId: string;
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogMain: React.FC<CatalogMainProps> = ({
  catalogId,
  modelId,
  setModelId,
}) => {
  const { parametersLoading, parameters, carId } = useParameters();
  const { groups, groupsLoading } = useGroups();
  const { parts, partsLoading } = useParts();

  return (
    <div className="catalog-main">
      {(parametersLoading || groupsLoading || partsLoading) && <PageLoader />}

      {parts?.partGroups &&
      parts.partGroups.length > 0 &&
      parts.partGroups[0].parts?.length > 0 ? (
        <CatalogParts />
      ) : groups.length > 0 && carId ? (
        <CatalogGroups catalogId={catalogId} carId={carId} />
      ) : parameters.length > 0 ? (
        <CatalogParameters modelId={modelId} catalogId={catalogId} />
      ) : (
        <CatalogModels catalogId={catalogId} setModelId={setModelId} />
      )}
    </div>
  );
};

export default CatalogMain;
