import shared from "../../../../../../styles/common.module.css";
interface CatalogParametersTableHeadProps {
  title: string;
}

const CatalogParametersTableHead: React.FC<CatalogParametersTableHeadProps> = ({
  title,
}) => {
  return <th className={shared["table-header-el"]}>{title}</th>;
};

export default CatalogParametersTableHead;
