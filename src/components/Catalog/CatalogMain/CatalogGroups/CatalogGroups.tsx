import "./CatalogGroups.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import CatalogGroupsCard from "./CatalogGroupsCard/CatalogGroupCard";
import GroupBreadcrumbs from "../../Breadcrumbs/GroupBreadcrumbs/GroupBreadcrumbs";

interface CatalogGroupsProps {
  carId: string;
}

const CatalogGroups: React.FC<CatalogGroupsProps> = ({ carId }) => {
  const { groupsFlat } = useGroups();

  return (
    <>
      <GroupBreadcrumbs />

      <ul className="cards-section cards-section_groups">
        {groupsFlat.map((group) => (
          <CatalogGroupsCard
            key={group.id}
            name={group.name}
            carId={carId}
            idx={group.id}
            imageSrc={group.img}
            hasSubgroup={group.hasSubgroups}
          />
        ))}
      </ul>
    </>
  );
};

export default CatalogGroups;
