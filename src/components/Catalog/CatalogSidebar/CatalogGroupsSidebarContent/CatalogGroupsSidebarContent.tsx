import { useGroups } from "../../../../hooks/groups/useGroups";
import { useParts } from "../../../../hooks/parts/useParts";
import { useModels } from "../../../../hooks/models/useModels";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import SidebarGroup from "./SidebarGroup/SidebarGroup";
import type { GroupNode } from "../../../../store/groups/groups.types";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";

const CatalogGroupsSidebarContent: React.FC = ({}) => {
  const { catalogId } = useModels();
  const { carId } = useParameters();
  const { handleAddBreadcrumb } = useBreadcrumbs();
  const { groupsTree, getGroups } = useGroups();
  const { getParts } = useParts();

  const handleClick = (node: GroupNode) => {
    if (node.hasSubgroups) {
      handleAddBreadcrumb("group", node.name, node.id);
    } else {
      handleAddBreadcrumb("part", node.name, node.id);
    }

    if (node.hasSubgroups) {
      if (carId) {
        getGroups(catalogId, carId, node.id);
      }
    } else {
      if (carId) {
        getParts(catalogId, carId, node.id);
      }
    }
  };

  return (
    <ul className="sidebar__dropdown-list">
      {groupsTree.map((node) => (
        <SidebarGroup key={node.id} node={node} onClick={handleClick} />
      ))}
    </ul>
  );
};

export default CatalogGroupsSidebarContent;
