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
  parametersLoading: boolean;
  parametersError: string | null;
}

export const initialState: ParametersState = {
  parameters: [],
  parametersLoading: false,
  parametersError: null,
};
