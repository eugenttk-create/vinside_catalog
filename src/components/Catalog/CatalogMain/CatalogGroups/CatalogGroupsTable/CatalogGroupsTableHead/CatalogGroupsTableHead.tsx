interface CatalogGroupsTableHeadProps {
  title: string;
}

const CatalogGroupsTableHead: React.FC<CatalogGroupsTableHeadProps> = ({
  title,
}) => {
  return <th className="table-header-el">{title}</th>;
};

export default CatalogGroupsTableHead;
