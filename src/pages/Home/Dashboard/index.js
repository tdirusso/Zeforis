/* eslint-disable react-hooks/exhaustive-deps */
import { useOutletContext } from "react-router-dom";
import KeyFolders from "../../../components/core/dashboard/KeyFolders";
import KeyTasks from "../../../components/core/dashboard/KeyTasks";
import UpcomingTasks from "../../../components/core/dashboard/UpcomingTasks";
import './styles.css';
import CustomWidgets from "../../../components/core/dashboard/CustomWidgets";
import { useEffect } from "react";

export default function Dashboard() {

  const {
    tasks,
    folders,
    openDrawer,
    widgets,
    isAdmin
  } = useOutletContext();

  useEffect(() => {
    const isGettingStarted = localStorage.getItem('openGettingStarted');

    if (isGettingStarted) {
      localStorage.removeItem('openGettingStarted');
      openDrawer('getting-started');
    }
  }, []);

  const keyTasks = [];
  const keyFolders = folders.filter(folder => Boolean(folder.is_key_folder));

  tasks.forEach(task => {
    if (task.is_key_task) {
      keyTasks.push(task);
    }
  });

  const tasksSortedByDate = [...tasks].sort((a, b) => {
    return new Date(a.date_due) - new Date(b.date_due);
  }).filter(t => t.date_due);

  return (
    <>
      <KeyTasks tasks={keyTasks.slice(0, 30)} />
      <UpcomingTasks tasks={tasksSortedByDate.slice(0, 30)} />
      <CustomWidgets widgets={widgets} />
      <KeyFolders
        folders={keyFolders}
        isAdmin={isAdmin}
        openDrawer={openDrawer}
      />
    </>
  );
};