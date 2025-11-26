import CatalogMain from "./CatalogMain/CatalogMain";
import CatalogHeader from "./CatalogHeader/CatalogHeader";
import CatalogSidebar from "./CatalogSidebar/CatalogSidebar";
import "./Catalog.css";

interface CatalogProps {
  catalogId: string;
}

const Catalog: React.FC<CatalogProps> = ({ catalogId }) => {
  return (
    <section className="catalog">
      <CatalogHeader />
      <div className="catalog__container">
        <CatalogSidebar />
        <CatalogMain catalogId={catalogId} />
      </div>
    </section>
  );
};

export default Catalog;
