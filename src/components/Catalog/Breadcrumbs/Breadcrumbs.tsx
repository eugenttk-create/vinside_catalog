import "./Breadcrumbs.css";
import { ChevronRight } from "lucide-react";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useModels } from "../../../hooks/models/useModels";
import { useParts } from "../../../hooks/parts/useParts";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useBreadcrumbs } from "../../../hooks/breadcrumbs/useBreadcrumbs";
import { fetchCarId } from "../../../store/parameters/parametersThunks";
import { useAppDispatch } from "../../../hooks/store/useAppDispatch";

interface BreadcrumbsProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ setModelId }) => {
  const dispatch = useAppDispatch();
  const { handleResetParameters, getParameters, handleResetCarId, carId } =
    useParameters();
  const { breadcrumbs, handleTrimBreadcrumbs, handleResetBreadcrumbs } =
    useBreadcrumbs();
  const {
    handleResetModels,
    catalogId,
    selectedBrand,
    handleSetSelectedBrand,
  } = useModels();
  const { handleResetParts } = useParts();
  const { handleResetGroups, getGroups } = useGroups();

  const handleBrandsClick = () => {
    handleResetBreadcrumbs();
    handleResetModels();
    handleResetParts();
    handleResetGroups();
    handleResetParameters();
    handleSetSelectedBrand("");
  };

  const handleModelClick = () => {
    handleResetBreadcrumbs();
    handleResetParts();
    handleResetGroups();
    handleResetParameters();
  };

  const handleBreadcrumbClick = async (index: number) => {
    if (index + 1 === breadcrumbs.length) {
      return;
    }

    const clicked = breadcrumbs[index];
    handleTrimBreadcrumbs(index);

    if (clicked.type === "model") {
      const modelId = clicked.id!;
      setModelId(modelId);
      handleResetParameters();
      handleResetGroups();
      handleResetParts();
      await getParameters(catalogId, modelId, null, []);
      return;
    }

    if (clicked.type === "parameter") {
      const leftSlice = breadcrumbs.slice(0, index + 1);

      const modelCrumb = leftSlice
        .slice()
        .reverse()
        .find((b) => b.type === "model");
      const modelId = modelCrumb?.id!;
      if (modelId) setModelId(modelId);

      handleResetGroups();
      handleResetParts();
      handleResetCarId();

      const selectedParams: string[] = leftSlice
        .filter((b) => b.type === "parameter")
        .map((b) => b.id as string);

      const allParams = breadcrumbs.filter((b) => b.type === "parameter");
      const clickedParamIndex = allParams.findIndex((b) => b.id === clicked.id);
      const isLastParameter = clickedParamIndex === allParams.length - 1;

      if (isLastParameter) {
        const carIdAction = await dispatch(
          fetchCarId({
            catalogId,
            modelId,
            parameters: selectedParams,
          })
        );
        if (fetchCarId.fulfilled.match(carIdAction)) {
          const actualCarId = carIdAction.payload;
          await getGroups(catalogId, actualCarId);
        }
      } else {
        await getParameters(catalogId, modelId, null, selectedParams);
      }

      return;
    }

    if (clicked.type === "group") {
      const groupId = clicked.id;
      handleResetParts();

      if (carId) {
        await getGroups(catalogId, carId, groupId);
      }
      return;
    }
  };

  return (
    <ul className="breadcrumbs">
      {" "}
      <li className="breadcrumbs__el" onClick={handleBrandsClick}>
        Brands{" "}
        {selectedBrand && (
          <ChevronRight className="icon breadcrumbs__chevron" />
        )}
      </li>
      <li className="breadcrumbs__el" onClick={handleModelClick}>
        {selectedBrand}{" "}
        {breadcrumbs.length > 0 && (
          <ChevronRight className="icon breadcrumbs__chevron" />
        )}
      </li>
      {breadcrumbs &&
        breadcrumbs.map((el, index) => {
          return (
            <li
              className="breadcrumbs__el"
              key={`${index}-${el.name}`}
              onClick={() => handleBreadcrumbClick(index)}
            >
              {el.name}{" "}
              {index !== breadcrumbs.length - 1 && (
                <ChevronRight className="icon breadcrumbs__chevron" />
              )}{" "}
            </li>
          );
        })}
    </ul>
  );
};

export default Breadcrumbs;
