import "./CatalogSidebar.css";
import { useGroups } from "../../../hooks/groups/useGroups";
import CatalogGroupsSidebarContent from "./CatalogGroupsSidebarContent/CatalogGroupsSidebarContent";
import CatalogModelSidebarContent from "./CatalogModelSidebarContent/CatalogModelSidebarContent";

interface CatalogSidebarProps {
  isSidebarActive: boolean;
  setIsSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatalogSidebar: React.FC<CatalogSidebarProps> = ({ isSidebarActive }) => {
  const { groupsFlat } = useGroups();

  return (
    <aside className={`sidebar ${isSidebarActive ? "sidebar_active" : ""}`}>
      {groupsFlat.length > 0 ? (
        <CatalogGroupsSidebarContent />
      ) : (
        <CatalogModelSidebarContent />
      )}
    </aside>
  );
};

export default CatalogSidebar;
