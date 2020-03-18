export function groupBy<T extends {}>(list: T[], key: keyof T | ((item: T) => string)): Map<string, T[]> {
  let propsFn: (item: T) => string;
  if (typeof key === 'function') {
    propsFn = key;
  } else {
    propsFn = (item) => `${item[key]}`;
  }
  const map = new Map<string, T[]>();
  for (const item of list) {
    const key = propsFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key)?.push(item);
  }
  return map;
}