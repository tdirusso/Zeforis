/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Checkbox, FormControlLabel, FormHelperText, Grid, Paper, Typography } from "@mui/material";
import importTemplate from '../../../assets/import-template.csv';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { statuses } from "../../../lib/constants";
import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Papa from "papaparse";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useOutletContext } from "react-router-dom";
import { importTasks } from "../../../api/tasks";

const statusesString = statuses.map(({ name }) => name).join(', ');
const statusesSet = new Set(statuses.map(({ name }) => name.toLowerCase()));

export default function ImportTab() {

  const {
    tags,
    folders,
    openSnackBar,
    client
  } = useOutletContext();

  const clientId = client.id;

  const [importData, setImportData] = useState(null);
  const [createNewFolders, setCreateNewFolders] = useState(true);
  const [createNewTags, setCreateNewTags] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [folderNames] = useState(new Set(folders.map(({ name }) => name)));
  const [tagNames] = useState(new Set(tags.map(({ name }) => name)));
  const [csvData, setCsvData] = useState(null);

  const fileRef = useRef();

  useEffect(() => {
    if (csvData) {
      const errors = [];

      const { meta, data } = csvData;

      if (!meta.fields.includes('name')) {
        errors.push('Uploaded file does not contain a "name" header column.');
      }

      if (!meta.fields.includes('folder')) {
        errors.push('Uploaded file does not contain a "folder" header column.');
      }

      if (errors.length) {
        setImportData({ errors });
        return;
      }

      const tagsToCreate = [];
      const foldersToCreate = [];
      const importRows = [];

      data.forEach((row, index) => {
        let name = row.name?.trim();
        let folder = row.folder?.trim();
        let description = row.description?.trim();
        let status = row.status?.trim();
        let url = row.url?.trim();
        let isKeyTask = row.is_key_task?.trim();
        let tagsArray = row.tags ? row.tags.trim().split(',').map(tag => tag.trim()) : [];

        if (!name) {
          errors.push(`Row ${index + 2} has no name value.`);
        }

        if (!folder) {
          errors.push(`Row ${index + 2} has no folder value.`);
        }

        if (status && !statusesSet.has(status.toLowerCase())) {
          errors.push(`Row ${index + 2} contains invalid status: "${row.status}".`);
        }

        if (folder && createNewFolders) {
          if (!folderNames.has(folder)) {
            foldersToCreate.push(folder);
          }
        } else if (folder && !folderNames.has(folder)) {
          errors.push(`Row ${index + 2} contains invalid folder: "${folder}".`);
        }

        if (tagsArray.length > 0) {
          if (createNewTags) {
            tagsArray.forEach(tag => {
              if (!tagNames.has(tag)) {
                tagsToCreate.push(row.folder);
              }
            });
          } else {
            tagsArray.forEach(tag => {
              if (!tagNames.has(tag)) {
                errors.push(`Row ${index + 2} contains invalid tag: "${tag}".`);
              }
            });
          }
        }

        importRows.push({
          name,
          description,
          status,
          folder,
          tagsArray,
          url,
          isKeyTask
        });
      });

      setImportData({
        errors,
        tagsToCreate,
        foldersToCreate,
        importRows
      });
    }
  }, [csvData, createNewFolders, createNewTags]);

  const handleImport = async () => {

    if (!importData || importData.importRows.length === 0) {
      openSnackBar('Please upload a file with more than 1 task to import.');
      return;
    }

    if (importData.errors.length > 0) {
      openSnackBar('Please resolve the errors displayed in the preview.');
      return;
    }

    setLoading(true);

    try {
      const { success, message } = await importTasks({
        clientId,
        importRows: importData.importRows
      });

      if (success) {
        openSnackBar('Tasks successfully imported.', 'success');
        setTimeout(() => {
          window.location.href = '/home/tasks';
        }, 1000);
      } else {
        openSnackBar(message, 'error');
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }

  };

  const handleFileChange = e => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setCsvData(results);
        }
      });
    }
  };

  return (
    <Grid item xs={12}>
      <Paper>
        <Typography variant="body2">
          The import tool is designed to simplify and expedite the process of adding tasks for your clients. With just a few clicks, you can seamlessly import a CSV spreadsheet containing a list of tasks specific to a particular client, saving you valuable time and effort.
          <br></br><br></br>
          Experience the efficiency and convenience of our import tool by simply uploading a spreadsheet (.csv format) with the relevant column headers, or download and fill out the template.
          <br></br><br></br>
          Note &ndash; setting the due date, assignee, status and folder can be done in bulk from the tasks page after importing.
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
              Download Import Template
            </Box>
          </Button>
        </Box>
        <Box mt={2} mb={3}>
          <Accordion
            sx={{ p: 0, borderRadius: '16px !important' }}
            disableGutters>
            <AccordionSummary
              sx={{
                '& .MuiAccordionSummary-content': {
                  flexGrow: 'unset !important',
                  mr: 1
                }
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>View Column Field Mappings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Column Field</TableCell>
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
                      <TableCell component="th" scope="row" sx={{ borderBottom: 'none' }}>tags</TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        A comma separated list of tags to apply to the task.
                        <br></br><br></br>
                        Ex.  tag1,tag2,tag3...
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box component='h4' mt={4}>Options</Box>
        <Box my={1}>
          <FormControlLabel
            control={<Checkbox
              disabled={isLoading}
              onChange={(_, val) => setCreateNewFolders(val)}
              checked={createNewFolders}
            />}
            label="Create new folders"
          />
          <FormHelperText>
            A new folder will be created if it does not currently exist during the import (case sensitive).
          </FormHelperText>
        </Box>
        <Box>
          <FormControlLabel
            control={<Checkbox
              disabled={isLoading}
              onChange={(_, val) => setCreateNewTags(val)}
              checked={createNewTags}
            />}
            label="Create new tags"
          />
          <FormHelperText>
            New tags will be created if one does not currently exist during the import (case sensitive).
          </FormHelperText>
        </Box>
        <Box my={4}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => fileRef.current.value = null}
            startIcon={<UploadFileIcon />}
            disabled={isLoading}
            component="label">
            Upload File
            <input
              ref={fileRef}
              hidden
              accept=".csv"
              type="file"
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        <Box component='h4' mt={5}>Import Preview</Box>
        <Box mt={2}>
          {
            !importData ? <Typography variant="body2">Waiting for file...</Typography>
              :
              <ImportData importData={importData} />
          }
        </Box>
        <Box mt={5} width={'100%'}>
          <LoadingButton
            sx={{ width: '100%', height: '50px' }}
            size="large"
            onClick={handleImport}
            loading={isLoading}
            disabled={!(importData && importData.errors.length === 0)}
            variant="contained">
            Import
          </LoadingButton>
        </Box>
      </Paper>

    </Grid>
  );
};

function ImportData({ importData }) {

  const {
    errors,
    tagsToCreate,
    foldersToCreate,
    importRows
  } = importData;

  if (errors && errors.length > 0) {
    return (
      <Box mt={1}>
        <Typography color="error" fontWeight={600}>
          {errors.length} Errors
        </Typography>
        <Box>
          <ul>
            {
              errors.map((error, i) => {
                return <li key={i}>
                  <Typography color="error">
                    {error}
                  </Typography>
                </li>;
              })
            }
          </ul>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography color="#4caf50" fontWeight={600}>
        Successfully parsed
      </Typography>
      <Box>
        <ul>
          <li style={{ color: '#4caf50' }}><b>{importRows.length} tasks</b> will be imported</li>
          <li style={{ color: '#4caf50' }}><b>{foldersToCreate.length} folders</b> will be created</li>
          <li style={{ color: '#4caf50' }}><b>{tagsToCreate.length} tags</b> will be created</li>
        </ul>
      </Box>
    </Box>
  );
}