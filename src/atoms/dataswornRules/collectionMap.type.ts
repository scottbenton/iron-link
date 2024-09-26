export type CollectionMap<T> = {
  [rulesetKey: string]: {
    title: string;
    collections: Record<string, T>;
  };
};
