import { useOutletContext } from "react-router-dom";
import React from 'react';
import TasksTable from "../../../components/core/tasks/TasksTable";

export default function TasksPage() {

  const {
    tasks
  } = useOutletContext();

  return (
    <TasksTable tasks={tasks} />
  );
};
