import { AlertColor, Theme } from "@mui/material";
import { Engagement } from "@shared/types/Engagement";
import { Folder, FoldersMap } from "@shared/types/Folder";
import { Org, OrgUsersMap } from "@shared/types/Org";
import { Tag, TagsMap } from "@shared/types/Tag";
import { Task, TasksMap } from "@shared/types/Task";
import { User } from "@shared/types/User";
import { Widget } from "@shared/types/Widget";

type CustomObjectParams = {
  [key: string | number]: any;
};

export type AppContext = {
  engagement: Engagement,
  engagements: Engagement[],
  org: Org,
  user: User,
  folders: Folder[],
  tasks: Task[];
  tags: Tag[],
  engagementMembers: User[],
  engagementAdmins: User[],
  orgUsers: User[],
  orgUsersMap: OrgUsersMap,
  tagsMap: TagsMap,
  foldersMap: FoldersMap,
  tasksMap: TasksMap,
  isAdmin: boolean,
  widgets: Widget[],
  setTheme: (theme: Theme) => void,
  isOrgOwner: boolean,
  orgOwnerPlan: string,
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>,
  setEngagement: React.Dispatch<React.SetStateAction<Engagement | null>>,
  setOrg: React.Dispatch<React.SetStateAction<Org | null>>,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>,
  setOrgUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  openSnackBar: (message?: string, type?: AlertColor, options?: {}) => void,
  openModal: (modalType: string, props?: CustomObjectParams) => void,
  openDrawer: (drawerType: string, props?: CustomObjectParams) => void,
  openDialog: (dialogType: string, props?: CustomObjectParams) => void,
  openContextMenu: (event: React.MouseEvent<Element, MouseEvent>, contextMenuType: string, props?: CustomObjectParams) => void;
};