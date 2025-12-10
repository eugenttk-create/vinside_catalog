interface Group {
  id: string;
  hasSubgroups: boolean;
  hasParts: boolean;
  name: string;
  description: string;
  img: string;
}

interface VinInfoParameter {
  key: string;
  value: string;
}

interface VinInfo {
  brand: string;
  carId: string;
  model: string;
  vin: string;
  parameters: VinInfoParameter[];
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
}

export const initialState: GroupsState = {
  groupsTree: [],
  groupsFlat: [],
  groupsLoading: false,
  groupsError: null,
  selectedGroups: [],
  isSidebarLoading: false,
  vinInfo: null,
};
