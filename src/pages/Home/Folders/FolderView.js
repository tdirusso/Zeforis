/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Paper, Checkbox, Box, Tooltip, IconButton, Chip, Typography, TextField, Menu, MenuItem, Avatar, FormControl, Autocomplete, Button, Divider, ListItemText, FormHelperText, Collapse, List, ListItem, Grow, Slide, Zoom } from "@mui/material";
import './styles.scss';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import { updateTask } from "../../../api/tasks";
import { createTag } from "../../../api/tags";
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from "react-transition-group";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';

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
    openModal
  } = useOutletContext();

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
  const [tempAssignee, setTempAssignee] = useState(null);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [tagIdToRemove, setTagIdToRemove] = useState(null);
  const [doUpdate, setDoUpdate] = useState(false);
  const [doAction, setDoAction] = useState(null);

  const folderTasks = useMemo(() => {
    const theTasks = folder.tasks;

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
  }, [sortBy, folder]);

  const statusMenuOpen = Boolean(statusMenuAnchor);
  const assigneeMenuOpen = Boolean(assigneeMenuAnchor);
  const dateDueMenuOpen = Boolean(dateDueMenuAnchor);
  const taskActionsMenuOpen = Boolean(taskActionsMenuAnchor);
  const tagsMenuOpen = Boolean(tagsMenuAnchor);

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

    if (doUpdate) {
      handleUpdateTask();
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
    setEditingTask(task);
    setStatusMenuAnchor(e.currentTarget);
  };

  const handleAssigneeClick = (e, task) => {
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
    setAssigneeMenuAnchor(e.currentTarget);
  };

  const handleAssignToMe = () => {
    setEditingTask({
      ...editingTask,
      assigned_to_id: user.id,
      assigned_first: user.firstName,
      assigned_last: user.lastName
    });
    setAssigneeMenuAnchor(null);
    setDoUpdate(true);
  };

  const handleAssigneeChange = (_, newVal) => {
    if (newVal) {
      setEditingTask({
        ...editingTask,
        assigned_to_id: newVal.id,
        assigned_first: newVal.firstName,
        assigned_last: newVal.lastName
      });
      setAssigneeMenuAnchor(null);
      setDoUpdate(true);
    }
  };

  const handleClearAssignee = () => {
    setEditingTask({
      ...editingTask,
      assigned_to_id: null,
      assigned_first: null,
      assigned_last: null
    });
    setAssigneeMenuAnchor(null);
    setDoUpdate(true);
  };

  const handleClearDateDue = () => {
    setEditingTask({ ...editingTask, date_due: null });
    setDateDueMenuAnchor(null);
    setDoUpdate(true);
  };

  const handleDateDueClick = (e, task) => {
    setEditingTask(task);
    setDateDueMenuAnchor(e.currentTarget);
  };

  const handleTaskMoreClick = (e, task) => {
    setEditingTask(task);
    setTaskActionsMenuAnchor(e.currentTarget);
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
    setEditingTask({ ...editingTask, status: newStatus });
    setStatusMenuAnchor(null);
    setDoUpdate(true);
  };

  const handleDateDueSubmit = newDate => {
    setEditingTask({ ...editingTask, date_due: newDate.toISOString() });
    setDateDueMenuAnchor(null);
    setDoUpdate(true);
  };

  const handleAddTagClick = (e, task) => {
    setEditingTask(task);
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
    if (tempSelectedTags.length) {
      setDoUpdate(true);
    }

    setTagsMenuAnchor(null);
  };

  const handleRemoveTag = async (tagId, task) => {
    setTagIdToRemove(Number(tagId));
    setEditingTask(task);
    setDoUpdate(true);
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
    }
  }, [doAction]);

  const handleBulkEditChange = () => {
    setSelectedTasks([]);
    setBulkEditMode(prev => !prev);
  };

  const rowWrapperClass = `row-wrapper ${isBulkEditMode ? 'edit-mode' : ''}`;

  return (
    <Grid item xs={9.5}>
      <Paper className="folder-tasks-wrapper">
        <Box className="folder-tasks-header">
          <h4>{folder.name}</h4>
        </Box>
        <Box className="flex-ac folder-tasks-controls">
          <Box className="flex-ac" gap='4px'>
            <Tooltip title="Toggle bulk edit" placement="top">
              <IconButton onClick={handleBulkEditChange} color={isBulkEditMode ? 'primary' : ''}>
                <EditNoteRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Filter"
              placement="top">
              <Button
                style={{ color: 'inherit' }}
                startIcon={<FilterAltOutlinedIcon />}>
                All tasks
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
              <Button
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<TaskAltOutlinedIcon />}>
                Status
              </Button>
              <Button
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<PersonOutlineOutlinedIcon />}>
                Assignee
              </Button>
              <Button
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<CalendarTodayOutlinedIcon />}>
                Due
              </Button>
              <Button
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<FolderOutlinedIcon />}>
                Folder
              </Button>
              <Button
                disabled={selectedTasks.length === 0}
                size="small"
                startIcon={<LocalOfferOutlinedIcon />}>
                Tags
              </Button>
            </Box>
            <Button
              disabled={selectedTasks.length === 0}
              style={{ marginRight: '15px' }}
              size="small"
              color="error"
              startIcon={<DeleteOutlineOutlinedIcon />}>
              Delete
            </Button>
          </Box>
        </Box>

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
                  onClick={() => handleTaskSelection(task.task_id)}
                  key={task.task_id}
                  className={isSelectedRow ? 'selected' : ''}
                  style={{ position: 'relative', }}>
                  <Box className={`table-row ${rowWrapperClass} ${isSelectedRow ? 'selected' : ''}`}>
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
                        deleteIcon={<MoreVertIcon fontSize="small" />}
                        onClick={e => handleStatusClick(e, task)}
                        onDelete={e => handleStatusClick(e, task)}
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
                    <Box className="task-more-cell">
                      <Tooltip title="More">
                        <IconButton
                          size="small"
                          onClick={e => handleTaskMoreClick(e, task)}>
                          <MoreVertIcon
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>
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
          className: 'tags-menu'
        }}
        anchorEl={tagsMenuAnchor}
        open={tagsMenuOpen}
        onClose={() => {
          setTagsMenuAnchor(null);
          setTimeout(() => {
            setTempSelectedTags([]);
          }, 250);
        }}>
        <Box mx={1}>
          <FormControl fullWidth>
            <Autocomplete
              ListboxProps={{
                className: 'tags-menu-list'
              }}
              size="small"
              multiple
              value={tempSelectedTags}
              options={availableTags}
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
            <Button
              onClick={handleTagsSubmit}
              size="small">
              Save
            </Button>
          </Box>
        </Box>
      </Menu>

      <Menu
        className="task-actions-menu"
        anchorEl={taskActionsMenuAnchor}
        open={taskActionsMenuOpen}
        onClose={() => setTaskActionsMenuAnchor(null)}>
        <MenuItem
          dense
          onClick={() => {
            setDoAction('quickview');
            setTaskActionsMenuAnchor(null);
          }}>
          <EastRoundedIcon fontSize="small" />
          Quick view
        </MenuItem>
        <MenuItem dense>
          <FullscreenOutlinedIcon fontSize="small" />
          Full view
        </MenuItem>
        <Divider className="m0" />
        {
          editingTask?.link_url ?
            <Box>
              <MenuItem
                onClick={() => setTaskActionsMenuAnchor(null)}
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
        onClose={() => setDateDueMenuAnchor(null)}>
        <Box>
          <Box textAlign='right' mb={-2}>
            <Button
              onClick={handleClearDateDue}
              style={{ marginRight: '5px' }}>
              clear
            </Button>
          </Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
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
        onClose={() => setAssigneeMenuAnchor(null)}>
        <Box mx={1}>
          <FormControl fullWidth>
            <Autocomplete
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
              onClick={handleAssignToMe}
              size="small"
              color="secondary">
              Assign to me
            </Button>
            <Button
              onClick={handleClearAssignee}
              hidden={!editingTask?.assigned_to_id}
              size="small">
              clear
            </Button>
          </Box>
        </Box>
      </Menu>

      <Menu
        anchorEl={statusMenuAnchor}
        open={statusMenuOpen}
        onClose={() => setStatusMenuAnchor(null)}>
        {
          statuses.map(({ name }) => {
            return (
              <MenuItem
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
    </Grid >
  );
}
