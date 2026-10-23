import shared from "../../../../../styles/common.module.css";
import CatalogParametersTableRow from "./CatalogParametersTableRow/CatalogParametersTableRow";
import CatalogParametersTableHead from "./CatalogParametersTableHead/CatalogParametersTableHead";
import { resolveImageSrc } from "../../../../../utils/resolveImgSrc";
import TableImage from "../../../../TableImage/TableImage";
import { useTranslation } from "../../../../../hooks/translation/useTranslation";
import { orderCatalogFields } from "../../../../../utils/orderCatalogFields";

type ParameterDescription = {
  model_type?: string | null;
  year_from?: string | null;
  year_to?: string | null;
  series?: string | null;
  code?: string | null;
  sales_term?: string | null;
  sales_type?: string | null;
  catalog?: string | null;
  cabin?: string | null;
  engine?: string | null;
  pet?: string | null;
  pat?: string | null;
  prefix?: string | null;
  gearbox?: string | null;
  steering?: string | null;
  suspension?: string | null;
  wheel_base?: string | null;
  pic?: string | null;
} | null;

type ParameterValue = {
  idx: string;
  value: string;
  img?: string;
  description: ParameterDescription;
};

const PARAM_COLUMN_KEYS = [
  "production_period",
  "code",
  "sales_term",
  "sales_type",
  "catalog",
  "cabin",
  "engine",
  "pet",
  "pat",
  "prefix",
  "gearbox",
  "steering",
  "suspension",
  "wheel_base",
  "pic",
] as const;

type ParamColumnKey = (typeof PARAM_COLUMN_KEYS)[number];

interface CatalogParametersTableProps {
  values: ParameterValue[];
  modelId: string;
  onClick: (idx: string, name: string) => void;
}

const CatalogParametersTable: React.FC<CatalogParametersTableProps> = ({
  values,
  onClick,
}) => {
  const { t } = useTranslation();

  const columnLabels: Record<ParamColumnKey, string> = {
    production_period: t.widget_production_period,
    code: t.widget_code,
    sales_term: t.widget_sales_term,
    sales_type: t.widget_sales_type,
    catalog: t.widget_catalog,
    cabin: t.widget_cabin,
    engine: t.widget_engine,
    gearbox: t.widget_gearbox,
    steering: t.widget_steering,
    suspension: t.widget_suspension,
    wheel_base: t.widget_wheel_base,
    pet: t.widget_pet,
    pat: t.widget_pat,
    prefix: t.widget_prefix,
    pic: t.widget_pic,
  };

  const activeColumns = PARAM_COLUMN_KEYS.filter((key) =>
    values.some((val) => {
      if (!val.description) return false;
      if (key === "production_period") {
        return val.description.year_from || val.description.year_to;
      }
      return !!val.description[key as keyof typeof val.description];
    }),
  );
  const columns = orderCatalogFields(
    ["image", "title", ...activeColumns] as const,
    (key) => key,
  );

  const getProductionPeriod = (desc?: ParameterDescription) => {
    if (!desc) return null;

    return desc.year_from && desc.year_to
      ? `${desc.year_from} — ${desc.year_to}`
      : desc.year_from
        ? desc.year_from
        : desc.year_to
          ? desc.year_to
          : null;
  };

  const getCellValue = (
    val: ParameterValue,
    key: ParamColumnKey,
  ): string | null => {
    if (!val.description) return null;
    if (key === "production_period")
      return getProductionPeriod(val.description);
    return val.description[key as keyof typeof val.description] ?? null;
  };

  return (
    <div className={shared["table-container"]}>
      <div className={shared["table-wrapper"]}>
        <table className={`${shared["table"]} ${shared["table_ordered"]}`}>
          <thead className={shared["table-header"]}>
            <tr className={shared["table-row"]}>
              {columns.map((key) =>
                key === "image" ? (
                  <th
                    key={key}
                    className={`${shared["table-header-el"]} ${shared["table-image-cell"]}`}
                  ></th>
                ) : (
                  <CatalogParametersTableHead
                    key={key}
                    title={key === "title" ? t.widget_name : columnLabels[key]}
                  />
                ),
              )}
            </tr>
          </thead>
          <tbody className={shared["table-body"]}>
            {values.map((val) => (
              <tr
                key={val.idx}
                className={shared["table-row"]}
                onClick={() => onClick(val.idx, val.value)}
                style={{ cursor: "pointer" }}
              >
                {columns.map((key) => {
                  if (key === "image") {
                    return (
                      <td
                        key={key}
                        className={`${shared["table-data"]} ${shared["table-image-cell"]}`}
                      >
                        <TableImage
                          src={resolveImageSrc(val.img)}
                          alt={`param-${val.idx}`}
                        />
                      </td>
                    );
                  }
                  if (key === "title") {
                    return (
                      <td key={key} className={shared["table-data"]}>
                        <span className={shared["table-data-text"]}>
                          {val.value}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <CatalogParametersTableRow
                      key={key}
                      text={getCellValue(val, key) ?? "—"}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogParametersTable;
