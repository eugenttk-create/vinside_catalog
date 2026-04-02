export const PART_DESCRIPTION_KEYS = [
  "positionNumber",
  "number",
  "name",
  "remark",
  "qty",
  "modelDescription",
  "me",
  "ae",
  "year_from",
  "year_to",
  "to_year",
  "from_year",
  "to",
  "from",
  "info",
  "color",
  "restriction",
  "properties",
  "optional",
  "appliNote",
  "hint",
  "modificationCodes",
  "comment",
] as const;

export type PartDescriptionKey = (typeof PART_DESCRIPTION_KEYS)[number];

type PartDescription = Partial<Record<PartDescriptionKey, string>>;

export interface Part {
  id: string;
  name: string;
  number: string;
  notice: string;
  description: PartDescription;
  positionNumber: string;
  url: string;
}

interface PartsGroup {
  description: string;
  name: string;
  number: string;
  positionNumber: string;
  parts: Part[];
}

interface Position {
  number: string;
  coordinates: number[];
  img?: string | null;
}

interface PartsResponse {
  img: string | string[];
  imgDescription: string;
  partGroups: PartsGroup[];
  positions: Position[];
}

interface PartsState {
  parts: PartsResponse;
  partsLoading: boolean;
  partsError: string | null;
}

export const initialState: PartsState = {
  parts: {
    img: "",
    imgDescription: "",
    partGroups: [],
    positions: [],
  },
  partsLoading: false,
  partsError: null,
};
