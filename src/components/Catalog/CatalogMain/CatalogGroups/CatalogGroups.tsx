import "./CatalogGroups.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import CatalogGroupsCard from "./CatalogGroupsCard/CatalogGroupCard";

interface CatalogGroupsProps {
  carId: string;
  switchState: string;
}

const CatalogGroups: React.FC<CatalogGroupsProps> = ({
  carId,
  switchState,
}) => {
  const { groupsFlat } = useGroups();

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
          />
        ))}
      </ul>
    </>
  );
};

export default CatalogGroups;
