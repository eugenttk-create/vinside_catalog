import { useState } from "react";

const MAX_LENGTH = 100;

const TruncatedCell: React.FC<{ text: string }> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTruncated = text.length > MAX_LENGTH;
  const displayText =
    isTruncated && !isExpanded ? text.slice(0, MAX_LENGTH) + "…" : text;

  const handleClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
    if (isTruncated) {
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <td
      className="table-data"
      onClick={handleClick}
      style={isTruncated ? { cursor: "pointer" } : undefined}
    >
      <span className="table-data-text">{displayText}</span>
    </td>
  );
};

export default TruncatedCell;
