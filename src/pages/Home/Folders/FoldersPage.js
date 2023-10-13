/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Paper, Typography, Tooltip, TextField, InputAdornment, Collapse } from "@mui/material";
import './styles.scss';
import { Link, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import Divider from '@mui/material/Divider';
import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { TransitionGroup } from 'react-transition-group';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';

export default function FoldersPage() {
  const {
    folders,
    isAdmin,
    openDrawer
  } = useOutletContext();

  const [view, setView] = useState(localStorage.getItem('folderView') || 'card');
  const [query, setQuery] = useState('');

  const handleSetView = (_, newView) => {
    if (newView) {
      localStorage.setItem('folderView', newView);
      setView(newView);
    }
  };

  const keyFolders = [];
  const otherFolders = [];

  folders.filter(folder => !query || folder.name.toLowerCase().includes(query.toLowerCase()))
    .forEach(folder => (folder.is_key_folder ? keyFolders : otherFolders).push(folder));

  return (
    <>
      <Grid item xs className="folders-controls">
        <Box className="flex-ac">
          <Tooltip title="New folder" placement="bottom-end">
            <Box
              hidden={!isAdmin}
              className="new-folder-btn"
              onClick={() => openDrawer('folder')}>
              <img
                width={60}
                alt=""
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEy0lEQVR4nO2bz28bRRTHV5T00CNwA/EHwDGi4hZpN8wa1SUgcMsFEIhyKFJFfHGEKpmgiKRuQrNukWshsWvRgJQckKAVTauCeitSULwQBDHubiFcWloJ4fU+IyoGjV2KMEkc79p+a8/7Sl8pUn7I+/3MvDczO1EUEolEIpFIJBKJRCKRSCQSiUQikUikJlVW33jUKyZPeHZyrWKPe56d5J10xR5/i0LfRHwtvdsrJk9W7OTtTofuEYQdhX+x28F7NBM2lxj5vQzfo3L035rfi7LjEYStRv/4PFb43j8zoZickbYxe/b4d9gAPJlXR14xWcEO35N5JjSHUF2b4P76FPfLsxwcg4Obldq+Y/Bqebbmr09/Xf1+an9XAVRLUxS6uw0QAaM0U+Qr6T0dB+CXj6GPNugT++XMzY5BuDvyI/Bg0EeulqZXOwJA1Hyq9dn2IThZXrs6uS88gHUa/RC0FJVmVkID8Mtz6NMZ+tT+1TkID8CdR38Q6FP7jvFXaADYDwF9bgLgEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKEH4YgGDqAS4BQB+FQDMAPwigEoQfBiCYeoBLANBHIdAMwA8CqAThhwEIph7gEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKUP+46hh81Z7khctH+NFzL/GXl57lY2fiXC88Wbf4+pWl5+rfEz9TtN/mvkM9gIcNfuOHYzx36TA/8PFTXLP0tnzwozGe++J1vrGeoSYMbQZ/vTTLjy8f4noh1nbwzRZ/Y+7Ca/z6j407tbQKcrcP//yVFB9biIcOvtlPL+zny19NEADYIviKM88z51/tePD/s8lOD+eHh+hyrvtv+L+VT/DUpy90P/y7Zufi+Xiwf1nCXpFAF0Z+b8NvWDXZxcRiYrf0ADK9KDtbz4Sc1AA+v5JqO7RWahtCgR2UEsCN0ix/5kwcHYBq6bdGFuIPSAfg+PKhQGWj4zOg0Q/ekwrAxnom8CarSwD+GC2MPiwNgNylw4EbZzcA3ClF01IA8J1s/ZwmagA0k/2SWEzsGngAq/Zk8JC6CaA+C9jegQdQuHwksgBGTTbREoDvZn/HDhFC+OjZF0MFHFbblyF9qTUAx1jDDhFCWLw4iSoA1WLftC5BjvEudogQwq2OmjEBaCb7tSWA2jXjEd8xbmMHCQHdav2PCUC1WK0lgEYfMAzsIEFmAHwlP+S7xgXsMEHGEtQEYd53sn9ihwoyNeHNegI42TnfzX7ru0YFO2AY9GVov0u19DfDbJZCBdzCqsVSyqBr1Iw9HlUA2gexx5RBVzqdvke19J+jBkA19Z/EZ1NkkGrp09EDwN5RZNHIh7GHxEuQqAAQ63/V2vegIpM0i+WiAkAz9ZOKbGLvs/vExgcbgGrqN9t6KT9IUs0nnscHEEsoMksz2emgjTO82SlFdiUWE7s0S/+k1+GrFjs78uXIvdjPHwnF8/E94sJsz8I39c8CX84dVA3nh4eCrozaLTs08reRuKsZZHW0g5JzQ/qGu1NpBe1+cV1QbJA6EHxNrPPFsnfHH4DUkNidimOLIGdH4nfE8YJ0O1ylC2oc4LG94t6OOLMXL07ErWZxnFG3pd/STGbf+V5KnGoGPVj7GyCRo+oGQ60BAAAAAElFTkSuQmCC" />
            </Box>
          </Tooltip>
          <Paper style={{ padding: '4px 2px', borderRadius: '8px' }} className="flex-ac">
            <ToggleButtonGroup
              size="small"
              style={{}}
              value={view}
              exclusive
              onChange={handleSetView}>
              <ToggleButton value="card">
                <Tooltip title="Card view">
                  <GridViewOutlinedIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="list">
                <Tooltip title="List view">
                  <FormatListBulletedOutlinedIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 0.5, mr: 2 }} />
            <TextField
              onChange={e => setQuery(e.target.value)}
              className="readonly-textfield"
              variant="standard"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon htmlColor="#cbcbcb" />
                  </InputAdornment>
                )
              }}
              placeholder="Search"
            />
          </Paper>
        </Box>
      </Grid>


      <Grid item xs={12}>
        <Divider />
      </Grid>
      {
        view === 'list' ?
          <FolderList
            allFolders={folders}
            keyFolders={keyFolders}
            otherFolders={otherFolders}
          />
          :
          <>
            <FolderCards folders={keyFolders} title="Key Folders" />
            <Grid item xs={12} style={{ paddingTop: '1rem' }}>
              <Divider />
            </Grid>
            <FolderCards folders={otherFolders} title="Other Folders" />
          </>
      }
      <Outlet />
    </>
  );
};

