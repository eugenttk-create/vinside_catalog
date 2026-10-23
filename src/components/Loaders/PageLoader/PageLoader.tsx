import styles from "./PageLoader.module.css";
import DefaultLoader from "../DefaultLoader/DefaultLoader";
import { useLockBodyScroll } from "../../../hooks/UI/useLockBodyScroll";

const PageLoader = () => {
  useLockBodyScroll(true);

  return (
    <div className={styles["page-loader"]}>
      <DefaultLoader />
    </div>
  );
};

export default PageLoader;
