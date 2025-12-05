import "./CatalogSidebar.css";
import { useGroups } from "../../../hooks/groups/useGroups";
import CatalogGroupsSidebarContent from "./CatalogGroupsSidebarContent/CatalogGroupsSidebarContent";
import CatalogModelSidebarContent from "./CatalogModelSidebarContent/CatalogModelSidebarContent";

interface CatalogSidebarProps {
  isSidebarActive: boolean;
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
  isSidebarActive,
  modelId,
  setModelId,
}) => {
  const { groupsFlat } = useGroups();

  return (
    <aside className={`sidebar ${isSidebarActive ? "sidebar_active" : ""}`}>
      {groupsFlat.length > 0 ? (
        <CatalogGroupsSidebarContent />
      ) : (
        <CatalogModelSidebarContent modelId={modelId} setModelId={setModelId} />
      )}
    </aside>
  );
};

export default CatalogSidebar;
