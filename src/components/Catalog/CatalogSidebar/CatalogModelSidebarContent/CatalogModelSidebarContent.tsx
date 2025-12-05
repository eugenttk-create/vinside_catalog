import { useCatalogs } from "../../../../hooks/catalogs/useCatalogs";
import { useModels } from "../../../../hooks/models/useModels";
import { useParameters } from "../../../../hooks/parameters/useParameters";
import { useBreadcrumbs } from "../../../../hooks/breadcrumbs/useBreadcrumbs";

interface CatalogModelSidebarContentProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogModelSidebarContent: React.FC<CatalogModelSidebarContentProps> = ({
  modelId,
  setModelId,
}) => {
  const { catalogs } = useCatalogs();
  const { models, handleSetSelectedBrand, getModels, catalogId } = useModels();
  const { parameters, handleResetParameters, getParameters, handleResetCarId } =
    useParameters();
  const { handleResetBreadcrumbs, handleAddBreadcrumb } = useBreadcrumbs();

  return (
    <ul className="sidebar__selects">
      {catalogs && catalogs.length > 0 && (
        <li className="sidebar__select-container">
          <span className="sidebar__select-title title">Brand</span>
          <select
            className="sidebar__select input"
            onChange={(e) => {
              const id = e.target.value;
              handleSetSelectedBrand(
                catalogs.find((c) => c.id === id)?.name || ""
              );
              getModels(id);
              handleResetBreadcrumbs();
              handleResetParameters();
              setModelId("");
            }}
          >
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
          <span className="sidebar__select-title title">Model</span>
          <select
            className="sidebar__select input"
            onChange={(e) => {
              const id = e.target.value;
              handleResetBreadcrumbs();
              handleResetParameters();
              handleAddBreadcrumb(
                "model",
                models.find((m) => m.id === id)?.name || "",
                id
              );
              handleResetCarId();
              getParameters(catalogId, id, null, []);
            }}
          >
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
          {parameters.map((parameter) => {
            return (
              <li className="sidebar__select-container" key={parameter.key}>
                <span className="sidebar__select-title title">
                  {parameter.name}
                </span>
                <select
                  name="sidebar-select"
                  id="sidebar-select"
                  className="sidebar__select input"
                  onChange={(e) => {
                    const idx = e.target.value;
                    getParameters(catalogId, modelId, idx);
                    handleAddBreadcrumb(
                      "parameter",
                      parameter.values.find((v) => v.idx === idx)?.value || "",
                      idx
                    );
                  }}
                >
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
