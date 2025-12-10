import "./CatalogEquipmentSidebarContent.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import DefaultLoader from "../../../Loaders/DefaultLoader/DefaultLoader";

const CatalogEquipmentSidebarContent: React.FC = () => {
  const { vinInfo, isSidebarLoading } = useGroups();
  console.log(vinInfo);

  if (isSidebarLoading)
    return (
      <div className="equipment__loader">
        <DefaultLoader />
      </div>
    );

  return (
    <ul className="equipment">
      {vinInfo &&
        vinInfo.parameters.map((p) => {
          return (
            <li className="equipment__el" key={p.key}>
              <p className="equipment__el-title">{p.key}</p>
              <p className="equipment__el-text">{p.value}</p>
            </li>
          );
        })}
    </ul>
  );
};

export default CatalogEquipmentSidebarContent;
