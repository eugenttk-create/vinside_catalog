
import TruncatedCell from "../../../../../TruncatedCell/TruncatedCell";


interface CatalogModelsTableRowProps {
  text: string;
}

const CatalogModelsTableRow: React.FC<CatalogModelsTableRowProps> = ({
  text,
}) => {
  return <TruncatedCell text={text} />;
};

export default CatalogModelsTableRow;
