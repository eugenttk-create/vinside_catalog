export interface Breadcrumb {
  name: string;
  type: string;
  id?: string;
}

interface BreadcrumbsState {
  breadcrumbs: Breadcrumb[];
  currentIndex: number;
}

export const initialState: BreadcrumbsState = {
  breadcrumbs: [],
  currentIndex: -1,
};
