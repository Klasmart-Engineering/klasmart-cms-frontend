export const updateURLSearch = (
  search: string,
  param: {
    [key: string]: string | number | boolean;
  }
): string => {
  const query = new URLSearchParams(search);
  Object.keys(param).forEach((key) => {
    query.set(key, `${param[key]}`);
  });
  return query.toString();
};

export const setQuery = (search: string, hash: Record<string, string | number | boolean>): string => {
  const query = new URLSearchParams(search);
  Object.keys(hash).forEach((key) => query.set(key, String(hash[key])));
  return query.toString();
};

export const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

export const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};
