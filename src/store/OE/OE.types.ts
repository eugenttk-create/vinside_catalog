interface OEModel {
  brand: string;
  carId: string;
  model: string;
  year: string;
}

interface OE {
  engid: string;
  name: string;
  oe_number: string;
  remark: string;
  models: OEModel[];
}

interface OEState {
  OE: OE | null;
  OELoading: boolean;
  OEError: string | null;
  OEGroupsLoading: boolean;
  OEGroupsError: string | null;
  isOESearch: boolean;
}

export const initialState: OEState = {
  OE: null,
  OELoading: false,
  OEError: null,
  OEGroupsLoading: false,
  OEGroupsError: null,
  isOESearch: false,
};
