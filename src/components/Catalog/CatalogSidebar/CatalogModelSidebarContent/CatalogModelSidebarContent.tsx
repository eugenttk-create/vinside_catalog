import { useCatalogs } from "../../../../hooks/catalogs/useCatalogs";
import { useModels } from "../../../../hooks/models/useModels";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";
import { useTranslation } from "../../../../hooks/translation/useTranslation";

interface CatalogModelSidebarContentProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogModelSidebarContent: React.FC<CatalogModelSidebarContentProps> = ({
  modelId,
  setModelId,
}) => {
  const { t } = useTranslation();
  const { catalogs } = useCatalogs();
  const { models, handleSetSelectedBrand, getModels, catalogId, setCatalogId } =
    useModels();
  const {
    parameters,
    selectedParameters,
    handleResetParameters,
    getParameters,
    handleResetCarId,
  } = useParameters();
  const { handleResetBreadcrumbs, handleAddBreadcrumb } = useBreadcrumbs();

  return (
    <ul className="sidebar__selects">
      {catalogs && catalogs.length > 0 && (
        <li className="sidebar__select-container">
          <span className="sidebar__select-title title">
            {t.widget_brand_label}
          </span>
          <select
            className="sidebar__select input"
            id="sidebar-select-brand"
            onChange={(e) => {
              if (!e.target.value) return;
              const id = e.target.value;
              setCatalogId(catalogs.find((c) => c.id === id)?.id || "");
              handleSetSelectedBrand(
                catalogs.find((c) => c.id === id)?.name || ""
              );
              getModels(id);
              handleResetBreadcrumbs();
              handleResetParameters();
              setModelId("");
            }}
            value={catalogId || ""}
          >
            {" "}
            <option value="">{t.widget_brand_select_placeholder}</option>
            {catalogs.map((catalog) => {
              return (
                <option value={catalog.id} key={catalog.id}>
                  {catalog.name}
                </option>
              );
            })}
          </select>
        </li>
      )}
      {models && models.length > 0 && (
        <li className="sidebar__select-container">
          <span className="sidebar__select-title title">
            {t.widget_model_label}
          </span>
          <select
            className="sidebar__select input"
            id="sidebar-select-model"
            onChange={(e) => {
              if (!e.target.value) return;
              const id = e.target.value;
              handleResetBreadcrumbs();
              handleResetParameters();
              handleAddBreadcrumb(
                "model",
                models.find((m) => m.id === id)?.name || "",
                id
              );
              handleResetCarId();
              setModelId(id);
              getParameters(catalogId, id, null, []);
            }}
            value={modelId}
          >
            <option value="">{t.widget_model_select_placeholder}</option>
            {models.map((model) => {
              return (
                <option value={model.id} key={model.id}>
                  {model.name}
                </option>
              );
            })}
          </select>
        </li>
      )}
      {parameters && parameters[0]?.values.length > 0 && (
        <>
          {parameters.map((parameter, index) => {
            return (
              <li className="sidebar__select-container" key={parameter.key}>
                <span className="sidebar__select-title title">
                  {parameter.name}
                </span>
                <select
                  name="sidebar-select"
                  id={`sidebar-select-parameter-${parameter.key}`}
                  className="sidebar__select input"
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const idx = e.target.value;
                    getParameters(catalogId, modelId, idx);
                    handleAddBreadcrumb(
                      "parameter",
                      parameter.values.find((v) => v.idx === idx)?.value || "",
                      idx
                    );
                  }}
                  value={selectedParameters[index]}
                >
                  <option value="">
                    {t.widget_parameter_select_placeholder}
                  </option>
                  {parameter.values.map((value) => {
                    return (
                      <option value={value.idx} key={value.idx}>
                        {value.value}
                      </option>
                    );
                  })}
                </select>
              </li>
            );
          })}
        </>
      )}
    </ul>
  );
};

export default CatalogModelSidebarContent;
