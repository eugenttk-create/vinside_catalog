import "./Breadcrumbs.css";
import { ChevronRight } from "lucide-react";

const Breadcrumbs: React.FC = () => {
  return (
    <ul className="breadcrumbs">
      <li className="breadcrumbs__el">
        Models <ChevronRight className="icon breadcrumbs__chevron" />{" "}
      </li>
      <li className="breadcrumbs__el">
        Year <ChevronRight className="icon breadcrumbs__chevron" />
      </li>
      <li className="breadcrumbs__el">Restriction 1</li>
    </ul>
  );
};

export default Breadcrumbs;
