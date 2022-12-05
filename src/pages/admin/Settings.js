import { Divider, Typography } from "@mui/material";
import ClientMenu from "../../components/admin/ClientMenu";
import './styles/settings.css';

export default function Settings({client}) {

  return (
    <div className="Settings">
      <Typography variant="h5" gutterBottom>Settings</Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>Clients</Typography>
      <div className="flex current-client">
        <Typography variant="body1" mr={1}>Currently viewing &ndash;</Typography>
        <ClientMenu />
      </div>
    </div>
  )
};