function renderNestedFolders(folders, parentFolderId, handleFolderClick, openStates, setOpenStates, depth = 1) {
  depth++;
  const nestedFolders = folders.filter(folder => folder.parent_id === parentFolderId);

  return nestedFolders.map(folder => {
    const hasNestedFolders = folders.some(subfolder => subfolder.parent_id === folder.id);

    return (
      <div key={folder.id}>
        <ListItemButton
          sx={{ pl: 4 * depth }}
          onClick={() => handleFolderClick(folder.id)}>
          {
            hasNestedFolders ?
              (openStates[folder.id] ?
                <ExpandLess className="toggle-icon" /> :
                <ExpandMore className="toggle-icon" />)
              : null
          }
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={folder.name} />
        </ListItemButton>
        {
          hasNestedFolders ?
            <Collapse in={openStates[folder.id]} timeout="auto" unmountOnExit>
              {renderNestedFolders(folders, folder.id, handleFolderClick, openStates, setOpenStates, depth)}
            </Collapse> : null
        }
      </div>
    );
  });
}


function FolderList({ keyFolders, otherFolders, allFolders }) {
  const navigate = useNavigate();

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [dblClickFlag, setDblClickFlag] = useState(false);
  const [openStates, setOpenStates] = useState({});

  const handleFolderClick = (folderId) => {
    if (selectedFolderId === folderId && dblClickFlag === true) {
      navigate(`${folderId}`);
      return;
    }

    setDblClickFlag(true);
    setSelectedFolderId(folderId);
    setOpenStates(prevOpenStates => ({
      ...prevOpenStates,
      [folderId]: !prevOpenStates[folderId],
    }));

    setTimeout(() => {
      setDblClickFlag(false);
    }, 300);
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ px: 0 }}>
        <List
          className="folders-list"
          dense
          component="nav"
          subheader={
            <ListSubheader className="flex-ac">
              <StarIcon htmlColor="gold" style={{ marginRight: '2px' }} />  Key Folders
            </ListSubheader>
          }>
          {
            keyFolders.map(folder => {
              return (
                <FolderListItem
                  name={folder.name}
                  id={folder.id}
                  key={folder.id}
                  selectedFolderId={selectedFolderId}
                  handleFolderClick={handleFolderClick}
                  allFolders={allFolders}
                  openStates={openStates}
                  setOpenStates={setOpenStates}
                />
              );
            })
          }
          <ListSubheader className="flex-ac">
            Other Folders
          </ListSubheader>
          {
            otherFolders.map(folder => {
              return (null
                // <FolderListItem
                //   name={folder.name}
                //   id={folder.id}
                //   key={folder.id}
                //   selectedFolderId={selectedFolderId}
                //   handleFolderClick={handleFolderClick}
                // />
              );
            })
          }
        </List>
      </Paper>
    </Grid>
  );
}

function FolderListItem({ name, id, selectedFolderId, handleFolderClick, allFolders, openStates, setOpenStates }) {
  const hasNestedFolders = allFolders.some(subfolder => subfolder.parent_id === id);

  return (
    <>
      <ListItemButton
        selected={selectedFolderId === id}
        disableRipple
        sx={{ pl: 4 }}
        onClick={() => handleFolderClick(id)}>
        {
          hasNestedFolders ?
            (openStates[id] ?
              <ExpandLess className="toggle-icon" /> :
              <ExpandMore className="toggle-icon" />)
            : null
        }
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
      {
        hasNestedFolders ?
          <Collapse in={openStates[id]} timeout="auto" unmountOnExit>
            {renderNestedFolders(allFolders, id, handleFolderClick, openStates, setOpenStates)}
          </Collapse>
          : null
      }
    </>
  );
}


function FolderCards({ folders, title }) {
  return (
    <Grid item xs={12}>
      <Box component="h6" className="flex-ac" mb={1}>
        {title.includes('Key') ?
          <StarIcon htmlColor="gold" style={{ marginRight: '2px' }} /> : null}
        {title}
      </Box>
      {folders.length === 0 ?
        <Grid item xs={12}>
          <Typography>No {title.toLowerCase()}.</Typography>
        </Grid>
        :
        <TransitionGroup className="folders-transition-group">
          {folders.map((folder) => {
            let folderName = folder.name;

            if (folderName.length > 23) {
              folderName = folderName.substring(0, 23) + '...';
            }

            return (
              <Collapse
                orientation="horizontal"
                key={folder.id}
                className="folder-transitioner">
                <Link
                  to={`/home/tasks?folderId=${folder.id}`}
                  className="folder-container">
                  <Paper className="folder-item folder-small"></Paper>
                  <Box mt={1} maxWidth={80} style={{ overflowWrap: 'break-word' }}>
                    <Typography variant="body2">{folderName}</Typography>
                  </Box>
                </Link>
              </Collapse>
            );
          })}
        </TransitionGroup>
      }
    </Grid>
  );
}