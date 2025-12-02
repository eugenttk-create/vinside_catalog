const CatalogSidebarSelect: React.FC = () => {
  return (
    <li className="sidebar__select-container">
      <span className="sidebar__select-title title">Марка</span>
      <select
        name="sidebar-select"
        id="sidebar-select"
        className="sidebar__select input"
      >
        <option value="1">Audi</option>
      </select>
    </li>
  );
};

export default CatalogSidebarSelect;
