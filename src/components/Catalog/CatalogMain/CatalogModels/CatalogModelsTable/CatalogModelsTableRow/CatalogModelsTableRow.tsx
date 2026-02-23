import TruncatedCell from "../../../../../TruncatedCell/TruncatedCell";
import "./CatalogModelsTableRow.css";

interface CatalogModelsTableRowProps {
  text: string;
}

const CatalogModelsTableRow: React.FC<CatalogModelsTableRowProps> = ({
  text,
}) => {
  return <TruncatedCell text={text} />;
};

export default CatalogModelsTableRow;
