export type Folder = {
  readonly id: number,
  name?: string,
  engagementId?: number,
  dateCreated?: Date,
  isKeyFolder?: boolean;
  parentId?: number;
};