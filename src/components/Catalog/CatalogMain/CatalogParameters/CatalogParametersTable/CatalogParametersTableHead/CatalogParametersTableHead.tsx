interface CatalogParametersTableHeadProps {
  title: string;
}

const CatalogParametersTableHead: React.FC<CatalogParametersTableHeadProps> = ({
  title,
}) => {
  return <th className="table-header-el">{title}</th>;
};

export default CatalogParametersTableHead;
