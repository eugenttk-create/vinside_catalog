import "./CatalogGroups.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import CatalogGroupsCard from "./CatalogGroupsCard/CatalogGroupCard";

interface CatalogGroupsProps {
  catalogId: string;
  carId: string;
}

const CatalogGroups: React.FC<CatalogGroupsProps> = ({ catalogId, carId }) => {
  const { groups } = useGroups();

  return (
    <ul className="cards-section">
      {groups &&
        groups.map((group) => {
          return (
            <CatalogGroupsCard
              name={group.name}
              catalogId={catalogId}
              carId={carId}
              idx={group.id}
              imageSrc={group.img}
              hasSubgroup={group.hasSubgroups}
              key={group.id}
            />
          );
        })}
    </ul>
  );
};

export default CatalogGroups;
