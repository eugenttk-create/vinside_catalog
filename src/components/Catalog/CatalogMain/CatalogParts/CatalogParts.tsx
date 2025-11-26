import "./CatalogParts.css";
import { Copy } from "lucide-react";
import { useParts } from "../../../../hooks/parts/useParts";

const IMAGE_URL = import.meta.env.VITE_API_IMG_BASE;

const CatalogParts: React.FC = () => {
  const { parts } = useParts();

  return (
    <div className="catalog-parts">
      <div className="catalog-parts__img-container">
        <img
          src={`${IMAGE_URL}${parts.img}`}
          alt="parts"
          className="catalog-parts__image"
          loading="lazy"
        />
      </div>
      <div className="catalog-parts__table-wrapper">
        <table className="catalog-parts__table">
          <tbody className="catalog-parts__tbody">
            {parts &&
              parts.partGroups[0].parts.map((part) => {
                return (
                  <tr className="catalog-parts__tr" key={part.id}>
                    <td className="catalog-parts__td">
                      <span className="catalog-parts__ts">
                        {part.positionNumber}
                      </span>
                    </td>
                    <td className="catalog-parts__td">
                      <span className="catalog-parts__ts">
                        {part.number}{" "}
                        <Copy className="icon catalog-parts__table-icon" />
                      </span>
                    </td>
                    <td className="catalog-parts__td">
                      <span className="catalog-parts__ts">{part.name}</span>
                    </td>
                    <td className="catalog-parts__td">
                      <span className="catalog-parts__ts">
                        <button className="catalog-parts__tb button">
                          Аналоги
                        </button>
                      </span>
                    </td>
                    <td className="catalog-parts__td">
                      <span className="catalog-parts__ts">
                        <button className="catalog-parts__tb button">
                          Zobacz cenę
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogParts;
