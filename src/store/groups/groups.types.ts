export interface Group {
  id: string;
  hasSubgroups: boolean;
  hasParts: boolean;
  name: string;
  description: {
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
  img: string;
  scope: string | null;
}

interface VinInfoParameter {
  key: string;
  value: string;
  description: string | null | "";
}

interface VinInfo {
  brand: string;
  carId: string;
  model: string;
  vin: string;
  parameters: VinInfoParameter[];
  optionCodes:
    | {
        description: string;
        key: string;
        value: string;
      }[]
    | null;
}

export interface Region {
  id: string;
  region: string;
}

export interface GroupNode extends Group {
  children?: GroupNode[];
}

export interface GroupsState {
  groupsTree: GroupNode[];
  groupsFlat: Group[];
  groupsLoading: boolean;
  groupsError: string | null;
  selectedGroups: string[];
  isSidebarLoading: boolean;
  vinInfo: VinInfo | null;
  vinRegionId?: string;
  isAiSearch: boolean;
  aiSearchQuery: string;
  searchResultType: "groups" | "parts" | null;
  sidebarVisible: boolean;
  pendingRegions: Region[];
  pendingVin: string;
}

export const initialState: GroupsState = {
  groupsTree: [],
  groupsFlat: [],
  groupsLoading: false,
  groupsError: null,
  selectedGroups: [],
  isSidebarLoading: false,
  vinInfo: null,
  isAiSearch: false,
  aiSearchQuery: "",
  searchResultType: null,
  sidebarVisible: true,
  pendingRegions: [],
  pendingVin: "",
};
