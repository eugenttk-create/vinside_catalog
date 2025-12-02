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
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogMain: React.FC<CatalogMainProps> = ({ modelId, setModelId }) => {
  const { parametersLoading, parameters, carId } = useParameters();
  const { groupsFlat, groupsLoading } = useGroups();
  const { parts, partsLoading } = useParts();

  return (
    <div className="catalog-main">
      {(parametersLoading || groupsLoading || partsLoading) && <PageLoader />}

      {parts?.partGroups &&
      parts.partGroups.length > 0 &&
      parts.partGroups[0].parts?.length > 0 ? (
        <CatalogParts />
      ) : groupsFlat.length > 0 && carId ? (
        <CatalogGroups carId={carId} />
      ) : parameters.length > 0 ? (
        <CatalogParameters modelId={modelId} />
      ) : (
        <CatalogModels setModelId={setModelId} />
      )}
    </div>
  );
};

export default CatalogMain;
