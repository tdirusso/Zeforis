import { Box, Chip, InputAdornment, Menu, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { createTag, deleteTag, updateTag } from "../../../../api/tags";
import { LoadingButton } from "@mui/lab";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isMobile } from "../../../../lib/constants";
import { AppContext } from "src/types/AppContext";
import { Tag } from "@shared/types/Tag";

type TaskTagCounts = {
  [tagId: string]: number;
};

export default function Tags() {

  const {
    engagement,
    tags,
    openSnackBar,
    tagsMap,
    setTags,
    tasks,
    setTasks
  } = useOutletContext<AppContext>();

  const taskTagCounts: TaskTagCounts = {};

  tasks.forEach(task => {
    if (task.tags) {
      const tagIdsArr = task.tags.split(',');
      tagIdsArr.forEach(tagId => {
        taskTagCounts[tagId] = (taskTagCounts[tagId] || 0) + 1;
      });
    }
  });

  const [editTagMenuAnchor, setEditTagMenuAnchor] = useState<Element | null>(null);
  const [deleteTagMenuAnchor, setDeleteTagMenuAnchor] = useState<Element | null>(null);
  const [newTagMenuAnchor, setNewTagMenuAnchor] = useState<Element | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [updatingTag, setUpdatingTag] = useState(false);
  const [deletingTag, setDeletingTag] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);

  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const editTagMenuOpen = Boolean(editTagMenuAnchor);
  const deleteTagMenuOpen = Boolean(deleteTagMenuAnchor);
  const newTagMenuOpen = Boolean(newTagMenuAnchor);

  const handleEditTag = (e: React.MouseEvent<HTMLDivElement>, tag: Tag) => {
    setTagToEdit(tag);
    setEditingTagName(tag.name);
    setEditTagMenuAnchor(e.currentTarget);
  };

  const handleUpdateTag = async () => {
    if (!editingTagName) {
      openSnackBar('Please enter a tag name.');
      return;
    }

    if (!tagToEdit) {
      return;
    }

    setUpdatingTag(true);

    try {
      const { message, success } = await updateTag({
        name: editingTagName,
        tagId: tagToEdit.id,
        engagementId: engagement.id
      });

      if (success) {
        tagsMap[tagToEdit.id].name = editingTagName;
        setTags(Object.values(tagsMap));
        setUpdatingTag(false);
        setEditTagMenuAnchor(null);
        openSnackBar('Tag successfully updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setUpdatingTag(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setUpdatingTag(false);
        openSnackBar(error.message, 'error');
      }
    }
  };


  const handleDeleteTag = async () => {
    setDeletingTag(true);

    if (!tagToDelete) {
      return;
    }

    try {
      const result = await deleteTag({
        engagementId: engagement.id,
        tagId: tagToDelete.id
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        delete tagsMap[tagToDelete.id];

        const tasksClone = [...tasks];
        tasksClone.forEach(task => {
          if (task.tags) {
            task.tags = task.tags.replace(String(tagToDelete.id), '') || null;
          }
        });

        setTasks(tasksClone);
        setTags(curTags => curTags.filter(t => t.id !== tagToDelete.id));
        setDeletingTag(false);
        setDeleteTagMenuAnchor(null);
        openSnackBar('Successully deleted.', 'success');
      } else {
        openSnackBar(resultMessage, 'error');
        setDeletingTag(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setDeletingTag(false);
      }
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName) {
      openSnackBar('Please enter a name for the new tag.');
      return;
    }

    setCreatingTag(true);

    try {
      const { tag, message } = await createTag({
        name: newTagName,
        engagementId: engagement.id
      });

      if (tag) {
        const newTag = tag;
        setTags(tags => [...tags, newTag]);
        setCreatingTag(false);
        handleCloseNewTagMenu();
        openSnackBar('Successfully created.', 'success');
      } else {
        setCreatingTag(false);
        openSnackBar(message, 'error');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setCreatingTag(false);
        openSnackBar(error.message, 'error');
      }
    }
  };


  const openDeleteTagConfirmation = (e: React.MouseEvent<HTMLButtonElement>, tag: Tag) => {
    setTagToDelete(tag);
    setDeleteTagMenuAnchor(e.currentTarget);
  };

  const handleCloseNewTagMenu = () => {
    setNewTagName('');
    setNewTagMenuAnchor(null);
  };

  return (
    <>
      <Box component="h4">{engagement.name} Tags</Box>
      <Box mt={3}>
        <Box mb={3}>
          <Chip
            color="primary"
            label="New Tag"
            variant="outlined"
            deleteIcon={<AddCircleIcon />}
            onClick={e => setNewTagMenuAnchor(e.currentTarget)}
            onDelete={e => setNewTagMenuAnchor(e.currentTarget)}
          />
        </Box>
        <Box display="flex" flexWrap='wrap'>
          {
            tags.map(tag =>
              <Box
                key={tag.id}
                display="flex"
                flexDirection="column"
                mb={2}>
                <Box>
                  <Chip
                    label={tag.name}
                    style={{
                      marginRight: '1rem'
                    }}
                    onClick={e => handleEditTag(e, tag)}
                    onDelete={e => openDeleteTagConfirmation(e, tag)}
                  />
                </Box>
                <Box position="relative" bottom="3px" left="14px">
                  <Typography
                    color="#b7b7b7"
                    variant="caption">
                    {taskTagCounts[tag.id] || 0} tasks
                  </Typography>
                </Box>
              </Box>
            )
          }
        </Box>
      </Box>

      <Menu
        anchorEl={editTagMenuAnchor}
        open={editTagMenuOpen}
        onClose={() => setEditTagMenuAnchor(null)}>
        <Box px={2} py={1} width={225}>
          <TextField
            autoFocus={!isMobile}
            variant="standard"
            value={editingTagName}
            onChange={e => setEditingTagName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? handleUpdateTag() : null}
            size="small"
            disabled={updatingTag}
            placeholder="Tag name"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">
                <LoadingButton
                  size="small"
                  loading={updatingTag}
                  onClick={handleUpdateTag}>
                  Save
                </LoadingButton>
              </InputAdornment>
            }}>
          </TextField>
        </Box>
      </Menu>

      <Menu
        anchorEl={newTagMenuAnchor}
        open={newTagMenuOpen}
        onClose={handleCloseNewTagMenu}>
        <Box px={2} py={1} width={225}>
          <TextField
            autoFocus={!isMobile}
            variant="standard"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? handleCreateTag() : null}
            size="small"
            disabled={creatingTag}
            placeholder="Tag name"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">
                <LoadingButton
                  size="small"
                  loading={creatingTag}
                  onClick={handleCreateTag}>
                  Create
                </LoadingButton>
              </InputAdornment>
            }}>
          </TextField>
        </Box>
      </Menu>

      <Menu
        anchorEl={deleteTagMenuAnchor}
        open={deleteTagMenuOpen}
        onClose={() => setDeleteTagMenuAnchor(null)}>
        <Box px={2} py={1}>
          <Box>
            <LoadingButton
              disabled={deletingTag}
              size="small"
              color="error"
              loading={deletingTag}
              onClick={handleDeleteTag}
              variant="contained">
              Delete
            </LoadingButton>
          </Box>
        </Box>
      </Menu>
    </>
  );
};
