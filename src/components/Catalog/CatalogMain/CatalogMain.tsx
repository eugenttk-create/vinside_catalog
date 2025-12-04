import "./CatalogMain.css";
import CatalogModels from "./CatalogModels/CatalogModels";
import CatalogParameters from "./CatalogParameters/CatalogParameters";
import CatalogGroups from "./CatalogGroups/CatalogGroups";
import CatalogParts from "./CatalogParts/CatalogParts";
import CatalogBrands from "./CatalogBrands/CatalogBrands";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useParts } from "../../../hooks/parts/useParts";
import { useModels } from "../../../hooks/models/useModels";
import PageLoader from "../../Loaders/PageLoader/PageLoader";

interface CatalogMainProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogMain: React.FC<CatalogMainProps> = ({ modelId, setModelId }) => {
  const { parametersLoading, parameters, carId } = useParameters();
  const { groupsFlat, groupsLoading } = useGroups();
  const { parts, partsLoading } = useParts();
  const { models, modelsLoading } = useModels();

  return (
    <div
      className={`catalog-main ${
        parts?.partGroups &&
        parts.partGroups.length > 0 &&
        parts.partGroups[0].parts?.length > 0
          ? "catalog-main_parts"
          : ""
      }`}
    >
      {(parametersLoading ||
        groupsLoading ||
        partsLoading ||
        modelsLoading) && <PageLoader />}

      {parts?.partGroups &&
      parts.partGroups.length > 0 &&
      parts.partGroups[0].parts?.length > 0 ? (
        <CatalogParts modelId={modelId} setModelId={setModelId} />
      ) : groupsFlat.length > 0 && carId ? (
        <CatalogGroups carId={carId} />
      ) : parameters.length > 0 ? (
        <CatalogParameters modelId={modelId} />
      ) : models.length > 0 ? (
        <CatalogModels setModelId={setModelId} />
      ) : (
        !modelsLoading && !groupsLoading && <CatalogBrands />
      )}
    </div>
  );
};

export default CatalogMain;
