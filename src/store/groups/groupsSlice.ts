import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./groups.types";
import {
  fetchGroups,
  fetchByVin,
  fetchVinInfo,
  fetchGroupsBySearchQuery,
} from "./groupsThunks";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Region } from "./groups.types";
import { fetchOEGroups } from "../OE/OEThunks";
import type { GroupNode } from "./groups.types";

const insertChildren = (
  nodes: GroupNode[],
  parentId: string,
  children: GroupNode[]
) => {
  for (let node of nodes) {
    if (node.id === parentId) {
      node.children = children;
      return true;
    }
    if (node.children) {
      const inserted = insertChildren(node.children, parentId, children);
      if (inserted) return true;
    }
  }
  return false;
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    resetGroups: (state) => {
      state.groupsTree = [];
      state.groupsFlat = [];
      state.selectedGroups = [];
      state.isAiSearch = false;
      state.aiSearchQuery = "";
      state.searchResultType = null;
    },
    setIsAiSearch: (state, action) => {
      state.isAiSearch = action.payload;
    },
    setAiSearchQuery: (state, action) => {
      state.aiSearchQuery = action.payload;
    },

    setIsSidebarVisible: (state, action) => {
      state.sidebarVisible = action.payload;
    },

    setPendingRegions: (
      state,
      action: PayloadAction<{ regions: Region[]; vin: string }>
    ) => {
      state.pendingRegions = action.payload.regions;
      state.pendingVin = action.payload.vin;
    },

    clearPendingRegions: (state) => {
      state.pendingRegions = [];
      state.pendingVin = "";
    },
  },

  extraReducers: (builder) => {
    //get groups
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })

      .addCase(fetchGroups.fulfilled, (state, action) => {
        const { parentId, children, flat } = action.payload;

        state.groupsLoading = false;
        state.groupsError = null;

        state.groupsFlat = flat;

        if (!parentId) {
          state.groupsTree = children;
          return;
        }

        insertChildren(state.groupsTree, parentId, children);
      })

      .addCase(fetchGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      })
      //get groups by vin
      .addCase(fetchByVin.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })

      .addCase(fetchByVin.fulfilled, (state) => {
        state.groupsLoading = false;
        state.groupsError = null;
      })

      .addCase(fetchByVin.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      })
      //get vin info
      .addCase(fetchVinInfo.pending, (state) => {
        state.isSidebarLoading = true;
        state.groupsError = null;
      })

      .addCase(fetchVinInfo.fulfilled, (state, action) => {
        state.isSidebarLoading = false;
        state.vinInfo = action.payload;
        state.groupsError = null;
      })

      .addCase(fetchVinInfo.rejected, (state, action) => {
        state.isSidebarLoading = false;
        state.groupsError = action.payload as string;
      })
      //search groups
      .addCase(fetchGroupsBySearchQuery.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(fetchGroupsBySearchQuery.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = null;
        state.searchResultType = action.payload.type;

        if (action.payload.type === "groups") {
          state.groupsTree = action.payload.children;
          state.groupsFlat = action.payload.flat;
        }
      })
      .addCase(fetchGroupsBySearchQuery.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      })
      //get groups by oe search
      .addCase(fetchOEGroups.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(fetchOEGroups.fulfilled, (state, action) => {
        const { parentId, children, flat } = action.payload;

        state.groupsLoading = false;
        state.groupsError = null;
        state.groupsFlat = flat;

        if (!parentId) {
          state.groupsTree = children;
          return;
        }

        insertChildren(state.groupsTree, parentId, children);
      })
      .addCase(fetchOEGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      });
  },
});

export const {
  resetGroups,
  setIsAiSearch,
  setAiSearchQuery,
  setIsSidebarVisible,
  setPendingRegions,
  clearPendingRegions,
} = groupsSlice.actions;
export default groupsSlice.reducer;
