export const getPartLink = (partNumber: string): string => {
  const baseLink = window.__WIDGET_LINK__;
  if (!baseLink) return `https://google.com/search?q=${partNumber}`;

  return `${baseLink}${encodeURIComponent(partNumber)}`;
};
