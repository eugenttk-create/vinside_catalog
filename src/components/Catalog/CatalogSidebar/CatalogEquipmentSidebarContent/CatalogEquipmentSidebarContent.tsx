import "./CatalogEquipmentSidebarContent.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import DefaultLoader from "../../../Loaders/DefaultLoader/DefaultLoader";

const CatalogEquipmentSidebarContent: React.FC = () => {
  const { vinInfo, isSidebarLoading } = useGroups();

  if (isSidebarLoading)
    return (
      <div className="equipment__loader">
        <DefaultLoader />
      </div>
    );

  return (
    <ul className="equipment">
      {vinInfo?.brand && (
        <li className="equipment__el">
          <p className="equipment__el-title">Brand</p>
          <p className="equipment__el-text">{vinInfo.brand}</p>
        </li>
      )}
      {vinInfo?.model && (
        <li className="equipment__el">
          <p className="equipment__el-title">Model</p>
          <p className="equipment__el-text">{vinInfo.model}</p>
        </li>
      )}{" "}
      {vinInfo?.vin && (
        <li className="equipment__el">
          <p className="equipment__el-title">VIN</p>
          <p className="equipment__el-text">{vinInfo.vin}</p>
        </li>
      )}
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
