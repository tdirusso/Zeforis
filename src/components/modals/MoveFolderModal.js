import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { Box, Checkbox, DialogActions, DialogTitle, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { Collapse } from "@mui/material";
import './styles.scss';
import StarIcon from '@mui/icons-material/Star';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { updateFolder } from '../../api/folders';

export default function MoveFolderModal(props) {
  const {
    close,
    isOpen,
    foldersMap,
    moveFolderId,
    folders,
    openSnackBar,
    engagementId,
    setFolders
  } = props;

  const [isLoading, setLoading] = useState(false);
  const [openStates, setOpenStates] = useState({});
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [moveToTop, setMoveToTop] = useState(false);

  const theFolder = foldersMap[moveFolderId];

  const handleMoveFolder = async () => {
    if (!selectedFolderId && !moveToTop) {
      openSnackBar('Select a destination for the folder.');
      return;
    }

    try {
      const { updatedFolder, message } = await updateFolder({
        name: theFolder.name,
        engagementId,
        isKeyFolder: theFolder.is_key_folder,
        parentId: moveToTop ? null : selectedFolderId,
        folderId: moveFolderId
      });

      if (updatedFolder) {
        setLoading(false);
        foldersMap[moveFolderId] = { ...theFolder, ...updatedFolder };
        setFolders(Object.values(foldersMap));
        openSnackBar('Folder updated.', 'success');
        handleClose();
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }

  };

  const handleMoveToTopClick = (_, newVal) => {
    if (newVal === true) {
      setSelectedFolderId(null);
    }

    setMoveToTop(newVal);
  };

  const handleClose = () => {
    close();

    setTimeout(() => {
      setMoveToTop(false);
      setOpenStates({});
      setSelectedFolderId(null);
    }, 500);
  };

  const keyFolders = [];
  const otherFolders = [];

  folders.forEach(folder => {
    if (!folder.parent_id) {
      if (folder.is_key_folder) {
        keyFolders.push(folder);
      } else {
        otherFolders.push(folder);
      }
    }
  });

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className='modal'
      PaperProps={{
        style: {
          minWidth: 425,
          padding: 0
        }
      }}>
      <DialogTitle>
        Move Folder
      </DialogTitle>

      <DialogContent>
        Select destination for {theFolder?.name}:
        <Box
          border='1px solid gainsboro'
          borderRadius='8px'
          padding='8px 0'
          mt={2}>
          <FolderList
            allFolders={folders}
            keyFolders={keyFolders}
            otherFolders={otherFolders}
            openStates={openStates}
            setOpenStates={setOpenStates}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            moveToTop={moveToTop}
          />
        </Box>
        <Box className='flex-ac' mb={1}>
          <Checkbox
            size='small'
            checked={moveToTop}
            onChange={handleMoveToTopClick}
          />
          <Typography variant='body2'>
            Move to top level
          </Typography>
        </Box>

        <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
          <Button
            disabled={isLoading}
            onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            disabled={(!selectedFolderId && !moveToTop) || isLoading}
            variant='contained'
            onClick={handleMoveFolder}
            required
            loading={isLoading}>
            Move
          </LoadingButton>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

function FolderList(props) {
  const {
    keyFolders,
    otherFolders,
    allFolders,
    openStates,
    setOpenStates,
    selectedFolderId,
    setSelectedFolderId,
    moveToTop
  } = props;

  const handleFolderClick = (folderId, hasNestedFolders) => {
    setSelectedFolderId(folderId);
    setOpenStates(prevOpenStates => ({
      ...prevOpenStates,
      [folderId]: !prevOpenStates[folderId],
    }));
  };

  return (
    <List
      style={{
        maxHeight: 400,
        overflow: 'auto'
      }}
      className="folders-list app-scrollable"
      dense
      component="nav"
      subheader={
        <ListSubheader className="flex-ac" disableSticky>
          <StarIcon htmlColor="gold" style={{ marginRight: '2px' }} />  Key Folders
        </ListSubheader>
      }>
      {
        keyFolders.map(folder => {
          return (
            <FolderListItem
              key={folder.id}
              name={folder.name}
              id={folder.id}
              selectedFolderId={selectedFolderId}
              handleFolderClick={handleFolderClick}
              allFolders={allFolders}
              openStates={openStates}
              setOpenStates={setOpenStates}
              moveToTop={moveToTop}
            />
          );
        })
      }
      <ListSubheader className="flex-ac" disableSticky>
        Other Folders
      </ListSubheader>

      {
        otherFolders.map(folder => {
          return (
            <FolderListItem
              key={folder.id}
              name={folder.name}
              id={folder.id}
              selectedFolderId={selectedFolderId}
              handleFolderClick={handleFolderClick}
              allFolders={allFolders}
              openStates={openStates}
              setOpenStates={setOpenStates}
              moveToTop={moveToTop}
            />
          );
        })
      }
    </List>
  );
}

function FolderListItem(props) {
  const {
    name,
    id,
    selectedFolderId,
    handleFolderClick,
    allFolders,
    openStates,
    setOpenStates,
    moveToTop
  } = props;

  const hasNestedFolders = allFolders.some(subfolder => subfolder.parent_id === id);

  return (
    <>
      <ListItemButton
        disabled={moveToTop}
        className="folder-listitem"
        selected={selectedFolderId === id}
        disableRipple
        sx={{ pl: '40px' }}
        onClick={() => handleFolderClick(id, hasNestedFolders)}>
        <ListItemIcon style={{ position: 'relative', minWidth: 34 }}>
          {
            hasNestedFolders ?
              <ChevronRightRoundedIcon
                style={{
                  transform: openStates[id] ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
                className="toggle-icon" />
              : null
          }
          <FolderIcon className="folder-icon" />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
      {
        hasNestedFolders ?
          <Collapse in={openStates[id]} timeout="auto">
            {renderNestedFolders(allFolders, id, handleFolderClick, openStates, setOpenStates, selectedFolderId, moveToTop)}
          </Collapse>
          : null
      }
    </>
  );
}

function renderNestedFolders(folders, parentFolderId, handleFolderClick, openStates, setOpenStates, selectedFolderId, moveToTop, depth = 1) {
  depth++;
  const nestedFolders = folders.filter(folder => folder.parent_id === parentFolderId);

  const indent = (`${36 * depth}px`);

  return (

    nestedFolders.map(folder => {
      const hasNestedFolders = folders.some(subfolder => subfolder.parent_id === folder.id);

      return (
        <Box key={folder.id}>
          <ListItemButton
            disabled={moveToTop}
            className="folder-listitem"
            disableRipple
            selected={selectedFolderId === folder.id}
            sx={{ pl: indent }}
            onClick={() => handleFolderClick(folder.id, hasNestedFolders)}>
            <ListItemIcon style={{ position: 'relative', minWidth: 34 }}>
              {
                hasNestedFolders ?
                  <ChevronRightRoundedIcon
                    style={{ transform: openStates[folder.id] ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    className="toggle-icon" />
                  : null
              }
              <FolderIcon className="folder-icon" />
            </ListItemIcon>
            <ListItemText primary={folder.name} />
          </ListItemButton>
          {
            hasNestedFolders ?
              <Collapse in={openStates[folder.id]} timeout="auto">
                {renderNestedFolders(folders, folder.id, handleFolderClick, openStates, setOpenStates, selectedFolderId, moveToTop, depth)}
              </Collapse> : null
          }
        </Box>
      );
    })
  );
}