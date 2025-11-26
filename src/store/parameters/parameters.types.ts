interface ParameterValue {
  idx: string;
  value: string;
}

interface Parameter {
  key: string;
  name: string;
  values: ParameterValue[];
  sortOrder: number;
}

interface ParametersState {
  parameters: Parameter[];
  carId: string | null;
  parametersLoading: boolean;
  parametersError: string | null;
  selectedParameters: string[];
}

export const initialState: ParametersState = {
  parameters: [],
  carId: null,
  parametersLoading: false,
  parametersError: null,
  selectedParameters: [],
};
