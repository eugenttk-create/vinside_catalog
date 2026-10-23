import shared from "../../../../../../styles/common.module.css";
interface CatalogGroupsTableHeadProps {
  title: string;
}

const CatalogGroupsTableHead: React.FC<CatalogGroupsTableHeadProps> = ({
  title,
}) => {
  return <th className={shared["table-header-el"]}>{title}</th>;
};

export default CatalogGroupsTableHead;
