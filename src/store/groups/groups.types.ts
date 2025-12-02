interface Group {
  id: string;
  hasSubgroups: boolean;
  hasParts: boolean;
  name: string;
  description: string;
  img: string;
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
}

export const initialState: GroupsState = {
  groupsTree: [],
  groupsFlat: [],
  groupsLoading: false,
  groupsError: null,
  selectedGroups: [],
};
