import { Grid, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import RestorePageIcon from '@mui/icons-material/RestorePage';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ReportGeneratorTab from "../../../components/admin/tools/ReportGeneratorTab";
export default function ToolsPage() {

  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <ReportGeneratorTab />;
      default:
        break;
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Tabs value={tabVal} onChange={(_, val) => setTabVal(val)} variant="fullWidth">
          <Tab label="Report Generator" icon={<RestorePageIcon />} iconPosition="start" />
          <Tab label="Widgets" icon={<WidgetsIcon />} iconPosition="start" />
          <Tab label="Import" icon={<DownloadIcon />} iconPosition="start" />
          <Tab label="Export" icon={<UploadIcon />} iconPosition="start" />
        </Tabs>
      </Grid>
      {
        getTabContent()
      }
    </>
  );
};
