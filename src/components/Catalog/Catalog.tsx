import styles from "./Catalog.module.css";
import CatalogMain from "./CatalogMain/CatalogMain";
import CatalogHeader from "./CatalogHeader/CatalogHeader";
import CatalogSidebar from "./CatalogSidebar/CatalogSidebar";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import { useParts } from "../../hooks/parts/useParts";

import { useState } from "react";
import { useGroups } from "../../hooks/groups/useGroups";
import { useAnalogs } from "../../hooks/analogs/useAnalogs";
import { useAppSelector } from "../../hooks/store/useAppSelector";

interface CatalogProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Catalog: React.FC<CatalogProps> = ({ modelId, setModelId }) => {
  const [isSidebarActive, setIsSidebarActive] = useState(true);
  const { isAiSearch, sidebarVisible } = useGroups();
  const theme = useAppSelector((state) => state.theme.mode);

  const { parts } = useParts();
  const { isAnalogsView } = useAnalogs();

  const hasPartsResponse = Boolean(
    parts?.partGroups && parts.partGroups.length > 0,
  );
  const showOuterBreadcrumbs = !hasPartsResponse || isAnalogsView;
  const showSidebar =
    !hasPartsResponse && !isAnalogsView && !isAiSearch && sidebarVisible;

  return (
    <section
      className={styles["catalog"]}
      id="catalog-root"
      data-carcat-theme={theme}
    >
      <CatalogHeader
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />
      {showOuterBreadcrumbs && (
        <Breadcrumbs modelId={modelId} setModelId={setModelId} />
      )}
      <div className={showOuterBreadcrumbs ? styles["catalog__container"] : ""}>
        {showSidebar && (
          <CatalogSidebar
            isSidebarActive={isSidebarActive}
            modelId={modelId}
            setModelId={setModelId}
            setIsSidebarActive={setIsSidebarActive}
          />
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
