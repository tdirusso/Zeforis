export type Tag = {
  readonly id: number,
  name: string,
  engagementId?: number;
};

export type TagsMap = {
  [key: number]: Tag;
};