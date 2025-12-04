interface Breadcrumb {
  name: string;
  type: string;
  id?: string;
}

interface BreadcrumbsState {
  breadcrumbs: Breadcrumb[];
}

export const initialState: BreadcrumbsState = {
  breadcrumbs: [],
};
