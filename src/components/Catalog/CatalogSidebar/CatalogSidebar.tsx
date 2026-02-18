import "./CatalogSidebar.css";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useModels } from "../../../hooks/models/useModels";
import CatalogGroupsSidebarContent from "./CatalogGroupsSidebarContent/CatalogGroupsSidebarContent";
import CatalogModelSidebarContent from "./CatalogModelSidebarContent/CatalogModelSidebarContent";
import CatalogEquipmentSidebarContent from "./CatalogEquipmentSidebarContent/CatalogEquipmentSidebarContent";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

interface CatalogSidebarProps {
  isSidebarActive: boolean;
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
  setIsSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
  isSidebarActive,
  modelId,
  setModelId,
  setIsSidebarActive,
}) => {
  const [activeTab, setActiveTab] = useState("categories");
  const { groupsFlat } = useGroups();
  const { isVinSearch } = useModels();

  const tabs = [
    { id: "categories", title: "Категории" },
    { id: "equipment", title: "Комплектация" },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  useEffect(() => {
    if (!isVinSearch) {
      setActiveTab("categories");
    }
  }, [isVinSearch]);

  return (
    <aside className={`sidebar ${isSidebarActive ? "sidebar_active" : ""}`}>
      <button
        className="sidebar__toggle"
        onClick={() => setIsSidebarActive(false)}
      >
        <ChevronLeft className="icon" />
      </button>
      {groupsFlat.length > 0 && isVinSearch && (
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
