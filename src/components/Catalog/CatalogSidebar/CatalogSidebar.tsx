import styles from "./CatalogSidebar.module.css";
import shared from "../../../styles/common.module.css";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useModels } from "../../../hooks/models/useModels";
import CatalogGroupsSidebarContent from "./CatalogGroupsSidebarContent/CatalogGroupsSidebarContent";
import CatalogModelSidebarContent from "./CatalogModelSidebarContent/CatalogModelSidebarContent";
import CatalogEquipmentSidebarContent from "./CatalogEquipmentSidebarContent/CatalogEquipmentSidebarContent";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "../../../hooks/translation/useTranslation";

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("categories");
  const { groupsFlat } = useGroups();
  const { isVinSearch } = useModels();

  const tabs = [
    { id: "categories", title: t.widget_categories },
    { id: "equipment", title: t.widget_equipment },
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
    <aside className={`${styles["sidebar"]} ${isSidebarActive ? styles["sidebar_active"] : ""}`}>
      <button
        className={styles["sidebar__toggle"]}
        onClick={() => setIsSidebarActive(false)}
      >
        <ChevronLeft className={shared["icon"]} />
      </button>
      {groupsFlat.length > 0 && isVinSearch && (
        <ul className={styles["sidebar__tabs"]}>
          {tabs.map((tab) => {
            return (
              <li
                className={`${styles["sidebar__tab"]} ${tab.id !== activeTab ? styles["sidebar__tab_active"] : ""}`}
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className={styles["sidebar__tab-title"]}>{tab.title}</span>
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
