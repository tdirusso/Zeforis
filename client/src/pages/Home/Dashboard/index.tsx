import { useOutletContext } from "react-router-dom";
import KeyFolders from "../../../components/core/dashboard/KeyFolders";
import KeyTasks from "../../../components/core/dashboard/KeyTasks";
import UpcomingTasks from "../../../components/core/dashboard/UpcomingTasks";
import './styles.scss';
import Widgets from "../../../components/core/dashboard/Widgets";
import { useEffect } from "react";
import { AppContext } from "src/types/AppContext";
import { Task } from "@shared/types/Task";

export default function Dashboard() {

  const {
    tasks,
    folders,
    openDrawer,
    widgets,
    isAdmin
  } = useOutletContext<AppContext>();

  useEffect(() => {
    const isGettingStarted = localStorage.getItem('openGettingStarted');

    if (isGettingStarted) {
      localStorage.removeItem('openGettingStarted');
      openDrawer('getting-started');
    }
  }, []);

  const keyTasks: Task[] = [];
  const keyFolders = folders.filter(folder => Boolean(folder.is_key_folder));

  tasks.forEach(task => {
    if (task.is_key_task) {
      keyTasks.push(task);
    }
  });

  const tasksSortedByDate = [...tasks].sort((a, b) => {
    if (a.date_due && b.date_due) {
      return new Date(a.date_due).getTime() - new Date(b.date_due).getTime();
    }
    return 0;
  }).filter(t => t.date_due);

  return (
    <>
      <KeyTasks tasks={keyTasks.slice(0, 30)} />
      <UpcomingTasks tasks={tasksSortedByDate.slice(0, 30)} />
      <Widgets widgets={widgets} />
      <KeyFolders
        folders={keyFolders}
        isAdmin={isAdmin}
        openDrawer={openDrawer}
      />
    </>
  );
};