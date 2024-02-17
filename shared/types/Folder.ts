import { Task } from "./Task";

export type Folder = {
  readonly id: number,
  name: string,
  engagement_id?: number,
  date_created?: Date,
  is_key_folder?: boolean;
  parent_id?: number;
  tasks?: Task[];
};

export type FoldersMap = {
  [key: number]: Folder;
};