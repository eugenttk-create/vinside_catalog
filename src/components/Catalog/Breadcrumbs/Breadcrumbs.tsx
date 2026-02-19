import "./Breadcrumbs.css";
import { ChevronRight } from "lucide-react";
import { useParameters } from "../../../hooks/parameters/useParameters";
import { useModels } from "../../../hooks/models/useModels";
import { useParts } from "../../../hooks/parts/useParts";
import { useGroups } from "../../../hooks/groups/useGroups";
import { useBreadcrumbs } from "../../../hooks/breadcrumbs/useBreadcrumbs";
import { fetchCarId } from "../../../store/parameters/parametersThunks";
import { useAppDispatch } from "../../../hooks/store/useAppDispatch";
import { useRef, useEffect } from "react";
import { useTranslation } from "../../../hooks/translation/useTranslation";

interface BreadcrumbsProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ setModelId }) => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
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
    handleSetIsVinSearch,
  } = useModels();
  const { handleResetParts } = useParts();
  const { handleResetGroups, getGroups, getGroupsByVin } = useGroups();

  const handleBrandsClick = () => {
    handleResetBreadcrumbs();
    handleResetModels();
    handleResetParts();
    handleResetGroups();
    handleResetParameters();
    handleSetSelectedBrand("");
    handleSetIsVinSearch(false);
    setModelId("");
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

    if (clicked.type === "vin") {
      handleTrimBreadcrumbs(index);

      handleResetModels();
      handleResetParameters();
      handleResetParts();
      handleResetGroups();
      handleSetIsVinSearch(true);

      if (clicked.id) {
        await getGroupsByVin(clicked.id);
      }

      return;
    }

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

  useEffect(() => {
    const el: any = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add("dragging");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = (_e: MouseEvent) => {
      isDown = false;
      el.classList.remove("dragging");
    };

    const onMouseUp = (_e: MouseEvent) => {
      isDown = false;
      el.classList.remove("dragging");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <ul className="breadcrumbs" ref={scrollRef}>
      {" "}
      <li
        className="breadcrumbs__el"
        onClick={handleBrandsClick}
        title="Brands"
      >
        <span className="breadcrumbs__el-text">
          {t.widget_brands_breadcrumb}
        </span>{" "}
        {selectedBrand && (
          <ChevronRight className="icon breadcrumbs__chevron" />
        )}
      </li>
      <li
        className="breadcrumbs__el"
        onClick={handleModelClick}
        title={selectedBrand}
      >
        <span className="breadcrumbs__el-text">{selectedBrand}</span>{" "}
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
              title={el.name}
            >
              <span className="breadcrumbs__el-text">{el.name}</span>
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
