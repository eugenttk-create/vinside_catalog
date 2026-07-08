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
import { useOE } from "../../../hooks/OE/useOE";

interface BreadcrumbsProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ setModelId }) => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const dispatch = useAppDispatch();
  const {
    handleResetParameters,
    getParameters,
    handleResetCarId,
    carId,
    handleSetCarId,
  } = useParameters();
  const {
    breadcrumbs,
    currentIndex,
    handleTrimBreadcrumbs,
    handleResetBreadcrumbs,
    handleNavigateToBreadcrumb,
  } = useBreadcrumbs();
  const {
    handleResetModels,
    catalogId,
    selectedBrand,
    handleSetSelectedBrand,
    handleSetIsVinSearch,
  } = useModels();
  const { handleResetParts } = useParts();
  const { getOE, getOEGroups, handleResetOE, setIsOESearch } = useOE();
  const {
    handleResetGroups,
    getGroups,
    getGroupsByVin,
    vinInfo,
    aiSearchQuery,
    searchGroups,
    // isOESearch,
  } = useGroups();

  const handleBrandsClick = () => {
    handleResetBreadcrumbs();
    handleResetModels();
    handleResetParts();
    handleResetGroups();
    handleResetParameters();
    handleResetOE();
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

  const handleBreadcrumbClick = async (index: number, isNavigation = false) => {
    if (!isNavigation && index + 1 === breadcrumbs.length) {
      return;
    }
    if (isNavigation && index === currentIndex) {
      return;
    }

    const clicked = breadcrumbs[index];

    if (!isNavigation) {
      handleTrimBreadcrumbs(index);
    } else {
      handleNavigateToBreadcrumb(index);
    }

    if (clicked.type === "vin") {
      if (!isNavigation) handleTrimBreadcrumbs(index);

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
      const mId = clicked.id!;
      setModelId(mId);
      handleResetParameters();
      handleResetGroups();
      handleResetParts();
      await getParameters(catalogId, mId, null, []);
      return;
    }

    if (clicked.type === "parameter") {
      const leftSlice = breadcrumbs.slice(0, index + 1);

      const modelCrumb = leftSlice
        .slice()
        .reverse()
        .find((b) => b.type === "model");
      const mId = modelCrumb?.id!;
      if (mId) setModelId(mId);

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
          fetchCarId({ catalogId, modelId: mId, parameters: selectedParams })
        );
        if (fetchCarId.fulfilled.match(carIdAction)) {
          const actualCarId = carIdAction.payload;
          await getGroups(catalogId, actualCarId);
        }
      } else {
        await getParameters(catalogId, mId, null, selectedParams);
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

    if (clicked.type === "oe-group") {
      handleResetParts();
      handleResetGroups();
      setIsOESearch(true);

      if (clicked.id) {
        handleSetCarId(clicked.id);
        await getOEGroups(clicked.id);
      }
      return;
    }

    if (clicked.type === "search") {
      handleResetParts();
      if (vinInfo?.carId) {
        await searchGroups(catalogId, vinInfo.carId, aiSearchQuery);
      }
      return;
    }

    if (clicked.type === "oe") {
      handleResetModels();
      handleResetParameters();
      handleResetParts();
      handleResetGroups();
      handleResetCarId();
      setIsOESearch(true);

      if (clicked.id) {
        await getOE(clicked.id);
      }
      return;
    }

    if (clicked.type === "parts-search") {
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
    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove("dragging");
    };
    const onMouseUp = () => {
      isDown = false;
      el.classList.remove("dragging");
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
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
    <div className="breadcrumbs-wrapper">
      <ul className="breadcrumbs" ref={scrollRef}>
        <li
          className="breadcrumbs__el"
          onClick={handleBrandsClick}
          title="Brands"
        >
          <span className="breadcrumbs__el-text">
            {t.widget_brands_breadcrumb}
          </span>
          {selectedBrand && (
            <ChevronRight className="icon breadcrumbs__chevron" />
          )}
        </li>
        <li
          className="breadcrumbs__el"
          onClick={handleModelClick}
          title={selectedBrand}
        >
          <span className="breadcrumbs__el-text">{selectedBrand}</span>
          {breadcrumbs.length > 0 && (
            <ChevronRight className="icon breadcrumbs__chevron" />
          )}
        </li>
        {breadcrumbs.map((el, index) => (
          <li
            className={`breadcrumbs__el${
              index === currentIndex ? " breadcrumbs__el_active" : ""
            }`}
            key={`${index}-${el.name}`}
            onClick={() => handleBreadcrumbClick(index)}
            title={el.name}
          >
            <span className="breadcrumbs__el-text">{el.name}</span>
            {index !== breadcrumbs.length - 1 && (
              <ChevronRight className="icon breadcrumbs__chevron" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
