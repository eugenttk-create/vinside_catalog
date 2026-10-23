import shared from "../../../styles/common.module.css";
import styles from "./Breadcrumbs.module.css";
import { ChevronRight } from "lucide-react";
import { useBreadcrumbs } from "../../../hooks/breadcrumbs/useBreadcrumbs";
import { useModels } from "../../../hooks/models/useModels";
import { useRef, useEffect } from "react";
import { useTranslation } from "../../../hooks/translation/useTranslation";
import { emptyRoute } from "../../../navigation/catalogRoute";
import {
  navigateToCatalogBreadcrumb,
  navigateToCatalogRoute,
} from "../../../navigation/catalogNavigation";

interface BreadcrumbsProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLUListElement>(null);
  const { breadcrumbs, currentIndex } = useBreadcrumbs();
  const { selectedBrand } = useModels();

  const handleBrandsClick = () => {
    void navigateToCatalogRoute(emptyRoute(true));
  };

  const handleModelClick = () => {
    void navigateToCatalogBreadcrumb(-1);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === currentIndex) return;
    void navigateToCatalogBreadcrumb(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add(shared["dragging"]);
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove(shared["dragging"]);
    };
    const onMouseUp = () => {
      isDown = false;
      el.classList.remove(shared["dragging"]);
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
    <div className={shared["breadcrumbs-wrapper"]}>
      <ul className={styles["breadcrumbs"]} ref={scrollRef}>
        <li
          className={styles["breadcrumbs__el"]}
          onClick={handleBrandsClick}
          title="Brands"
        >
          <span className={styles["breadcrumbs__el-text"]}>
            {t.widget_brands_breadcrumb}
          </span>
          {selectedBrand && (
            <ChevronRight className={`${shared["icon"]} ${styles["breadcrumbs__chevron"]}`} />
          )}
        </li>
        <li
          className={styles["breadcrumbs__el"]}
          onClick={handleModelClick}
          title={selectedBrand}
        >
          <span className={styles["breadcrumbs__el-text"]}>{selectedBrand}</span>
          {breadcrumbs.length > 0 && (
            <ChevronRight className={`${shared["icon"]} ${styles["breadcrumbs__chevron"]}`} />
          )}
        </li>
        {breadcrumbs.map((el, index) => (
          <li
            className={`${styles["breadcrumbs__el"]}${index === currentIndex ? ` ${styles["breadcrumbs__el_active"]}` : ""}`}
            key={`${index}-${el.name}`}
            onClick={() => handleBreadcrumbClick(index)}
            title={el.name}
          >
            <span className={styles["breadcrumbs__el-text"]}>{el.name}</span>
            {index !== breadcrumbs.length - 1 && (
              <ChevronRight className={`${shared["icon"]} ${styles["breadcrumbs__chevron"]}`} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
