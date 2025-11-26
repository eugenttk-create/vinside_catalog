import "./CatalogSidebar.css";

const CatalogSidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar__selects">
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
      </ul>
    </aside>
  );
};

export default CatalogSidebar;
