import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import importTemplate from '../../../assets/import-template.csv';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { statuses } from "../../../lib/constants";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

const statusesString = statuses.map(({ name }) => name).join(', ');

export default function ImportTab() {

  const [readyToImport, setReadyToImport] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleImport = () => {

  };

  return (
    <Grid item xs={12}>
      <Paper>
        <Typography variant="body2">
          The import tool is designed to simplify and expedite the process of adding tasks for your clients. With just a few clicks, you can seamlessly import a CSV spreadsheet containing a list of tasks specific to a particular client, saving you valuable time and effort.
          <br></br><br></br>
          Experience the efficiency and convenience of our import tool by simply uploading a spreadsheet (.csv format) with the relevant column headers, or download and fill out the template.
          <br></br><br></br>
          Note &ndash; setting the due date, assignee, status and folder can be done in bulk form the tasks page.
        </Typography>
        <Box mt={1}>
          <Button sx={{ p: 0 }}>
            <Box
              display='flex'
              alignItems='center'
              p={'6px 8px'}
              component="a"
              href={importTemplate}
              download='Import Tasks Template'>
              <DownloadIcon fontSize="small" sx={{ mr: 0.25 }} />
              Download Template
            </Box>
          </Button>
        </Box>
        <Box mt={2} mb={3}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Column</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    component="th" scope="row">
                    name <div style={{ color: '#bdbdbd' }}>required</div>
                  </TableCell>
                  <TableCell>The name of the task.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th" scope="row">
                    folder <div style={{ color: '#bdbdbd' }}>required</div>
                  </TableCell>
                  <TableCell>The name of the folder the task will reside in.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">status</TableCell>
                  <TableCell>
                    The status of the task - must be one of the following:
                    <br></br><br></br>
                    {statusesString}
                    <br></br><br></br>
                    Default is "New".
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">description</TableCell>
                  <TableCell>The description of the task.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">url</TableCell>
                  <TableCell>The external link URL for the task.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">is_key_task</TableCell>
                  <TableCell>Value of 1 or 0 indicating if this task is a key task.
                    <br></br><br></br>
                    Default is 0.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">tags</TableCell>
                  <TableCell>
                    A comma separated list of tags to apply to the task.
                    <br></br><br></br>
                    Ex.  tag1,tag2,tag3...
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box>

        </Box>
        <Box mt={5} width={'100%'}>
          <LoadingButton
            sx={{ width: '100%', height: '50px' }}
            size="large"
            onClick={handleImport}
            loading={isLoading}
            disabled={!readyToImport}
            variant="contained">
            Import
          </LoadingButton>
        </Box>
      </Paper>

    </Grid>
  );
};
