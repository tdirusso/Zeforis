export type Task = {
  readonly task_id: number,
  task_name: string,
  description?: string,
  date_created?: string,
  created_by_id?: number,
  status: string,
  folder_id: number,
  link_url?: string,
  assigned_to_id?: number | null,
  date_completed?: string | null,
  is_key_task?: boolean,
  date_due: string | null,
  date_last_updated: string,
  tags?: string | null,
  assigned_first?: string | null,
  assigned_last?: string | null,
  created_first?: string,
  created_last?: string,
  updated_by_first?: string,
  updated_by_last?: string;
};

export type TasksMap = {
  [key: number]: Task;
};