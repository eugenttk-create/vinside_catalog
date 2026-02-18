import CatalogMain from "./CatalogMain/CatalogMain";
import CatalogHeader from "./CatalogHeader/CatalogHeader";
import CatalogSidebar from "./CatalogSidebar/CatalogSidebar";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import { useParts } from "../../hooks/parts/useParts";
import "./Catalog.css";
import { useState } from "react";

interface CatalogProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Catalog: React.FC<CatalogProps> = ({ modelId, setModelId }) => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const { parts } = useParts();
  return (
    <section className="catalog">
      <CatalogHeader
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />
      {!(
        parts?.partGroups &&
        parts.partGroups.length > 0 &&
        parts.partGroups[0].parts?.length > 0
      ) && <Breadcrumbs modelId={modelId} setModelId={setModelId} />}
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
        ) && (
          <>
            <CatalogSidebar
              isSidebarActive={isSidebarActive}
              modelId={modelId}
              setModelId={setModelId}
              setIsSidebarActive={setIsSidebarActive}
            />
          </>
        )}
        <CatalogMain
          modelId={modelId}
          setModelId={setModelId}
          setIsSidebarAvtive={setIsSidebarActive}
          isSidebarActive={isSidebarActive}
        />
      </div>
    </section>
  );
};

export default Catalog;
