import styles from "./CatalogAnalogDetail.module.css";
import { useEffect, useState } from "react";
import { useAnalogs } from "../../../../hooks/analogs/useAnalogs";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import { useTranslation } from "../../../../hooks/translation/useTranslation";
import PageLoader from "../../../Loaders/PageLoader/PageLoader";
import { ChevronLeft, Box } from "lucide-react";

const CatalogAnalogDetail: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedAnalog,
    analogInfo,
    analogInfoLoading,
    applicability,
    applicabilityLoading,
    selectedBrandId,
    getApplicability,
    handleSetSelectedBrandId,
    handleClearAnalogDetail,
  } = useAnalogs();
  const { handleTrimBreadcrumbs, breadcrumbs } = useBreadcrumbs();
  const [activeTab, setActiveTab] = useState<"oe" | "applicability">("oe");

  useEffect(() => {
    if (
      analogInfo?.articleId &&
      selectedBrandId != null &&
      activeTab === "applicability"
    ) {
      getApplicability(analogInfo.articleId, selectedBrandId);
    }
  }, [analogInfo?.articleId, selectedBrandId, activeTab, getApplicability]);

  const handleBack = () => {
    handleClearAnalogDetail();
    const detailIndex = breadcrumbs.findIndex((b) => b.type === "analog-detail");
    if (detailIndex > 0) {
      handleTrimBreadcrumbs(detailIndex - 1);
    } else if (detailIndex === 0) {
      handleTrimBreadcrumbs(-1);
    }
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = Number(e.target.value);
    handleSetSelectedBrandId(brandId);
  };

  if (analogInfoLoading && !analogInfo) {
    return <PageLoader />;
  }

  const title =
    analogInfo?.name ||
    selectedAnalog?.name ||
    `${selectedAnalog?.brand ?? ""} ${selectedAnalog?.articleNumber ?? ""}`;

  return (
    <div className={styles["analog-detail"]}>
      <div className={styles["analog-detail__header"]}>
        <button
          type="button"
          className={styles["analog-detail__back"]}
          onClick={handleBack}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className={styles["analog-detail__title"]}>{title}</h1>
      </div>

      <div className={styles["analog-detail__content"]}>
        <div className={styles["analog-detail__gallery"]}>
          <div className={styles["analog-detail__main-image"]}>
            <div className={styles["analog-detail__main-image-placeholder"]}>
              <Box size={64} strokeWidth={1} />
            </div>
          </div>
          <div className={styles["analog-detail__thumbs"]}>
            <div className={`${styles["analog-detail__thumb"]} ${styles["analog-detail__thumb_active"]}`}>
              <Box size={28} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className={styles["analog-detail__info"]}>
          <div className={styles["analog-detail__manufacturer-label"]}>
            {t.widget_manufacturer ?? "Производитель"}:
          </div>
          <div className={styles["analog-detail__manufacturer"]}>
            {analogInfo?.brand || selectedAnalog?.brand}
          </div>

          <div className={styles["analog-detail__article-label"]}>
            {t.widget_article ?? "Артикул"}:
          </div>
          <div className={styles["analog-detail__article"]}>
            {analogInfo?.articleNumber || selectedAnalog?.articleNumber}
          </div>

          <button type="button" className={styles["analog-detail__suppliers-btn"]}>
            {t.widget_suppliers ?? "Поставщики"}
          </button>

          {analogInfo && (
            <div className={styles["analog-detail__specs"]}>
              {analogInfo.code && (
                <div>
                  <div className={styles["analog-detail__spec-label"]}>
                    {t.widget_code ?? "Код"}
                  </div>
                  <div className={styles["analog-detail__spec-value"]}>
                    {analogInfo.code}
                  </div>
                </div>
              )}
              {analogInfo.quantityPerPackage != null && (
                <div>
                  <div className={styles["analog-detail__spec-label"]}>
                    {t.widget_qty_per_package ?? "Количество в упаковке"}
                  </div>
                  <div className={styles["analog-detail__spec-value"]}>
                    {analogInfo.quantityPerPackage}
                  </div>
                </div>
              )}
              {analogInfo.replacesArticles && (
                <div>
                  <div className={styles["analog-detail__spec-label"]}>
                    {t.widget_replaces ?? "Заменяет"}
                  </div>
                  <div className={styles["analog-detail__spec-value"]}>
                    {analogInfo.replacesArticles}
                  </div>
                </div>
              )}
              {analogInfo.info && (
                <div>
                  <div className={styles["analog-detail__spec-label"]}>
                    {t.widget_info ?? "Информация"}
                  </div>
                  <div className={styles["analog-detail__spec-value"]}>
                    {analogInfo.info}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles["analog-detail__tabs"]}>
        <div className={styles["analog-detail__tabs-header"]}>
          <button
            type="button"
            className={`${styles["analog-detail__tab"]} ${activeTab === "oe" ? styles["analog-detail__tab_active"] : ""}`}
            onClick={() => setActiveTab("oe")}
          >
            {t.widget_oe_number ?? "OE Номер"}
          </button>
          <button
            type="button"
            className={`${styles["analog-detail__tab"]} ${activeTab === "applicability" ? styles["analog-detail__tab_active"] : ""}`}
            onClick={() => setActiveTab("applicability")}
          >
            {t.widget_applicability ?? "Применяемость"}
          </button>
        </div>

        <div className={styles["analog-detail__tabs-body"]}>
          {activeTab === "oe" && (
            <>
              {analogInfo?.brands && analogInfo.brands.length > 0 ? (
                <table className={styles["analog-detail__oe-table"]}>
                  <thead>
                    <tr>
                      <th>{t.widget_oe_oem_number ?? "OE [OEM] Номер"}</th>
                      <th>{t.widget_manufacturers ?? "Производители"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analogInfo.brands.map((b) => (
                      <tr key={b.id}>
                        <td>{analogInfo.articleNumber}</td>
                        <td>{b.brand}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles["analog-detail__empty"]}>
                  {t.widget_no_data ?? "Нет данных"}
                </div>
              )}
            </>
          )}

          {activeTab === "applicability" && (
            <>
              {analogInfo?.brands && analogInfo.brands.length > 0 && (
                <div className={styles["analog-detail__brand-select"]}>
                  <select
                    value={selectedBrandId ?? ""}
                    onChange={handleBrandChange}
                  >
                    {analogInfo.brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {applicabilityLoading ? (
                <PageLoader />
              ) : applicability.length > 0 ? (
                <table className={styles["analog-detail__appl-table"]}>
                  <thead>
                    <tr>
                      <th>{t.widget_model_label ?? "Модель"}</th>
                      <th>{t.widget_engine ?? "Двигатель"}</th>
                      <th>{t.widget_fuel_type ?? "Топливо"}</th>
                      <th>{t.widget_power ?? "Мощность"}</th>
                      <th>{t.widget_capacity ?? "Объём"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicability.map((item) => (
                      <tr key={`${item.carId}-${item.engine}`}>
                        <td>{item.model}</td>
                        <td>{item.engine}</td>
                        <td>{item.fuelType}</td>
                        <td>
                          {item.powerHp} {t.widget_hp ?? "л.с."} / {item.powerKw}{" "}
                          {t.widget_kw ?? "кВт"}
                        </td>
                        <td>{item.cylinderCapacity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles["analog-detail__empty"]}>
                  {t.widget_no_data ?? "Нет данных"}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogAnalogDetail;
