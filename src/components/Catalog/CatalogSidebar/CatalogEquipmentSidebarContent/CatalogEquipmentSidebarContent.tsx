import styles from "./CatalogEquipmentSidebarContent.module.css";
import shared from "../../../../styles/common.module.css";
import { useGroups } from "../../../../hooks/groups/useGroups";
import DefaultLoader from "../../../Loaders/DefaultLoader/DefaultLoader";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CatalogEquipmentSidebarContent: React.FC = () => {
  const { vinInfo, isSidebarLoading } = useGroups();
  const [isCodesOpen, setIsCodesOpen] = useState(false);

  if (isSidebarLoading)
    return (
      <div className={styles["equipment__loader"]}>
        <DefaultLoader />
      </div>
    );

  return (
    <ul className={styles["equipment"]}>
      {vinInfo?.brand && (
        <li className={styles["equipment__el"]}>
          <p className={styles["equipment__el-title"]}>Brand</p>
          <p className={styles["equipment__el-text"]}>{vinInfo.brand}</p>
        </li>
      )}
      {vinInfo?.model && (
        <li className={styles["equipment__el"]}>
          <p className={styles["equipment__el-title"]}>Model</p>
          <p className={styles["equipment__el-text"]}>{vinInfo.model}</p>
        </li>
      )}{" "}
      {vinInfo?.vin && (
        <li className={styles["equipment__el"]}>
          <p className={styles["equipment__el-title"]}>VIN</p>
          <p className={styles["equipment__el-text"]}>{vinInfo.vin}</p>
        </li>
      )}
      {vinInfo &&
        vinInfo.parameters.map((p) => {
          return (
            <li className={styles["equipment__el"]} key={p.key}>
              <p className={styles["equipment__el-title"]}>
                {p.description ? p.description : p.key}
              </p>
              <p className={styles["equipment__el-text"]}>{p.value}</p>
            </li>
          );
        })}
      <div className={styles["equipment__option-codes"]}>
        <div
          className={styles["equipment__option-codes-title-container"]}
          onClick={() => setIsCodesOpen(!isCodesOpen)}
        >
          <ChevronDown
            className={`${shared["icon"]} ${isCodesOpen ? styles["equipment__option-codes-icon_rotated"] : styles["equipment__option-codes-icon"]}`}
          />
          <p className={styles["equipment__option-codes-title"]}>Опционные коды</p>
        </div>
        {isCodesOpen && vinInfo?.optionCodes && (
          <ul className={styles["equipment__option-codes-list"]}>
            {vinInfo.optionCodes.map((oc) => {
              return (
                <li className={styles["equipment__option-code"]} key={oc.key}>
                  <p className={styles["equipment__option-code-title"]}>{oc.key}</p>
                  <p className={styles["equipment__option-code-text"]}>
                    {oc.description || oc.key}
                  </p>
                  <p className={`${styles["equipment__option-code-text"]} ${styles["equipment__option-code-text_gray"]}`}>
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
