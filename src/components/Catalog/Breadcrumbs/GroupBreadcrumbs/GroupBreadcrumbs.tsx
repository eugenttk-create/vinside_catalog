import "./GroupBreadcrumbs.css";
import { ChevronRight } from "lucide-react";
import { useGroups } from "../../../../hooks/groups/useGroups";

const GroupBreadcrumbs: React.FC = () => {
  const { selectedGroups } = useGroups();
  return (
    <ul className="breadcrumbs group-breadcrumbs">
      <li className="breadcrumbs__el">
        Categories{" "}
        {selectedGroups.length > 0 && (
          <ChevronRight className="icon breadcrumbs__chevron" />
        )}
      </li>
      {selectedGroups.length > 0 &&
        selectedGroups.map((el, index) => {
          return (
            <li className="breadcrumbs__el" key={index}>
              {el}{" "}
              {index !== selectedGroups.length - 1 && (
                <ChevronRight className="icon breadcrumbs__chevron" />
              )}
            </li>
          );
        })}
    </ul>
  );
};

export default GroupBreadcrumbs;
