import { Box, Button, Grid, Paper } from "@mui/material";
import { useState } from "react";
import RestorePageIcon from '@mui/icons-material/RestorePage';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ReportGeneratorTab from "../../../components/admin/tools/ReportGeneratorTab";
import ImportTab from "../../../components/admin/tools/ImportTab";
import ExportTab from "../../../components/admin/tools/ExportTab";
import WidgetsTab from "../../../components/admin/tools/WidgetsTab";
import '../styles.scss';

const buttonStyles = {
  padding: '10px 15px',
  borderRadius: '24px',
  transition: 'color 200ms linear'
};

export default function ToolsPage() {

  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <ReportGeneratorTab />;
      case 1:
        return <WidgetsTab />;
      case 2:
        return <ImportTab />;
      case 3:
        return <ExportTab />;
      default:
        break;
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box display='flex' gap={1.5} flexWrap='wrap'>
          <Paper className={`custom-tab ${tabVal === 0 ? 'active' : ''}`}>
            <Button
              onClick={() => setTabVal(0)}
              style={{
                ...buttonStyles,
                color: tabVal === 0 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<RestorePageIcon />}>
              Report Generator
            </Button>
          </Paper>
          <Paper className={`custom-tab ${tabVal === 1 ? 'active' : ''}`} >
            <Button
              onClick={() => setTabVal(1)}
              style={{
                ...buttonStyles,
                color: tabVal === 1 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<WidgetsIcon />}>
              Widgets
            </Button>
          </Paper>
          <Paper className={`custom-tab ${tabVal === 2 ? 'active' : ''}`}>
            <Button
              onClick={() => setTabVal(2)}
              style={{
                ...buttonStyles,
                color: tabVal === 2 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<DownloadIcon />}>
              Import
            </Button>
          </Paper>
          <Paper className={`custom-tab ${tabVal === 3 ? 'active' : ''}`}>
            <Button
              onClick={() => setTabVal(3)}
              style={{
                ...buttonStyles,
                color: tabVal === 3 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<UploadIcon />}>
              Export
            </Button>
          </Paper>
        </Box>
      </Grid>
      {
        getTabContent()
      }
    </>
  );
};
