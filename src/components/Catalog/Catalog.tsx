import CatalogMain from "./CatalogMain/CatalogMain";
import CatalogHeader from "./CatalogHeader/CatalogHeader";
import CatalogSidebar from "./CatalogSidebar/CatalogSidebar";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import { useParts } from "../../hooks/parts/useParts";
import "./Catalog.css";

interface CatalogProps {
  catalogId: string;
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Catalog: React.FC<CatalogProps> = ({
  catalogId,
  modelId,
  setModelId,
}) => {
  const { parts } = useParts();
  return (
    <section className="catalog">
      <CatalogHeader />
      {!(
        parts?.partGroups &&
        parts.partGroups.length > 0 &&
        parts.partGroups[0].parts?.length > 0
      ) && <Breadcrumbs />}
      <div
        className={`${
          !(
            parts?.partGroups &&
            parts.partGroups.length > 0 &&
            parts.partGroups[0].parts?.length > 0
          )
            ? "catalog__container"
            : ""
        }`}
      >
        {!(
          parts?.partGroups &&
          parts.partGroups.length > 0 &&
          parts.partGroups[0].parts?.length > 0
        ) && <CatalogSidebar />}
        <CatalogMain
          catalogId={catalogId}
          modelId={modelId}
          setModelId={setModelId}
        />
      </div>
    </section>
  );
};

export default Catalog;
