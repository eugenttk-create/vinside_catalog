import TruncatedCell from "../../../../../TruncatedCell/TruncatedCell";

interface CatalogParametersTableRowProps {
  text: string;
}

const CatalogParametersTableRow: React.FC<CatalogParametersTableRowProps> = ({
  text,
}) => {
  return <TruncatedCell text={text} />;
};

export default CatalogParametersTableRow;
