import "./CatalogSidebar.css";
import { useGroups } from "../../../hooks/groups/useGroups";
import CatalogGroupsSidebarContent from "./CatalogGroupsSidebarContent/CatalogGroupsSidebarContent";
import CatalogModelSidebarContent from "./CatalogModelSidebarContent/CatalogModelSidebarContent";

const CatalogSidebar: React.FC = ({}) => {
  const { groupsFlat } = useGroups();
  return (
    <aside className="sidebar">
      {groupsFlat.length > 0 ? (
        <CatalogGroupsSidebarContent />
      ) : (
        <CatalogModelSidebarContent />
      )}
    </aside>
  );
};

export default CatalogSidebar;
