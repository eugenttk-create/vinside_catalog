interface Group {
  id: string;
  hasSubgroups: boolean;
  hasParts: boolean;
  name: string;
  description: string;
  img: string;
}

interface GroupsState {
  groups: Group[];
  groupsLoading: boolean;
  groupsError: string | null;
  selectedGroups: string[];
}

export const initialState: GroupsState = {
  groups: [],
  groupsLoading: false,
  groupsError: null,
  selectedGroups: [],
};
