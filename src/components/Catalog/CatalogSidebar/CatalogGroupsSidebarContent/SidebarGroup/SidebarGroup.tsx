import type { GroupNode } from "../../../../../store/groups/groups.types";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const SidebarGroup: React.FC<{
  node: GroupNode;
  onClick: (node: GroupNode) => void;
}> = ({ node, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const canExpand = node.hasSubgroups;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (canExpand) {
      if (isOpen) {
        return;
      } else {
        setIsOpen(true);
        onClick(node);
      }
    } else {
      onClick(node);
    }
  };

  return (
    <li className="sidebar__dropdown-el">
      <div className="sidebar__group-title" onClick={handleClick}>
        <ChevronRight
          className={`icon sidebar__dropdown-el-icon ${
            hasChildren ? "sidebar__dropdown-el-icon_rotated" : ""
          }`}
        />
        {node.name}
      </div>

      {hasChildren && (
        <ul className="sidebar__dropdown-list nested">
          {node.children!.map((child) => (
            <SidebarGroup key={child.id} node={child} onClick={onClick} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarGroup;
