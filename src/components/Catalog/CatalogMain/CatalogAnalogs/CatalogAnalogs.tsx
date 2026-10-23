import styles from "./CatalogAnalogs.module.css";
import { useAnalogs } from "../../../../hooks/analogs/useAnalogs";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import { useTranslation } from "../../../../hooks/translation/useTranslation";
import PageLoader from "../../../Loaders/PageLoader/PageLoader";
import { Box, Info } from "lucide-react";
import type { Analog } from "../../../../store/analogs/analogs.types";

const CatalogAnalogs: React.FC = () => {
  const { t } = useTranslation();
  const { analogs, analogsLoading, analogsError, getAnalogInfo } = useAnalogs();
  const { handleAddBreadcrumb } = useBreadcrumbs();

  const handleRowClick = (analog: Analog) => {
    getAnalogInfo(analog);
    handleAddBreadcrumb(
      "analog-detail",
      `${analog.brand} ${analog.articleNumber}`,
      String(analog.id),
    );
  };

  if (analogsLoading) {
    return <PageLoader />;
  }

  return (
    <div className={styles["catalog-analogs"]}>
      <div className={styles["catalog-analogs__table-wrapper"]}>
        <table className={styles["catalog-analogs__table"]}>
          <thead className={styles["catalog-analogs__thead"]}>
            <tr>
              <th className={styles["catalog-analogs__th"]}>
                {t.widget_analog_number ?? "Номер Аналога"}
              </th>
              <th className={styles["catalog-analogs__th"]}>
                {t.widget_illustration ?? "Иллюстрация"}
              </th>
              <th className={styles["catalog-analogs__th"]}>
                {t.widget_name ?? "Наименование"}
              </th>
              <th className={styles["catalog-analogs__th"]}>
                {t.widget_description ?? "Описание"}
              </th>
            </tr>
          </thead>
          <tbody className={styles["catalog-analogs__tbody"]}>
            {analogsError ? (
              <tr>
                <td
                  className={`${styles["catalog-analogs__td"]} ${styles["catalog-analogs__empty"]}`}
                  colSpan={4}
                >
                  {analogsError}
                </td>
              </tr>
            ) : analogs.length === 0 ? (
              <tr>
                <td
                  className={`${styles["catalog-analogs__td"]} ${styles["catalog-analogs__empty"]}`}
                  colSpan={4}
                >
                  {t.widget_no_data ?? "Нет данных"}
                </td>
              </tr>
            ) : (
              analogs.map((analog) => (
                <tr
                  key={`${analog.id}-${analog.articleNumber}`}
                  className={styles["catalog-analogs__tr"]}
                  onClick={() => handleRowClick(analog)}
                >
                  <td className={styles["catalog-analogs__td"]}>
                    <span className={styles["catalog-analogs__article"]}>
                      {analog.articleNumber}
                    </span>
                  </td>
                  <td className={styles["catalog-analogs__td"]}>
                    <div className={styles["catalog-analogs__illustration"]}>
                      <Box size={24} strokeWidth={1.5} />
                    </div>
                  </td>
                  <td className={styles["catalog-analogs__td"]}>
                    <div className={styles["catalog-analogs__name-brand"]}>
                      <span className={styles["catalog-analogs__brand"]}>
                        {analog.brand}
                      </span>
                      <span className={styles["catalog-analogs__name"]}>
                        {analog.name}
                      </span>
                    </div>
                  </td>
                  <td className={styles["catalog-analogs__td"]}>
                    <span className={styles["catalog-analogs__description"]}>
                      {analog.description ? (
                        <>
                          <Info
                            size={14}
                            className={styles["catalog-analogs__description-icon"]}
                          />
                          {analog.description}
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogAnalogs;
