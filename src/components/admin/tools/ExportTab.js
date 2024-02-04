import { Box, Grid, Paper, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useOutletContext } from "react-router-dom";
import { CSVLink } from "react-csv";
import { useEffect, useRef, useState } from "react";
import moment from 'moment';

export default function ExportTab() {

  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);

  const downloadRef = useRef();

  const {
    tasks,
    engagement,
    foldersMap,
    tagsMap
  } = useOutletContext();

  const handleExport = () => {
    setLoading(true);

    const exportData = [[
      'Task Name',
      'Folder',
      'Status',
      'Description',
      'Link URL',
      'Assigned To',
      'Tags',
      'Key Task',
      'Created By',
      'Date Due',
      'Date Completed',
      'Date Last Updated',
      'Last Updated By'
    ]];

    tasks.forEach(task => {
      const {
        task_name,
        folder_id,
        description,
        status,
        link_url,
        assigned_to_id,
        assigned_to_first,
        assigned_to_last,
        tags,
        is_key_task,
        created_first,
        created_last,
        date_due,
        date_completed,
        date_last_updated,
        updated_by_first,
        updated_by_last
      } = task;

      exportData.push([
        task_name,
        foldersMap[folder_id]?.name || '',
        status,
        description || '',
        link_url || '',
        assigned_to_id ? `${assigned_to_first} ${assigned_to_last}` : '',
        tags?.split(',').map(tagId => tagsMap[tagId]?.name || '').join(', ') || '',
        is_key_task ? 'Yes' : 'No',
        `${created_first} ${created_last}`,
        date_due ? moment(date_due).format('MM/DD/YYYY') : '',
        date_completed ? moment(date_due).format('MM/DD/YYYY') : '',
        moment(date_last_updated).format('MM/DD/YYYY'),
        `${updated_by_first} ${updated_by_last}`,
      ]);
    });

    setCsvData(exportData);
    setLoading(false);
  };

  useEffect(() => {
    if (csvData) {
      downloadRef.current.link.click();
    }
  }, [csvData]);

  return (
    <Grid item xs={12}>
      <Paper>
        <Typography variant="body2">
          Click the export button below to download a CSV export of all tasks for the current engagement ({engagement.name}).
        </Typography>
        <Box mt={5} width={'100%'}>
          <LoadingButton
            style={{ width: '100%', height: 50 }}
            size="large"
            onClick={handleExport}
            loading={loading}
            variant="contained">
            Export
          </LoadingButton>
        </Box>
      </Paper>
      <CSVLink
        hidden
        ref={downloadRef}
        filename={`${engagement.name} Tasks Export`}
        data={csvData}
        target="_blank">
      </CSVLink>
    </Grid>
  );
};