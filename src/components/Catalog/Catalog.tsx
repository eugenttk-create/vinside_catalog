import CatalogMain from "./CatalogMain/CatalogMain";
import CatalogHeader from "./CatalogHeader/CatalogHeader";
import CatalogSidebar from "./CatalogSidebar/CatalogSidebar";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import { useParts } from "../../hooks/parts/useParts";
import "./Catalog.css";
import { useState, useEffect, useRef } from "react";
import { useGroups } from "../../hooks/groups/useGroups";
import { useAppSelector } from "../../hooks/store/useAppSelector";

interface CatalogProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Catalog: React.FC<CatalogProps> = ({ modelId, setModelId }) => {
  const [isSidebarActive, setIsSidebarActive] = useState(true);
  const { isAiSearch, sidebarVisible } = useGroups();
  const theme = useAppSelector((state) => state.theme.mode);
  const catalogRef = useRef<HTMLElement>(null);

  const { parts } = useParts();

  useEffect(() => {
    const setOn = (el: Element | null | undefined) => {
      if (el) el.setAttribute("data-carcat-theme", theme);
    };

    setOn(catalogRef.current);

    const portalShadow = window.__WIDGET_PORTAL_ROOT__;
    if (portalShadow) {
      setOn(portalShadow.host);
      setOn(portalShadow.getElementById("widget-catalog-portal"));
    } else {
      setOn(document.getElementById("widget-catalog-portal"));
    }

    const widgetShadow = window.__WIDGET_SHADOW_ROOT__;
    if (widgetShadow) {
      setOn(widgetShadow.host);
    }
  }, [theme]);

  const hasPartsResponse = Boolean(
    parts?.partGroups && parts.partGroups.length > 0
  );

  return (
    <section
      className="catalog"
      id="catalog-root"
      ref={catalogRef}
      data-carcat-theme={theme}
    >
      <CatalogHeader
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />
      {!hasPartsResponse && (
        <Breadcrumbs modelId={modelId} setModelId={setModelId} />
      )}
      <div className={`${!hasPartsResponse ? "catalog__container" : ""}`}>
        {!hasPartsResponse && !isAiSearch && sidebarVisible && (
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
