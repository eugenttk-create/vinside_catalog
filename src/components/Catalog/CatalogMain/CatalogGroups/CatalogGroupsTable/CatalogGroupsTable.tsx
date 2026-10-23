import shared from "../../../../../styles/common.module.css";
import CatalogGroupsTableHead from "./CatalogGroupsTableHead/CatalogGroupsTableHead";
import CatalogGroupsTableRow from "./CatalogGroupsTableRow/CatalogGroupsTableRow";
import { resolveImageSrc } from "../../../../../utils/resolveImgSrc";
import { useGroups } from "../../../../../hooks/groups/useGroups";
import { useTranslation } from "../../../../../hooks/translation/useTranslation";
import TruncatedCell from "../../../../TruncatedCell/TruncatedCell";
import TableImage from "../../../../TableImage/TableImage";
import { orderCatalogFields } from "../../../../../utils/orderCatalogFields";

const GROUP_COLUMN_KEYS = [
  "subgroup",
  "code",
  "referenceNr",
  "illustration",
  "name",
  "from",
  "to",
  "from_year",
  "to_year",
  "year_from",
  "year_to",
  "pet",
  "pat",
  "mounting_time",
  "equipment",
  "description",
  "remark",
  "comment",
  "restriction",
  "modelDescription",
  "changePoint",
] as const;

type GroupColumnKey = (typeof GROUP_COLUMN_KEYS)[number];

type GroupDescription = {
  illustration: string | null;
  name: string | null;
  description: string | null;
  restriction: string | null;
  from: string | null;
  to: string | null;
  comment: string | null;
  remark: string | null;
  modelDescription: string | null;
  referenceNr: string | null;
  pet: string | null;
  pat: string | null;
  from_year: string | null;
  to_year: string | null;
  year_from: string | null;
  year_to: string | null;
  changePoint: string | null;
  code: string | null;
  mounting_time: string | null;
  equipment: string | null;
  subgroup: string | null;
} | null;

type Group = {
  id: string;
  name: string;
  img?: string;
  hasSubgroups: boolean;
  description: GroupDescription;
};

interface CatalogGroupsTableProps {
  carId: string;
  onClick: (idx: string, name: string, hasSubgroup: boolean) => void;
}

const CatalogGroupsTable: React.FC<CatalogGroupsTableProps> = ({ onClick }) => {
  const { groupsFlat } = useGroups();
  const { t } = useTranslation();

  const columnLabels: Record<GroupColumnKey, string> = {
    subgroup: t.widget_subgroup,
    code: t.widget_code,
    referenceNr: t.widget_reference,
    illustration: t.widget_illustration,
    name: t.widget_name,
    from: t.widget_from,
    to: t.widget_to,
    from_year: t.widget_from,
    to_year: t.widget_to,
    year_from: t.widget_from,
    year_to: t.widget_to,
    pet: t.widget_pet,
    pat: t.widget_pat,
    mounting_time: t.widget_mounting_time,
    equipment: t.widget_equipment_2,
    description: t.widget_comment,
    remark: t.widget_remark,
    comment: t.widget_restriction,
    restriction: t.widget_restriction,
    modelDescription: t.widget_model_desc,
    changePoint: t.widget_change_point,
  };

  const activeColumns = GROUP_COLUMN_KEYS.filter((key) =>
    groupsFlat.some((group) => {
      if (!group.description) return false;
      return !!group.description[key as keyof typeof group.description];
    }),
  );
  const columns = orderCatalogFields(
    ["image", "title", ...activeColumns] as const,
    (key) => key,
  );

  const getCellValue = (group: Group, key: GroupColumnKey): string | null => {
    if (!group.description) return null;
    return group.description[key as keyof typeof group.description] ?? null;
  };

  return (
    <div className={shared["table-container"]}>
      <div className={shared["table-wrapper"]}>
        <table className={`${shared["table"]} ${shared["table_ordered"]}`}>
          <thead className={shared["table-header"]}>
            <tr className={shared["table-row"]}>
              {columns.map((key) =>
                key === "image" ? (
                  <th
                    key={key}
                    className={`${shared["table-header-el"]} ${shared["table-image-cell"]}`}
                  ></th>
                ) : (
                  <CatalogGroupsTableHead
                    key={key}
                    title={key === "title" ? t.widget_name : columnLabels[key]}
                  />
                ),
              )}
            </tr>
          </thead>
          <tbody className={shared["table-body"]}>
            {groupsFlat.map((group) => (
              <tr
                key={group.id}
                className={shared["table-row"]}
                onClick={() =>
                  onClick(group.id, group.name, group.hasSubgroups)
                }
                style={{ cursor: "pointer" }}
              >
                {columns.map((key) => {
                  if (key === "image") {
                    return (
                      <td
                        key={key}
                        className={`${shared["table-data"]} ${shared["table-image-cell"]}`}
                      >
                        <TableImage
                          src={resolveImageSrc(group.img)}
                          alt={`group-${group.id}`}
                        />
                      </td>
                    );
                  }
                  if (key === "title") {
                    return <TruncatedCell key={key} text={group.name} />;
                  }
                  return (
                    <CatalogGroupsTableRow
                      key={key}
                      text={getCellValue(group, key) ?? "—"}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogGroupsTable;
