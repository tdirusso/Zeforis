/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid, Paper, Checkbox, Box, Tooltip, IconButton,
  Chip, Typography, TextField, Menu, MenuItem, Avatar, FormControl,
  Autocomplete, Button, Divider, ListItemText, FormHelperText,
  Collapse,
  InputAdornment,
  InputLabel,
  Select,
  useTheme
} from "@mui/material";
import './styles.scss';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { statuses } from "../../../lib/constants";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import moment from "moment";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import { batchUpdateTasks, updateTask } from "../../../api/tasks";
import { createTag } from "../../../api/tags";
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from "react-transition-group";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { LoadingButton } from "@mui/lab";
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';

export default function FolderView({ folderId }) {

  const {
    engagement,
    tagsMap,
    engagementAdmins,
    engagementMembers,
    user,
    openSnackBar,
    setTasks,
    tasksMap,
    foldersMap,
    tags,
    setTags,
    openDrawer,
    openModal,
    folders
  } = useOutletContext();

  const theme = useTheme(); // Get the current theme

  const engagementId = engagement.id;
  const folder = foldersMap[folderId];

  const [isBulkEditMode, setBulkEditMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [editingTask, setEditingTask] = useState(null);
  const [isEditingName, setEditingName] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [assigneeMenuAnchor, setAssigneeMenuAnchor] = useState(null);
  const [dateDueMenuAnchor, setDateDueMenuAnchor] = useState(null);
  const [taskActionsMenuAnchor, setTaskActionsMenuAnchor] = useState(null);
  const [tagsMenuAnchor, setTagsMenuAnchor] = useState(null);
  const [folderMenuAnchor, setFolderMenuAnchor] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tempAssignee, setTempAssignee] = useState(null);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [tagIdToRemove, setTagIdToRemove] = useState(null);
  const [doUpdate, setDoUpdate] = useState(false);
  const [doAction, setDoAction] = useState(null);

  const [filterName, setFilterName] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [filterAssignedTo, setFilterAssignedTo] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [bulkEditAction, setBulkEditAction] = useState(null);
  const [bulkStatusValue, setBulkStatusValue] = useState(null);
  const [bulkDueValue, setBulkDueValue] = useState(null);
  const [bulkFolderValue, setBulkFolderValue] = useState(null);
  const [bulkAssigneeValue, setBulkAssigneeValue] = useState(null);
  const [bulkTagAction, setBulkTagAction] = useState('add');

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const folderTasks = useMemo(() => {
    let theTasks = folder.tasks;
    const lcFilterName = filterName?.toLowerCase();

    theTasks = theTasks.filter(task => {
      let tagIds;

      if (filterTags.length) {
        tagIds = task.tags?.split(',').filter(Boolean).map(id => String(id)) || [];
      }

      return (!lcFilterName || task.task_name.toLowerCase().includes(lcFilterName)) &&
        (!filterAssignedTo || filterAssignedTo.id === task.assigned_to_id) &&
        (filterTags.length === 0 || filterTags.every(tag => tagIds.includes(tag.id.toString()))) &&
        (filterStatus === 'all' || filterStatus === task.status);
    });

    switch (sortBy) {
      case 'name':
        theTasks.sort((a, b) => a.task_name.localeCompare(b.task_name));
        break;
      case 'status':
        theTasks.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'dateDue':
        theTasks.sort((a, b) => {
          // Sort all tasks without due dates to the bottom
          if (!a.date_due) return 1;
          if (!b.date_due) return -1;
          return 0;
        }).sort((a, b) => {
          // Now sort by the due date
          if (!a.date_due || !b.date_due) return 1;
          return new Date(a.date_due) - new Date(b.date_due);
        });
        break;
      case 'assignee':
        theTasks.sort((a, b) => {
          if (!a.assigned_first) return 1;
          if (!b.assigned_first) return -1;
          return 0;
        }).sort((a, b) => {
          if (!a.assigned_first || !b.assigned_first) return 1;
          return a.assigned_first.localeCompare(b.assigned_first);
        });
        break;
      default:
        break;
    }

    return theTasks;
  }, [sortBy, folder, filterName, filterAssignedTo, filterTags, filterStatus]);

  const filterCount = (filterName ? 1 : 0) +
    (filterAssignedTo ? 1 : 0) +
    (filterTags.length ? 1 : 0) +
    (filterStatus !== 'all' ? 1 : 0);

  const statusMenuOpen = Boolean(statusMenuAnchor);
  const assigneeMenuOpen = Boolean(assigneeMenuAnchor);
  const dateDueMenuOpen = Boolean(dateDueMenuAnchor);
  const taskActionsMenuOpen = Boolean(taskActionsMenuAnchor);
  const tagsMenuOpen = Boolean(tagsMenuAnchor);
  const folderMenuOpen = Boolean(folderMenuAnchor);

  const nameRef = useRef(null);

  const now = moment();
  const tomorrow = moment().add(1, 'day');

  const membersAndAdmins = useMemo(() => [...engagementAdmins, ...engagementMembers],
    [engagementAdmins, engagementMembers]);

  const editingTaskTagIds = editingTask?.tags?.split(',').filter(Boolean).map(id => Number(id)) || [];

  const availableTags = (
    editingTask && tags.filter(tag => !editingTaskTagIds.includes(tag.id))
  ) || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setEditingName(false);
        setEditingTask(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function handleUpdateTask() {
      try {
        const currentTags = editingTaskTagIds.map(tagId => ({
          id: Number(tagId),
          name: tagsMap[tagId].name
        }));

        let allTags = tempSelectedTags.length === 0 ?
          currentTags :
          [...currentTags, ...tempSelectedTags];

        if (tagIdToRemove) {
          allTags = allTags.filter(tag => tag.id !== tagIdToRemove);
        }

        const { message, success } = await updateTask({
          name: editingTask.task_name,
          description: editingTask.description,
          linkUrl: editingTask.link_url,
          status: editingTask.status,
          assignedToId: editingTask.assigned_to_id,
          folderId: folder.id,
          engagementId: engagementId,
          isKeyTask: editingTask.is_key_task,
          dateDue: editingTask.date_due,
          taskId: editingTask.task_id,
          currentTags,
          tags: allTags
        });

        if (success) {
          const now = new Date().toISOString();
          let dateCompletedToSet = null;

          if (editingTask.status === 'Complete') {
            if (editingTask.date_completed) {
              dateCompletedToSet = editingTask.date_completed;
            } else {
              dateCompletedToSet = now;
            }
          }

          const updatedTaskObject = {
            ...(delete editingTask.currentTags && editingTask),
            date_completed: dateCompletedToSet,
            date_last_updated: now,
            tags: allTags.length > 0 ? allTags.map(t => t.id).join(',') : null
          };

          tasksMap[editingTask.task_id] = updatedTaskObject;

          setTasks(Object.values(tasksMap));
          setDoUpdate(false);
          setEditingName(false);
          setTempSelectedTags([]);
          setTagIdToRemove(null);
          setTimeout(() => {
            setEditingTask(null);
          }, 300);
          openSnackBar('Saved.', 'success');
        } else {
          setEditingTask(null);
          setDoUpdate(false);
          setTempSelectedTags([]);
          setTagIdToRemove(null);
          openSnackBar(message, 'error');
        }
      } catch (error) {
        setEditingTask(null);
        setDoUpdate(false);
        setTempSelectedTags([]);
        setTagIdToRemove(null);
        openSnackBar(error.message, 'error');
      }
    }

    async function handleBulkUpdateTasks() {
      try {
        const { updatedTasks, message } = await batchUpdateTasks({
          engagementId,
          taskIds: selectedTasks,
          action: bulkEditAction,
          status: bulkStatusValue,
          dateDue: bulkDueValue,
          folderId: bulkFolderValue,
          assigneeId: bulkAssigneeValue,
          tags: tempSelectedTags,
          tagAction: bulkTagAction
        });

        if (updatedTasks) {
          updatedTasks.forEach(updatedTask => tasksMap[updatedTask.task_id] = updatedTask);
          if (bulkEditAction === 'folder') {
            setSelectedTasks([]);
          }
          setTasks(Object.values(tasksMap));
          setStatusMenuAnchor(null);
          setAssigneeMenuAnchor(null);
          setDateDueMenuAnchor(null);
          setBulkEditAction(null);
          setTempSelectedTags([]);
          setTagsMenuAnchor(null);
          setFolderMenuAnchor(null);
          setBulkFolderValue(null);
          setDoUpdate(false);
          openSnackBar(`Updated ${updatedTasks.length} tasks.`, 'success');
        } else {
          setDoUpdate(false);
          openSnackBar(message, 'error');
        }
      } catch (error) {
        setDoUpdate(false);
        openSnackBar(error.message, 'error');
      }
    }

    if (doUpdate) {
      if (isBulkEditMode) {
        handleBulkUpdateTasks();
      } else {
        handleUpdateTask();
      }
    }
  }, [doUpdate]);

  const handleSelectAll = (_, isChecked) => {
    if (isChecked) {
      setSelectedTasks(folderTasks.map(({ task_id }) => task_id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleTaskSelection = taskId => {
    if (isBulkEditMode) {
      if (selectedTasks.includes(taskId)) {
        setSelectedTasks(selectedTasks.filter(id => id !== taskId));
      } else {
        setSelectedTasks(taskIds => [...taskIds, taskId]);
      }
    }
  };

  const handleEditNameClick = task => {
    setEditingTask(task);
    setEditingName(true);
  };

  const handleStatusClick = (e, task) => {
    if (!isBulkEditMode) {
      setEditingTask(task);
    }

    setStatusMenuAnchor(e.currentTarget);
  };

  const handleAssigneeClick = (e, task) => {
    if (!isBulkEditMode) {
      setEditingTask(task);

      setTempAssignee(
        task.assigned_to_id ?
          {
            id: task.assigned_to_id,
            firstName: task.assigned_first,
            lastName: task.assigned_last
          } :
          null
      );
    }

    setAssigneeMenuAnchor(e.currentTarget);
  };

  const handleAssignToMe = () => {
    if (!isBulkEditMode) {
      setEditingTask({
        ...editingTask,
        assigned_to_id: user.id,
        assigned_first: user.firstName,
        assigned_last: user.lastName
      });
      setAssigneeMenuAnchor(null);
    } else {
      setBulkEditAction('assignee');
      setBulkAssigneeValue(user.id);
    }
    setDoUpdate(true);
  };

  const handleAssigneeChange = (_, newVal) => {
    if (newVal) {
      if (!isBulkEditMode) {
        setEditingTask({
          ...editingTask,
          assigned_to_id: newVal.id,
          assigned_first: newVal.firstName,
          assigned_last: newVal.lastName
        });
        setAssigneeMenuAnchor(null);
      } else {
        setBulkEditAction('assignee');
        setBulkAssigneeValue(newVal.id);
      }

      setDoUpdate(true);
    }
  };

  const handleClearAssignee = () => {
    if (!isBulkEditMode) {
      setEditingTask({
        ...editingTask,
        assigned_to_id: null,
        assigned_first: null,
        assigned_last: null
      });
      setAssigneeMenuAnchor(null);
    } else {
      setBulkEditAction('assignee');
      setBulkAssigneeValue(null);
    }


    setDoUpdate(true);
  };

  const handleClearDateDue = () => {
    if (!isBulkEditMode) {
      setEditingTask({ ...editingTask, date_due: null });
      setDateDueMenuAnchor(null);
    } else {
      setBulkEditAction('dateDue');
      setBulkDueValue(null);
    }

    setDoUpdate(true);
  };

  const handleDateDueClick = (e, task) => {
    if (!isBulkEditMode) {
      setEditingTask(task);
    }

    setDateDueMenuAnchor(e.currentTarget);
  };

  const handleToggleKeyTask = (task) => {
    setEditingTask({ ...task, is_key_task: !task.is_key_task });
    setDoUpdate(true);
  };

  const handleNameSubmit = e => {
    if (e && e.key === 'Enter') {
      if (!nameRef.current.value) {
        openSnackBar('Task name cannot be empty.');
        return;
      } else {
        e.preventDefault();
        setEditingTask({ ...editingTask, task_name: nameRef.current.value });
        setDoUpdate(true);
      }
    }
  };

  const handleStatusSubmit = (newStatus) => {
    if (!isBulkEditMode) {
      setEditingTask({ ...editingTask, status: newStatus });
      setStatusMenuAnchor(null);
    } else {
      setBulkEditAction('status');
      setBulkStatusValue(newStatus);
    }

    setDoUpdate(true);
  };

  const handleDateDueSubmit = newDate => {
    if (!isBulkEditMode) {
      setEditingTask({ ...editingTask, date_due: newDate.toISOString() });
      setDateDueMenuAnchor(null);
    } else {
      setBulkEditAction('dateDue');
      setBulkDueValue(newDate.toISOString());
    }

    setDoUpdate(true);
  };

  const handleAddTagClick = (e, task) => {
    if (!isBulkEditMode) {
      setEditingTask(task);
    }

    setTagsMenuAnchor(e.currentTarget);
  };

  const handleCreateTag = async e => {
    const newTagValue = e.target.value;

    if (newTagValue) {
      const result = await createTag({
        name: newTagValue,
        engagementId
      });

      if (result.success) {
        const newTag = result.tag;
        setTags(tags => [...tags, newTag]);
        setTempSelectedTags(tags => [...tags, newTag]);
      } else {
        openSnackBar(result.message, 'error');
      }
    }
  };

  const handleTagsSubmit = () => {
    if (!isBulkEditMode) {
      setTagsMenuAnchor(null);
    }

    if (tempSelectedTags.length) {
      if (isBulkEditMode) {
        setBulkEditAction('tags');
      }
      setDoUpdate(true);
    }
  };

  const handleRemoveTag = async (tagId, task) => {
    setTagIdToRemove(Number(tagId));
    setEditingTask(task);
    setDoUpdate(true);
  };

  const handleFolderSubmit = (_, folderVal) => {
    if (folderVal) {
      setBulkFolderValue(folderVal.id);
      setBulkEditAction('folder');
      setDoUpdate(true);
    }
  };

  const resetFilters = () => {
    setFilterName('');
    setFilterTags([]);
    setFilterAssignedTo(null);
    setFilterStatus('all');
  };

  useEffect(() => {
    if (isEditingName) {
      nameRef.current.focus();
      nameRef.current.setSelectionRange(1000, 1000);
    }
  }, [isEditingName]);

  useEffect(() => {
    if (doAction) {
      if (doAction === 'quickview') {
        const taskCopy = { ...editingTask };
        openDrawer('task', { taskProp: taskCopy });
      } else if (doAction === 'deleteTask') {
        openModal('delete-tasks', { taskIds: [editingTask.task_id] });
      }

      setDoAction(null);
      setEditingTask(null);
    }
  }, [doAction]);

  const handleBulkEditChange = () => {
    setSelectedTasks([]);
    setBulkEditMode(prev => !prev);
  };

  const handleOpenTaskContextMenu = (e, task) => {
    e.preventDefault();
    setEditingTask(task);
    setTaskActionsMenuAnchor(e.currentTarget);
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  const rowWrapperClass = `row-wrapper ${isBulkEditMode ? 'edit-mode' : ''}`;

  return (
    <Grid item xs={9.5}>
      <Paper className="folder-tasks-wrapper">
        <Box className="folder-tasks-header">
          <h4 style={{ fontSize: '1.15rem' }}>{folder.name}</h4>
        </Box>
        <Box className="flex-ac folder-tasks-controls">
          <Box className="flex-ac" gap='4px'>
            <Tooltip title="Toggle bulk edit" placement="top">
              <IconButton onClick={handleBulkEditChange} color={isBulkEditMode ? 'primary' : ''}>
                <EditNoteRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={showFilters ? 'Hide filters' : 'Show filters'}
              placement="top">
              <Button
                endIcon={<ExpandMoreIcon
                  style={{
                    transform: showFilters ? 'rotate(-180deg)' : 'rotate(0)',
                    transition: 'transform 250ms'
                  }}
                />}
                onClick={() => setShowFilters(old => !old)}
                style={{
                  color: filterCount === 0 ? theme.palette.text.secondary : theme.palette.primary.main
                }}
                startIcon={<FilterAltRoundedIcon />}>
                {
                  filterCount === 0 ? 'All tasks' : `${filterCount} filters`
                }
              </Button>
            </Tooltip>
          </Box>
          <Divider
            hidden={!isBulkEditMode}
            flexItem
            orientation="vertical"
            style={{ margin: '4px 12px' }} />
          <Box
            hidden={!isBulkEditMode}
            component="span"
            className="tasks-selected-count">
            {selectedTasks.length} selected
          </Box>
          <Box className="task-bulk-actions flex-ac" hidden={!isBulkEditMode}>
            <Box className="flex-ac" gap='4px'>
              <LoadingButton
                loading={bulkEditAction === 'status'}
                onClick={handleStatusClick}
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<TaskAltOutlinedIcon />}>
                Status
              </LoadingButton>
              <LoadingButton
                loading={bulkEditAction === 'assignee'}
                onClick={handleAssigneeClick}
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<PersonOutlineOutlinedIcon />}>
                Assignee
              </LoadingButton>
              <LoadingButton
                loading={bulkEditAction === 'dateDue'}
                onClick={handleDateDueClick}
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<CalendarTodayOutlinedIcon />}>
                Due
              </LoadingButton>
              <LoadingButton
                loading={bulkEditAction === 'tags'}
                onClick={handleAddTagClick}
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<LocalOfferOutlinedIcon />}>
                Tags
              </LoadingButton>
            </Box>
            <Box className="flex-ac" gap='5px'>
              <LoadingButton
                loading={bulkEditAction === 'folder'}
                onClick={e => setFolderMenuAnchor(e.currentTarget)}
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<ShortcutRoundedIcon />}>
                Move
              </LoadingButton>
              <Button
                onClick={() => openModal('delete-tasks', { taskIds: selectedTasks })}
                disabled={selectedTasks.length === 0}
                style={{ marginRight: '15px' }}
                size="small"
                color="error"
                startIcon={<DeleteOutlineOutlinedIcon />}>
                Delete
              </Button>
            </Box>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box
            gap={2}
            className="flex-ac filters-row"
            style={{ padding: '6px 22px 5px 22px' }}>
            <Tooltip title="Reset filters">
              <span>
                <IconButton
                  onClick={resetFilters}
                  disabled={filterCount === 0}
                  size="small"
                  style={{ marginRight: '-10px' }}>
                  <ReplayRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
            <TextField
              size="small"
              placeholder='Name ...'
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            />
            <Divider flexItem orientation="vertical" />
            <FormControl style={{ width: 140 }}>
              <InputLabel size="small">Status</InputLabel>
              <Select
                style={{ fontSize: 14 }}
                value={filterStatus}
                label="Status"
                size="small"
                onChange={e => setFilterStatus(e.target.value)}>
                <MenuItem
                  style={{ fontSize: 14 }}
                  value='all'>All</MenuItem>
                <Divider />
                {
                  statuses.map(({ name }) =>
                    <MenuItem
                      key={name}
                      value={name}>
                      <Chip
                        size="small"
                        className={name}
                        label={name}
                        style={{ cursor: 'pointer' }}>
                      </Chip>

                    </MenuItem>)
                }
              </Select>
            </FormControl>
            <Divider flexItem orientation="vertical" />
            <FormControl style={{ width: 185 }}>
              <Autocomplete
                ListboxProps={{
                  style: {
                    fontSize: 14
                  }
                }}
                size="small"
                renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                options={[...engagementAdmins, ...engagementMembers]}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => option.role}
                onChange={(_, newVal) => setFilterAssignedTo(newVal)}
                value={filterAssignedTo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Assignee ..."
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
              />
            </FormControl>
            <Divider flexItem orientation="vertical" />
            <FormControl style={{
              flexGrow: 1,
              maxWidth: 275,
              minWidth: 200
            }}>
              <Autocomplete
                ListboxProps={{
                  style: {
                    fontSize: 14
                  }
                }}
                multiple
                options={tags}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                disableCloseOnSelect
                size="small"
                onChange={(_, newVal) => setFilterTags(newVal)}
                value={filterTags}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment:
                        <>
                          <InputAdornment position='start'>
                            <LocalOfferOutlinedIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Collapse>

        <TransitionGroup
          className="folder-tasks-table">
          <Collapse in={false}>
            <Box className="table-header">
              <Box className={rowWrapperClass}>
                <Box className="task-select-cell">
                  <Checkbox size="small"
                    onChange={handleSelectAll}
                    checked={selectedTasks.length === folderTasks.length && folderTasks.length > 0}
                  />
                </Box>
                <Box
                  placement="top"
                  component={Tooltip}
                  title="Sort name"
                  onClick={() => setSortBy('name')}
                  className="task-name-cell"
                  style={{ paddingLeft: 45 }}>
                  <Box className="flex-ac">
                    Name <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box>
                </Box>
                <Box
                  placement="top-start"
                  component={Tooltip}
                  title="Sort status"
                  className="task-status-cell"
                  onClick={() => setSortBy('status')}>
                  <Box className="flex-ac">
                    Status <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box>
                </Box>
                <Box
                  placement="top-start"
                  component={Tooltip}
                  title="Sort assignee"
                  className="task-assigned-cell"
                  onClick={() => setSortBy('assignee')}>
                  <Box className="flex-ac">
                    Assignee <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box>
                </Box>
                <Box
                  placement="top-start"
                  component={Tooltip}
                  title="Sort due date"
                  className="task-due-cell"
                  onClick={() => setSortBy('dateDue')}>
                  <Box className="flex-ac" textAlign='center'>
                    Due <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box>
                </Box>
                <Box
                  style={{ cursor: 'default' }}
                  className="task-tags-cell"
                  textAlign='center'>
                  Tags
                </Box>
              </Box>
            </Box>
          </Collapse>
          {
            folderTasks.map((task) => {
              let dateDueText = '...';
              let dateDueColor = 'inherit';

              if (task.date_due) {
                const dateDue = moment(task.date_due);

                if (dateDue.isSame(now, 'day')) {
                  dateDueText = 'Today';
                  dateDueColor = '#ed6c02';
                } else if (dateDue.isSame(tomorrow, 'day')) {
                  dateDueColor = '#0293e3';
                  dateDueText = 'Tomorrow';
                } else if (dateDue.isBefore(now, 'day')) {
                  dateDueText = dateDue.format('MMM Do');
                  dateDueColor = 'error';
                } else {
                  dateDueText = dateDue.format('MMM Do');
                }
              }

              const tagsArray = task.tags?.split(',').filter(Boolean) || [];
              const isSelectedRow = selectedTasks.includes(task.task_id);

              const taskIsBeingEditted = editingTask?.task_id === task.task_id;

              let taskName = (taskIsBeingEditted ? editingTask : task).task_name;
              if (taskName.length > 100) {
                taskName = taskName.substring(0, 100) + '...';
              }

              return (
                <Collapse
                  unmountOnExit
                  onContextMenu={e => handleOpenTaskContextMenu(e, task)}
                  onClick={() => handleTaskSelection(task.task_id)}
                  key={task.task_id}
                  className={isSelectedRow ? 'selected' : ''}
                  style={{ position: 'relative', }}>
                  <Box
                    className={
                      `table-row ${rowWrapperClass} ${isSelectedRow ? 'selected' : ''}`
                    }>
                    <Box className="task-select-cell">
                      <Checkbox checked={isSelectedRow} size="small" />
                    </Box>
                    <Box className="task-name-cell" style={{ paddingLeft: 5 }}>
                      <Box className="flex-ac" gap="5px" position='relative'>
                        <Box className="key-task-cell">
                          {
                            task.is_key_task ?
                              <Tooltip title="Toggle key task">
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleKeyTask(task)}>
                                  <StarIcon
                                    style={{ fontSize: 16 }}
                                    htmlColor="gold"
                                  />
                                </IconButton>
                              </Tooltip>
                              :
                              <Tooltip title="Toggle key task">
                                <IconButton
                                  onClick={() => handleToggleKeyTask(task)}
                                  size="small"
                                  className="set-key-task-btn" >
                                  <StarOutlineOutlinedIcon
                                    style={{ fontSize: 16 }}
                                  />
                                </IconButton>
                              </Tooltip>
                          }
                        </Box>
                        {
                          isEditingName && editingTask.task_id === task.task_id ?
                            <TextField
                              multiline
                              variant="standard"
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  padding: '0 8px'
                                }
                              }}
                              fullWidth
                              size="small"
                              inputRef={nameRef}
                              defaultValue={editingTask.task_name}
                              onKeyDown={handleNameSubmit}
                            />
                            :
                            <>
                              <Box
                                className="name-text"
                                width='100%'
                                onClick={() => handleEditNameClick(task)}>
                                {taskName}
                              </Box>
                              <EditRoundedIcon
                                fontSize="small"
                                className="edit-icon"
                              />
                            </>
                        }
                      </Box>
                    </Box>
                    <Box className="task-status-cell">
                      <Chip
                        size="small"
                        label={task.status}
                        onClick={e => handleStatusClick(e, task)}
                        className={task.status}>
                      </Chip>
                    </Box>
                    <Box className="task-assigned-cell">
                      {
                        task.assigned_to_id ?
                          <Tooltip title={`${task.assigned_first} ${task.assigned_last}`}>
                            <IconButton
                              onClick={e => handleAssigneeClick(e, task)}
                              size="small"
                              className="assigned-btn">
                              {
                                <Avatar>
                                  {task.assigned_first[0]}{task.assigned_last[0]}
                                </Avatar>
                              }
                            </IconButton>
                          </Tooltip>
                          :
                          <Tooltip title="Assign task">
                            <IconButton
                              onClick={e => handleAssigneeClick(e, task)}
                              size="small"
                              className="unassigned-btn">
                              <PersonOutlineIcon />
                            </IconButton>
                          </Tooltip>
                      }

                    </Box>
                    <Box className="task-due-cell">
                      <Box className="flex-ac" position='relative'>
                        <Typography
                          onClick={e => handleDateDueClick(e, task)}
                          className="due-text"
                          color={dateDueColor}>
                          {
                            dateDueText
                          }
                        </Typography>
                        <EditRoundedIcon
                          fontSize="small"
                          className="edit-icon"
                        />
                      </Box>
                    </Box>
                    <Box className="task-tags-cell">{
                      tagsArray.map(tagId =>
                        <Chip
                          deleteIcon={
                            <Tooltip title="Remove tag">
                              <CancelIcon />
                            </Tooltip>
                          }
                          onDelete={() => handleRemoveTag(tagId, task)}
                          className="chip"
                          key={tagId}
                          label={tagsMap[tagId].name}
                          size="small"
                        />)}
                      <Chip
                        className="new-chip"
                        size="small"
                        variant="outlined"
                        label='+ Tags'
                        onClick={e => handleAddTagClick(e, task)}
                      />
                    </Box>
                  </Box>
                </Collapse>
              );
            })
          }
        </TransitionGroup>
      </Paper>

      <Menu
        PaperProps={{
          className: 'folders-menu'
        }}
        anchorEl={folderMenuAnchor}
        open={folderMenuOpen}
        onClose={() => {
          setFolderMenuAnchor(null);
        }}>
        <Box mx={1}>
          <FormControl fullWidth>
            <Autocomplete
              disabled={bulkEditAction === 'folder'}
              ListboxProps={{
                className: 'folders-menu-list'
              }}
              size="small"
              options={folders}
              value={null}
              renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleFolderSubmit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  placeholder='Choose folder'
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      fontSize: 14
                    },
                    autoFocus: true
                  }}
                />
              )}
            />
          </FormControl>
        </Box>
      </Menu>

      <Menu
        PaperProps={{
          className: 'tags-menu'
        }}
        anchorEl={tagsMenuAnchor}
        open={tagsMenuOpen}
        onClose={() => {
          setTagsMenuAnchor(null);
          setTimeout(() => {
            setEditingTask(null);
            setTempSelectedTags([]);
          }, 250);
        }}>
        <Box mx={1}>
          <FormControl fullWidth>
            <Autocomplete
              disabled={bulkEditAction === 'tags'}
              ListboxProps={{
                className: 'tags-menu-list'
              }}
              size="small"
              multiple
              value={tempSelectedTags}
              options={isBulkEditMode ? tags : availableTags}
              renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              disableCloseOnSelect
              onKeyDown={e => e.key === 'Enter' ? handleCreateTag(e) : null}
              onChange={(_, newVal) => setTempSelectedTags(newVal)}
              componentsProps={{
                popper: {
                  placement: 'top'
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  placeholder='Add tags'
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      fontSize: 14
                    },
                    autoFocus: true
                  }}
                />
              )}
            />
          </FormControl>
          <Box display='flex' alignItems='start' justifyContent='space-between' mt={.5}>
            <FormHelperText>
              "&#x23CE;" to create new
            </FormHelperText>
            <Box display='flex' alignItems='baseline'>
              <Box mr={1} hidden={!isBulkEditMode}>
                <Typography variant="caption">
                  Remove&nbsp;
                </Typography>
                <Checkbox
                  disabled={bulkEditAction === 'tags'}
                  style={{ padding: 0 }}
                  size="small"
                  onChange={(_, isChecked) => setBulkTagAction(isChecked ? 'remove' : 'add')}
                />
              </Box>
              <Button
                disabled={tempSelectedTags.length === 0 || bulkEditAction === 'tags'}
                onClick={handleTagsSubmit}
                size="small">
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Menu>

      <Menu
        className="task-actions-menu"
        anchorPosition={{
          top: mouseY,
          left: mouseX
        }}
        anchorReference="anchorPosition"
        open={taskActionsMenuOpen}
        onClose={() => {
          setTaskActionsMenuAnchor(null);
          setEditingTask(null);
        }}>
        <MenuItem
          dense
          onClick={() => {
            setDoAction('quickview');
            setTaskActionsMenuAnchor(null);
          }}>
          <EastRoundedIcon fontSize="small" />
          Quick view
        </MenuItem>
        <MenuItem
          style={{ color: 'inherit' }}
          dense
          component={Link}
          to={`../tasks/${editingTask?.task_id}`}>
          <FullscreenOutlinedIcon fontSize="small" />
          Full view
        </MenuItem>
        <Divider className="m0" />
        {
          editingTask?.link_url ?
            <Box>
              <MenuItem
                onClick={() => {
                  setTaskActionsMenuAnchor(null);
                  setEditingTask(null);
                }}
                style={{ color: 'inherit' }}
                dense
                component="a"
                href={editingTask.link_url} target="_blank">
                <OpenInNewIcon
                  fontSize="small"
                  style={{ fontSize: 17, width: 20 }} />
                Open resource
              </MenuItem>
              <Divider className="m0" />
            </Box>
            :
            null
        }
        <MenuItem
          dense
          onClick={() => {
            setDoAction('deleteTask');
            setTaskActionsMenuAnchor(null);
          }}>
          <ListItemText
            inset
            color="error">
            <Typography color="error" component="span">
              Delete task
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={dateDueMenuAnchor}
        open={dateDueMenuOpen}
        onClose={() => {
          setDateDueMenuAnchor(null);
          setEditingTask(null);
        }}>
        <Box>
          <Box textAlign='right' mb={-2}>
            <Button
              disabled={bulkEditAction === 'dateDue'}
              onClick={handleClearDateDue}
              style={{ marginRight: '5px' }}>
              clear
            </Button>
          </Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
              disabled={bulkEditAction === 'dateDue'}
              value={editingTask?.date_due}
              renderInput={() => { }}
              onChange={handleDateDueSubmit}
              displayStaticWrapperAs="desktop"
            />
          </LocalizationProvider>
        </Box>
      </Menu>

      <Menu
        PaperProps={{
          className: 'assignee-menu'
        }}
        anchorEl={assigneeMenuAnchor}
        open={assigneeMenuOpen}
        onClose={() => {
          setTempAssignee(null);
          setEditingTask(null);
          setAssigneeMenuAnchor(null);
        }}>
        <Box mx={1}>
          <FormControl fullWidth>
            <Autocomplete
              disabled={bulkEditAction === 'assignee'}
              ListboxProps={{
                className: 'assignee-menu-list'
              }}
              size="small"
              options={membersAndAdmins}
              renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              groupBy={(option) => option.role}
              onChange={handleAssigneeChange}
              value={tempAssignee}
              renderInput={(params) => (
                <TextField
                  autoFocus
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      fontSize: 14
                    }
                  }}
                  placeholder="Assignee"
                />
              )}
            />
          </FormControl>
          <Box className="flex-ac" justifyContent='space-between' mt={0.25}>
            <Button
              disabled={bulkEditAction === 'assignee'}
              onClick={handleAssignToMe}
              size="small"
              color="secondary">
              Assign to me
            </Button>
            <Button
              disabled={bulkEditAction === 'assignee'}
              onClick={handleClearAssignee}
              hidden={!isBulkEditMode && !editingTask?.assigned_to_id}
              size="small">
              Unassign
            </Button>
          </Box>
        </Box>
      </Menu>

      <Menu
        anchorEl={statusMenuAnchor}
        open={statusMenuOpen}
        onClose={() => {
          setStatusMenuAnchor(null);
          setEditingTask(null);
        }}>
        {
          statuses.map(({ name }) => {
            return (
              <MenuItem
                disabled={bulkEditAction === 'status'}
                selected={name === editingTask?.status}
                key={name}
                onClick={() => handleStatusSubmit(name)}>
                <Chip
                  size="small"
                  label={name}
                  className={name}
                  style={{ cursor: 'pointer' }}
                />
              </MenuItem>
            );
          })
        }
      </Menu>
    </Grid>
  );
}
