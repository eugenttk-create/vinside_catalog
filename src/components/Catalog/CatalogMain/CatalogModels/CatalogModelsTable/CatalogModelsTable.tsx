import shared from "../../../../../styles/common.module.css";
import CatalogModelsTableRow from "./CatalogModelsTableRow/CatalogModelsTableRow";
import CatalogModelsTableHead from "./CatalogModelsTableHead/CatalogModelsTableHead";
import { useModels } from "../../../../../hooks/models/useModels";
import { useTranslation } from "../../../../../hooks/translation/useTranslation";
import { useParameters } from "../../../../../hooks/parameters/useParameters";
import { useBreadcrumbs } from "../../../../../hooks/breadcrumbs/useBreadcrumbs";
import { resolveImageSrc } from "../../../../../utils/resolveImgSrc";
import TableImage from "../../../../TableImage/TableImage";
import type { Model } from "../../../../../store/models/models.types";
import { orderCatalogFields } from "../../../../../utils/orderCatalogFields";

type ModelDescription = {
  model_type?: string | null;
  year_from?: string | null;
  year_to?: string | null;
  series?: string | null;
  code?: string | null;
  sales_term?: string | null;
  sales_type?: string | null;
  production?: string | null;
  type?: string | null;
} | null;

interface CatalogModelsTableProps {
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const COLUMN_KEYS = [
  "model_type",
  "production_period",
  "series",
  "code",
  "sales_term",
  "sales_type",
  "catalog",
  "production",
  "type",
] as const;

type ColumnKey = (typeof COLUMN_KEYS)[number];

const CatalogModelsTable: React.FC<CatalogModelsTableProps> = ({
  setModelId,
}) => {
  const { models, catalogId } = useModels();
  const { t } = useTranslation();
  const { getParameters } = useParameters();
  const { handleAddBreadcrumb } = useBreadcrumbs();

  const handleRowClick = (modelId: string, name: string) => {
    getParameters(catalogId, modelId, null);
    setModelId(modelId);
    handleAddBreadcrumb("model", name, modelId);
  };

  const columnLabels: Record<ColumnKey, string> = {
    model_type: t.widget_model_type,
    production_period: t.widget_production_period,
    series: t.widget_series,
    code: t.widget_code,
    sales_term: t.widget_sales_term,
    sales_type: t.widget_sales_type,
    catalog: t.widget_catalog,
    production: t.widget_production_period,
    type: t.widget_model_type,
  };

  const activeColumns = COLUMN_KEYS.filter((key) =>
    models.some((model) => {
      if (!model.description) return false;
      if (key === "production_period") {
        return model.description.year_from || model.description.year_to;
      }
      return !!model.description[key as keyof typeof model.description];
    }),
  );
  const columns = orderCatalogFields(
    ["image", "title", ...activeColumns] as const,
    (key) => key,
  );

  const getProductionPeriod = (desc: ModelDescription) => {
    if (!desc) return null;
    if (desc.year_from && desc.year_to)
      return `${desc.year_from} — ${desc.year_to}`;
    if (desc.year_from) return desc.year_from;
    if (desc.year_to) return desc.year_to;
    return null;
  };

  const getCellValue = (model: Model, key: ColumnKey): string | null => {
    if (!model.description) return null;
    if (key === "production_period")
      return getProductionPeriod(model.description);
    return model.description[key as keyof typeof model.description] ?? null;
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
                  <CatalogModelsTableHead
                    key={key}
                    title={key === "title" ? t.widget_name : columnLabels[key]}
                  />
                ),
              )}
            </tr>
          </thead>
          <tbody className={shared["table-body"]}>
            {models.map((model) => (
              <tr
                key={model.id}
                className={shared["table-row"]}
                onClick={() => handleRowClick(model.id, model.name)}
              >
                {columns.map((key) => {
                  if (key === "image") {
                    return (
                      <td
                        key={key}
                        className={`${shared["table-data"]} ${shared["table-image-cell"]}`}
                      >
                        <TableImage
                          src={resolveImageSrc(model.img)}
                          alt={`model-${model.id}`}
                        />
                      </td>
                    );
                  }
                  if (key === "title") {
                    return (
                      <td key={key} className={shared["table-data"]}>
                        <span className={shared["table-data-text"]}>
                          {model.name}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <CatalogModelsTableRow
                      key={key}
                      text={getCellValue(model, key) ?? "—"}
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

export default CatalogModelsTable;
