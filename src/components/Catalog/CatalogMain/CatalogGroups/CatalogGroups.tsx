import "./CatalogGroups.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import CatalogGroupsCard from "./CatalogGroupsCard/CatalogGroupCard";
import GroupInfoPopup from "../../../GroupInfoPopup/GroupInfoPopup";
import type { GroupInfoPopupDescription } from "../../../GroupInfoPopup/GroupInfoPopup";
import { useState } from "react";
import CatalogGroupsTable from "./CatalogGroupsTable/CatalogGroupsTable";
import { useParts } from "../../../../hooks/parts/useParts";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import { useModels } from "../../../../hooks/models/useModels";

interface CatalogGroupsProps {
  carId: string;
  switchState: string;
}

const CatalogGroups: React.FC<CatalogGroupsProps> = ({
  carId,
  switchState,
}) => {
  const { groupsFlat, getGroups } = useGroups();
  const { getParts } = useParts();
  const { handleAddBreadcrumb } = useBreadcrumbs();
  const { catalogId } = useModels();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<GroupInfoPopupDescription>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  return switchState === "cards" ? (
    <>
      <ul
        className={`cards-section ${
          switchState === "cards" ? "cards-section_grid" : "cards-section_list"
        } cards-section_groups`}
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
          />
        ))}
      </ul>
      <GroupInfoPopup
        isActive={isInfoActive}
        description={currentDescription}
        onClose={() => setIsInfoActive(false)}
        position={popupPosition}
      />
    </>
  ) : (
    <CatalogGroupsTable
      carId={carId}
      onClick={(idx, name, hasSubgroup) => {
        if (hasSubgroup) {
          getGroups(catalogId, carId, idx);
          handleAddBreadcrumb("group", name, idx);
        } else {
          getParts(catalogId, carId, idx);
          handleAddBreadcrumb("part", name, idx);
        }
      }}
    />
  );
};

export default CatalogGroups;
