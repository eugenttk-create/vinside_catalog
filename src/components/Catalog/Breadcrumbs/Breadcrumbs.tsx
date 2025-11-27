import "./Breadcrumbs.css";
import { ChevronRight } from "lucide-react";
import { useParameters } from "../../../hooks/parameters/useParameters";

const Breadcrumbs: React.FC = () => {
  const { parameters } = useParameters();

  return (
    <ul className="breadcrumbs">
      {" "}
      <li className="breadcrumbs__el">
        Models{" "}
        {parameters.length > 0 && (
          <ChevronRight className="icon breadcrumbs__chevron" />
        )}
      </li>
      {parameters &&
        parameters.map((el, index) => {
          return (
            <li className="breadcrumbs__el" key={el.key}>
              {el.name}{" "}
              {index !== parameters.length - 1 && (
                <ChevronRight className="icon breadcrumbs__chevron" />
              )}{" "}
            </li>
          );
        })}
    </ul>
  );
};

export default Breadcrumbs;
