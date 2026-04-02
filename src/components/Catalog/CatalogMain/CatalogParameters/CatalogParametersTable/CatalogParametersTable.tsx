import "./CatalogParametersTable.css";
import CatalogParametersTableRow from "./CatalogParametersTableRow/CatalogParametersTableRow";
import CatalogParametersTableHead from "./CatalogParametersTableHead/CatalogParametersTableHead";
import { resolveImageSrc } from "../../../../../utils/resolveImgSrc";
import TableImage from "../../../../TableImage/TableImage";
import { useTranslation } from "../../../../../hooks/translation/useTranslation";

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
} | null;

type ParameterValue = {
  idx: string;
  value: string;
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
  };

  const activeColumns = PARAM_COLUMN_KEYS.filter((key) =>
    values.some((val) => {
      if (!val.description) return false;
      if (key === "production_period") {
        return val.description.year_from || val.description.year_to;
      }
      return !!val.description[key as keyof typeof val.description];
    })
  );

  const getProductionPeriod = (desc: ParameterDescription) => {
    if (!desc) return null;
    if (desc.year_from && desc.year_to)
      return `${desc.year_from} — ${desc.year_to}`;
    if (desc.year_from) return desc.year_from;
    if (desc.year_to) return desc.year_to;
    return null;
  };

  const getCellValue = (
    val: ParameterValue,
    key: ParamColumnKey
  ): string | null => {
    if (!val.description) return null;
    if (key === "production_period")
      return getProductionPeriod(val.description);
    return val.description[key as keyof typeof val.description] ?? null;
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table">
          <thead className="table-header">
            <tr className="table-row">
              <th className="table-header-el"></th>
              <th className="table-header-el">{t.widget_name}</th>
              {activeColumns.map((key) => (
                <CatalogParametersTableHead
                  key={key}
                  title={columnLabels[key]}
                />
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {values.map((val) => (
              <tr
                key={val.idx}
                className="table-row"
                onClick={() => onClick(val.idx, val.value)}
                style={{ cursor: "pointer" }}
              >
                <td className="table-data">
                  <TableImage
                    src={resolveImageSrc("")}
                    alt={`param-${val.idx}`}
                  />
                </td>
                <td className="table-data">
                  <span className="table-data-text">{val.value}</span>
                </td>
                {activeColumns.map((key) => (
                  <CatalogParametersTableRow
                    key={key}
                    text={getCellValue(val, key) ?? "—"}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogParametersTable;
