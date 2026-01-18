import "./CatalogGroups.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import CatalogGroupsCard from "./CatalogGroupsCard/CatalogGroupCard";
import { Grid2X2, Menu } from "lucide-react";
import { useState } from "react";

interface CatalogGroupsProps {
  carId: string;
}

const CatalogGroups: React.FC<CatalogGroupsProps> = ({ carId }) => {
  const [switchState, setSwitchState] = useState("list");
  const { groupsFlat } = useGroups();

  const toggleSwitch = () => {
    if (switchState === "list") {
      setSwitchState("cards");
    } else {
      setSwitchState("list");
    }
  };

  return (
    <>
      <div className="cards-section__switch-container">
        <div className="cards-section__switch">
          <button
            className={`cards-section__switch-button ${
              switchState === "cards"
                ? "cards-section__switch-button_active"
                : ""
            }`}
            onClick={toggleSwitch}
          >
            <Grid2X2 className="icon" />
          </button>
          <button
            className={`cards-section__switch-button ${
              switchState === "list"
                ? "cards-section__switch-button_active"
                : ""
            }`}
            onClick={toggleSwitch}
          >
            <Menu className="icon" />
          </button>
        </div>
      </div>
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
