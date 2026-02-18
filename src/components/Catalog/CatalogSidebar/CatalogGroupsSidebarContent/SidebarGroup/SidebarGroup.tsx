import type { GroupNode } from "../../../../../store/groups/groups.types";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const SidebarGroup: React.FC<{
  node: GroupNode;
  levelOpenId: string | null;
  setLevelOpenId: (id: string | null) => void;
  levelLastId: string | null;
  setLevelLastId: (id: string | null) => void;
  onNodeClick: (
    node: GroupNode,
    levelOpenId: string | null,
    setLevelOpenId: (id: string | null) => void,
    levelLastId: string | null,
    setLevelLastId: (id: string | null) => void
  ) => void;
}> = ({
  node,
  levelOpenId,
  setLevelOpenId,
  levelLastId,
  setLevelLastId,
  onNodeClick,
}) => {
  const [openChildId, setOpenChildId] = useState<string | null>(null);
  const [lastChildId, setLastChildId] = useState<string | null>(null);

  const isOpen = levelOpenId === node.id;
  const hasChildren = isOpen && node.children && node.children.length > 0;

  const handleClick = () => {
    onNodeClick(node, levelOpenId, setLevelOpenId, levelLastId, setLevelLastId);
  };

  return (
    <li className="sidebar__dropdown-el">
      <div className="sidebar__group-title" onClick={handleClick}>
        <ChevronRight
          className={`icon sidebar__dropdown-el-icon ${
            isOpen ? "sidebar__dropdown-el-icon_rotated" : ""
          }`}
        />
        {node.name}
      </div>

      {hasChildren && (
        <ul className="sidebar__dropdown-list nested">
          {node.children!.map((child) => (
            <SidebarGroup
              key={child.id}
              node={child}
              levelOpenId={openChildId}
              setLevelOpenId={setOpenChildId}
              levelLastId={lastChildId}
              setLevelLastId={setLastChildId}
              onNodeClick={onNodeClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarGroup;
