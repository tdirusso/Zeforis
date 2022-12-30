import { Paper } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Autocomplete, Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../../../components/core/Snackbar';
import useSnackbar from '../../../hooks/useSnackbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { FormControl } from "@mui/material";
// import { addTask } from '../../api/task';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import { addTags } from '../../../api/client';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function TaskPage() {

  const { taskId } = useParams();

  const {
    tasks,
    tags,
    folders,
    clientAdmins,
    clientMembers,
    client,
    setTags
  } = useOutletContext();

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const task = tasks.find(t => t.task_id === Number(taskId));

  const name = useRef();
  const description = useRef();
  const linkUrl = useRef();
  const newTags = useRef();

  const [status, setStatus] = useState(task.status);
  const [folderId, setFolderId] = useState(task.folder_id);
  const [assignedToId, setAssignedToId] = useState(task.assigned_to_id);
  const [progress, setProgress] = useState(task.progress);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAddingTags, setIsAddingTags] = useState(false);
  const [isKeyTask, setIsKeyTask] = useState(task.is_key_task);
  const [dueDate, setDueDate] = useState(task.date_due);
  const [isLoading, setLoading] = useState(false);

  if (!task) {
    return <div>No task found.</div>;
  }

  const clientUsers = [...clientAdmins, ...clientMembers];
  const clientId = client.id;


  const tagIdNameMap = {};
  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const curTagsIds = task.tags?.split(',').filter(Boolean) || [];
  console.log(curTagsIds)

  const handleAddTags = () => {
    const newTagsVal = newTags.current.value;

    if (newTagsVal) {
      const newTagsArray = newTagsVal.split(',');

      setIsAddingTags(true);

      setTimeout(async () => {
        const result = await addTags({
          tags: newTagsArray,
          clientId
        });

        if (result.success) {
          const insertedTags = result.tags;
          setTags(tags => [...tags, ...insertedTags]);
          setSelectedTags(tags => [...tags, ...insertedTags]);
          setIsAddingTags(false);
          newTags.current.value = '';
        } else {
          openSnackBar(result.message, 'error');
          setIsAddingTags(false);
        }
      }, 1000);
    }
  };

  return (
    <Paper className="Folders" sx={{ p: 5 }}>

      <Box sx={{ mt: 3, mb: 3 }}>
        <TextField
          label="Name"
          fullWidth
          autoFocus
          disabled={isLoading}
          inputRef={name}
          defaultValue={task.task_name}
          required>
        </TextField>
        <TextField
          label="Description"
          fullWidth
          disabled={isLoading}
          inputRef={description}
          defaultValue={task.description}
          sx={{ mt: 4 }}>
        </TextField>

        <TextField
          label="Link URL"
          fullWidth
          disabled={isLoading}
          inputRef={linkUrl}
          defaultValue={task.link_url}
          sx={{ mt: 4 }}>
        </TextField>

        <FormControlLabel
          control={<Checkbox onChange={(_, val) => setIsKeyTask(val)} defaultChecked={task.is_key_task === 1} />}
          label="Key Task"
        />

        <Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              label="Due Date"
              inputFormat="MM/DD/YYYY"
              value={dueDate}
              onChange={value => setDueDate(value)}
              renderInput={(params) => <TextField {...params} />}
            ></DesktopDatePicker>
          </LocalizationProvider>
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Status"
            disabled={isLoading}
            onChange={e => setStatus(e.target.value)}>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="Next Up">Next Up</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Currently Writing">Currently Writing</MenuItem>
            <MenuItem value="Pending Approval">Pending Approval</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Ready to Implement">Ready to Implement</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="folder-label">Folder</InputLabel>
          <Select
            labelId="folder-label"
            value={folderId}
            disabled={isLoading}
            label="Folder"
            onChange={e => setFolderId(e.target.value)}>
            {
              folders.map(folder => {
                return <MenuItem key={folder.id} value={folder.id}>{folder.name}</MenuItem>;
              })
            }
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="assigned-label">Assigned To</InputLabel>
          <Select
            labelId="assigned-label"
            value={assignedToId}
            disabled={isLoading}
            label="Assigned To"
            onChange={e => setAssignedToId(e.target.value)}>
            {
              clientUsers.map(user => {
                return <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>;
              })
            }
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <Autocomplete
            multiple
            options={tags}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            disableCloseOnSelect
            disabled={isLoading}
            
            onChange={(_, newVal) => setSelectedTags(newVal)}
            value={selectedTags}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
              />
            )}
          />
        </FormControl>
        <Box sx={{ mt: 1 }}>
          <Input
            variant='standard'
            size='small'
            placeholder='Tag 1, Tag 2...'
            fullWidth
            inputRef={newTags}
            disabled={isAddingTags || isLoading}
            endAdornment={
              <InputAdornment position="end">
                <LoadingButton
                  onClick={handleAddTags}
                  loading={isAddingTags}
                  disabled={isLoading}
                  size='small'>
                  Add Tags
                </LoadingButton>
              </InputAdornment>
            }
          ></Input>
          <Typography variant='caption'>
            To add new tags, type them into the text field above, comma separated, and click "Add Tags".
          </Typography>
        </Box>
      </Box>
      <Box width={'95%'}>
        <Slider
          defaultValue={0}
          valueLabelDisplay="auto"
          step={5}
          marks={[{ value: 0, label: '0%' }, { value: 100, label: '100%' }]}
          min={0}
          max={100}
          disabled={isLoading}
          value={progress}
          onChange={e => setProgress(e.target.value)}
          valueLabelFormat={val => `${val}%`}
        />
      </Box>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Paper>
  );
};
