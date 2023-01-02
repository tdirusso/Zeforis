import { useOutletContext } from "react-router-dom";
import KeyFolders from "../../../components/core/dashboard/KeyFolders";
import KeyTasks from "../../../components/core/dashboard/KeyTasks";
import UpcomingTasks from "../../../components/core/dashboard/UpcomingTasks";
import './styles.css';

export default function Dashboard() {

  const {
    tasks,
    keyTasks,
    keyFolders
  } = useOutletContext();

  return (
    <>
      <KeyTasks keyTasks={keyTasks} />
      <KeyFolders keyFolders={keyFolders} />
      <UpcomingTasks tasks={tasks}/>
    </>
  );
};
