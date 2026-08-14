import "./CatalogGroupsSidebarContent.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import { useParts } from "../../../../hooks/parts/useParts";
import { useModels } from "../../../../hooks/models/useModels";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useOE } from "../../../../hooks/OE/useOE";
import { useState, useCallback } from "react";
import SidebarGroup from "./SidebarGroup/SidebarGroup";
import type { GroupNode } from "../../../../store/groups/groups.types";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import React, { useMemo, useRef, useEffect } from "react";
import { ChevronRight, Info, Search } from "lucide-react";

const CatalogGroupsSidebarContent: React.FC = () => {
  const { catalogId } = useModels();
  const { carId } = useParameters();
  const { getOEParts, isOESearch } = useOE();
  const { breadcrumbs, handleAddBreadcrumb, handleTrimBreadcrumbs } =
    useBreadcrumbs();
  const { groupsTree, getGroups } = useGroups();
  const { getParts } = useParts();

  const [openRootId, setOpenRootId] = useState<string | null>(null);
  const [lastRootId, setLastRootId] = useState<string | null>(null);
  const [collapsedScopes, setCollapsedScopes] = useState<Set<string>>(() => {
    const scopes = groupsTree
      .map((node) => node.scope)
      .filter((scope): scope is string => scope !== null);
    return new Set(scopes);
  });
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || groupsTree.length === 0) return;

    const scopes = groupsTree
      .map((node) => node.scope)
      .filter((scope): scope is string => scope !== null);

    setCollapsedScopes(new Set(scopes));
    initializedRef.current = true;
  }, [groupsTree]);

  const handleToggleScope = useCallback((scope: string) => {
    setCollapsedScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) {
        next.delete(scope);
      } else {
        next.add(scope);
      }
      return next;
    });
  }, []);

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
        if (carId) {
          if (isOESearch) {
            getOEParts(node.id);
          } else {
            getParts(catalogId, carId, node.id);
          }
        }
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
      isOESearch,
      getOEParts,
    ]
  );

  const groupedByScope = useMemo(() => {
    const result: { scope: string | null; nodes: GroupNode[] }[] = [];

    for (const node of groupsTree) {
      const last = result[result.length - 1];
      if (last && last.scope === node.scope) {
        last.nodes.push(node);
      } else {
        result.push({ scope: node.scope, nodes: [node] });
      }
    }

    return result;
  }, [groupsTree]);

  return (
    <ul className="sidebar__dropdown-list">
      <li className="sidebar__ai-search-wrapper">
        <div className="sidebar__ai-search">
          <input
            type="text"
            placeholder="AI Search"
            className="sidebar__ai-search-input"
          />
          <Search className="sidebar__ai-search-icon" />
        </div>
        <span
          className="sidebar__ai-info"
          title="Enter a part name or description to search using AI"
        >
          <Info className="sidebar__ai-info-icon" />
        </span>
      </li>

      {groupedByScope.map((group) => {
        const isCollapsed =
          group.scope !== null && collapsedScopes.has(group.scope);

        return (
          <React.Fragment key={group.scope ?? "no-scope"}>
            {group.scope !== null && group.scope !== "" ? (
              <li
                className="sidebar__scope-label"
                onClick={() => handleToggleScope(group.scope!)}
              >
                <ChevronRight
                  className={`icon sidebar__scope-icon ${
                    isCollapsed ? "" : "sidebar__scope-icon_rotated"
                  }`}
                />
                {group.scope}
              </li>
            ) : (
              <li
                className="sidebar__scope-label"
                onClick={() => handleToggleScope(group.scope!)}
              >
                <ChevronRight
                  className={`icon sidebar__scope-icon ${
                    isCollapsed ? "" : "sidebar__scope-icon_rotated"
                  }`}
                />
                Groups
              </li>
            )}

            {!isCollapsed &&
              group.nodes.map((node) => (
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
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default CatalogGroupsSidebarContent;
