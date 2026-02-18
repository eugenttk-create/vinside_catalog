import { useGroups } from "../../../../hooks/groups/useGroups";
import { useParts } from "../../../../hooks/parts/useParts";
import { useModels } from "../../../../hooks/models/useModels";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useState, useCallback } from "react";
import SidebarGroup from "./SidebarGroup/SidebarGroup";
import type { GroupNode } from "../../../../store/groups/groups.types";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";

const CatalogGroupsSidebarContent: React.FC = () => {
  const { catalogId } = useModels();
  const { carId } = useParameters();
  const { breadcrumbs, handleAddBreadcrumb, handleTrimBreadcrumbs } =
    useBreadcrumbs();
  const { groupsTree, getGroups } = useGroups();
  const { getParts } = useParts();

  const [openRootId, setOpenRootId] = useState<string | null>(null);
  const [lastRootId, setLastRootId] = useState<string | null>(null);

  const handleClick = useCallback(
    (
      node: GroupNode,
      levelOpenId: string | null,
      setLevelOpenId: (id: string | null) => void,
      levelLastId: string | null,
      setLevelLastId: (id: string | null) => void
    ) => {
      const isAlreadyOpen = levelOpenId === node.id;

      if (isAlreadyOpen) {
        setLevelOpenId(null);
        return;
      }

      const prevId = levelOpenId ?? levelLastId;
      const isReopening = prevId === node.id;

      if (prevId !== null && !isReopening) {
        const crumbIndex = breadcrumbs.findIndex((b) => b.id === prevId);
        if (crumbIndex !== -1) {
          handleTrimBreadcrumbs(crumbIndex - 1);
        }
      }

      setLevelOpenId(node.id);
      setLevelLastId(node.id);

      if (isReopening) return;

      const alreadyHasCrumb = breadcrumbs.some((b) => b.id === node.id);
      if (alreadyHasCrumb) return;

      if (node.hasSubgroups) {
        handleAddBreadcrumb("group", node.name, node.id);
        if (carId) getGroups(catalogId, carId, node.id);
      } else {
        handleAddBreadcrumb("part", node.name, node.id);
        if (carId) getParts(catalogId, carId, node.id);
      }
    },
    [
      breadcrumbs,
      handleAddBreadcrumb,
      handleTrimBreadcrumbs,
      carId,
      catalogId,
      getGroups,
      getParts,
    ]
  );

  return (
    <ul className="sidebar__dropdown-list">
      {groupsTree.map((node) => (
        <SidebarGroup
          key={node.id}
          node={node}
          levelOpenId={openRootId}
          setLevelOpenId={setOpenRootId}
          levelLastId={lastRootId}
          setLevelLastId={setLastRootId}
          onNodeClick={handleClick}
        />
      ))}
    </ul>
  );
};

export default CatalogGroupsSidebarContent;
