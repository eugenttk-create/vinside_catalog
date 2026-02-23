import "./CatalogModelsTableHead.css";

interface CatalogModelsTableHeadProps {
  title: string;
}

const CatalogModelsTableHead: React.FC<CatalogModelsTableHeadProps> = ({
  title,
}) => {
  return <th className="table-header-el">{title}</th>;
};

export default CatalogModelsTableHead;
