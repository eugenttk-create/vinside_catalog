const baseLink = window.__WIDGET_LINK__;

export const getPartLink = (partNumber: string): string => {
  if (!baseLink) return `https://google.com/search?q=${partNumber}`;
  return baseLink.replace("{part}", partNumber);
};
