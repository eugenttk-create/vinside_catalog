import shared from "../../../../styles/common.module.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import CatalogGroupsCard from "./CatalogGroupsCard/CatalogGroupCard";
import GroupInfoPopup from "../../../GroupInfoPopup/GroupInfoPopup";
import type { GroupInfoPopupDescription } from "../../../GroupInfoPopup/GroupInfoPopup";
import { useState } from "react";
import CatalogGroupsTable from "./CatalogGroupsTable/CatalogGroupsTable";
import { useParts } from "../../../../hooks/parts/useParts";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import { useModels } from "../../../../hooks/models/useModels";
import { useOE } from "../../../../hooks/OE/useOE";

interface CatalogGroupsProps {
  carId: string;
  switchState: string;
}

const CatalogGroups: React.FC<CatalogGroupsProps> = ({
  carId,
  switchState,
}) => {
  const { groupsFlat, getGroups, isAiSearch, aiSearchQuery } = useGroups();
  const { isOESearch, getOEParts } = useOE();
  const { getParts } = useParts();
  const { handleAddBreadcrumb } = useBreadcrumbs();
  const { catalogId } = useModels();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<GroupInfoPopupDescription>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return switchState === "cards" ? (
    <>
      <ul
        className={`${shared["cards-section"]} ${switchState === "cards" ? shared["cards-section_grid"] : shared["cards-section_list"]} ${shared["cards-section_groups"]}`}
      >
        {groupsFlat.map((group) => (
          <CatalogGroupsCard
            key={group.id}
            name={group.name}
            carId={carId}
            idx={group.id}
            imageSrc={group.img}
            hasSubgroup={group.hasSubgroups}
            switchState={switchState}
            description={group.description}
            setIsInfoActive={setIsInfoActive}
            setCurrentDescription={setCurrentDescription}
            setPopupPosition={setPopupPosition}
            setCurrentTitle={setCurrentTitle}
            activeCardId={activeCardId}
            setActiveCardId={setActiveCardId}
          />
        ))}
      </ul>
      <GroupInfoPopup
        isActive={isInfoActive}
        description={currentDescription}
        onClose={() => {
          setIsInfoActive(false);
          setActiveCardId(null);
        }}
        position={popupPosition}
        title={currentTitle}
      />
    </>
  ) : (
    <CatalogGroupsTable
      carId={carId}
      onClick={(idx, name, hasSubgroup) => {
        if (hasSubgroup) {
          getGroups(catalogId, carId, idx);
          handleAddBreadcrumb("group", name, idx);
        } else if (isAiSearch && aiSearchQuery) {
          getParts(catalogId, carId, idx, aiSearchQuery);
          handleAddBreadcrumb("part", name, idx);
        } else if (isOESearch) {
          getOEParts(idx);
          handleAddBreadcrumb("part", name, idx);
        } else {
          getParts(catalogId, carId, idx);
          handleAddBreadcrumb("part", name, idx);
        }
      }}
    />
  );
};

export default CatalogGroups;
