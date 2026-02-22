import "./CatalogGroups.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import CatalogGroupsCard from "./CatalogGroupsCard/CatalogGroupCard";
import GroupInfoPopup from "../../../GroupInfoPopup/GroupInfoPopup";
import type { GroupInfoPopupDescription } from "../../../GroupInfoPopup/GroupInfoPopup";
import { useState } from "react";

interface CatalogGroupsProps {
  carId: string;
  switchState: string;
}

const CatalogGroups: React.FC<CatalogGroupsProps> = ({
  carId,
  switchState,
}) => {
  const { groupsFlat } = useGroups();
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [currentDescription, setCurrentDescription] =
    useState<GroupInfoPopupDescription>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  return (
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
  );
};

export default CatalogGroups;
