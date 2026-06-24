import "./CatalogEquipmentSidebarContent.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import DefaultLoader from "../../../Loaders/DefaultLoader/DefaultLoader";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CatalogEquipmentSidebarContent: React.FC = () => {
  const { vinInfo, isSidebarLoading } = useGroups();
  const [isCodesOpen, setIsCodesOpen] = useState(false);

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
        vinInfo.parameters
          .filter(
            (p) =>
              p.key === "prod_date" ||
              p.key === "model_year" ||
              p.key === "engine_code"
          )
          .map((p) => {
            return (
              <li className="equipment__el" key={p.key}>
                <p className="equipment__el-title">
                  {p.description ? p.description : p.key}
                </p>
                <p className="equipment__el-text">{p.value}</p>
              </li>
            );
          })}
      <div className="equipment__option-codes">
        <div
          className="equipment__option-codes-title-container"
          onClick={() => setIsCodesOpen(!isCodesOpen)}
        >
          <p className="equipment__option-codes-title">Опционные коды</p>
          <ChevronDown
            className={`icon ${
              isCodesOpen
                ? "equipment__option-codes-icon_rotated"
                : "equipment__option-codes-icon"
            }`}
          />
        </div>
        {isCodesOpen && vinInfo?.optionCodes && (
          <ul className="equipment__option-codes-list">
            {vinInfo.optionCodes.map((oc) => {
              return (
                <li className="equipment__option-code" key={oc.key}>
                  <p className="equipment__option-code-title">{oc.key}</p>
                  <p className="equipment__option-code-text">
                    {oc.description || oc.key}
                  </p>
                  <p className="equipment__option-code-text equipment__option-code-text_gray">
                    Code: {oc.value}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ul>
  );
};

export default CatalogEquipmentSidebarContent;
