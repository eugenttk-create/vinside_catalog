import "./CatalogSidebar.css";
import CatalogGroupsSidebarContent from "./CatalogGroupsSidebarContent/CatalogGroupsSidebarContent";

const CatalogSidebar: React.FC = ({}) => {
  return (
    <aside className="sidebar">
      <CatalogGroupsSidebarContent />
    </aside>
  );
};

export default CatalogSidebar;
