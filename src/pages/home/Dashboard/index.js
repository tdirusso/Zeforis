import { Box, LinearProgress, Paper, Typography, Button, Grid } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import KeyFolders from "../../../components/core/dashboard/KeyFolders";
import KeyTasks from "../../../components/core/dashboard/KeyTasks";
import './styles.css';

export default function Dashboard() {

  const {
    client,
    keyTasks,
    keyFolders
  } = useOutletContext();

  return (
    <>
      <KeyTasks />
      <KeyFolders />
    </>
  );
};
