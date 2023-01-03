import './styles.css';
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import React from 'react';
import AddTaskModal from "../../../components/admin/AddTaskModal";
import Header from "../../../components/core/Header";
import TasksTable from "../../../components/core/tasks/TasksTable";

export default function TasksPage() {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const {
    tasks
  } = useOutletContext();


  return (
    <>
      <Header />

      <TasksTable tasks={tasks} />

      <AddTaskModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
      />

    </>

  );
};
