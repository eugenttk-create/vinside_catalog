import "./PageLoader.css";
import DefaultLoader from "../DefaultLoader/DefaultLoader";
import { useEffect } from "react";

const PageLoader = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <div className="page-loader">
      <DefaultLoader />
    </div>
  );
};

export default PageLoader;
