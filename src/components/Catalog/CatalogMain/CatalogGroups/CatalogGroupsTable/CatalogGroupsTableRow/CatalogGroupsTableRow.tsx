import TruncatedCell from "../../../../../TruncatedCell/TruncatedCell";

interface CatalogGroupsTableRowProps {
  text: string;
}

const CatalogGroupsTableRow: React.FC<CatalogGroupsTableRowProps> = ({
  text,
}) => {
  return <TruncatedCell text={text} />;
};

export default CatalogGroupsTableRow;
