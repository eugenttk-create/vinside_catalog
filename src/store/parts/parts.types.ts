interface Part {
  id: string;
  name: string;
  number: string;
  notice: string;
  description: string;
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
