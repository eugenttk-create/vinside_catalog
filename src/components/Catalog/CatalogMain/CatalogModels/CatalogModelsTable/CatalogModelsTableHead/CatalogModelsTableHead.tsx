import shared from "../../../../../../styles/common.module.css";
interface CatalogModelsTableHeadProps {
  title: string;
}

const CatalogModelsTableHead: React.FC<CatalogModelsTableHeadProps> = ({
  title,
}) => {
  return <th className={shared["table-header-el"]}>{title}</th>;
};

export default CatalogModelsTableHead;
