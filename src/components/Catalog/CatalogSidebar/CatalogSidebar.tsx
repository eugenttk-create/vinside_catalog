import "./CatalogSidebar.css";
import { useGroups } from "../../../hooks/groups/useGroups";
import CatalogGroupsSidebarContent from "./CatalogGroupsSidebarContent/CatalogGroupsSidebarContent";
import CatalogModelSidebarContent from "./CatalogModelSidebarContent/CatalogModelSidebarContent";
import CatalogEquipmentSidebarContent from "./CatalogEquipmentSidebarContent/CatalogEquipmentSidebarContent";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("categories");
  const { groupsFlat } = useGroups();

  const tabs = [
    { id: "categories", title: "Категории" },
    { id: "equipment", title: "Комплектация" },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <aside className={`sidebar ${isSidebarActive ? "sidebar_active" : ""}`}>
      {groupsFlat.length > 0 && (
        <ul className="sidebar__tabs">
          {tabs.map((tab) => {
            return (
              <li
                className={`sidebar__tab ${
                  tab.id === activeTab ? "sidebar__tab_active" : ""
                }`}
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="sidebar__tab-title">{tab.title}</span>
              </li>
            );
          })}
        </ul>
      )}
      {activeTab === "categories" ? (
        <>
          {groupsFlat.length > 0 ? (
            <CatalogGroupsSidebarContent />
          ) : (
            <CatalogModelSidebarContent
              modelId={modelId}
              setModelId={setModelId}
            />
          )}
        </>
      ) : activeTab === "equipment" ? (
        <CatalogEquipmentSidebarContent />
      ) : (
        <></>
      )}
    </aside>
  );
};

export default CatalogSidebar;
