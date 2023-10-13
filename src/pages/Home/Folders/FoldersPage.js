/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Paper, Typography, Tooltip, TextField, InputAdornment, Collapse, IconButton, ButtonGroup, Button, CircularProgress } from "@mui/material";
import './styles.scss';
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Divider from '@mui/material/Divider';
import React, { useEffect, useState } from 'react';
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
import FolderIcon from '@mui/icons-material/Folder';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloseIcon from '@mui/icons-material/Close';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import UnfoldLessRoundedIcon from '@mui/icons-material/UnfoldLessRounded';

export default function FoldersPage() {
  const {
    folders,
    isAdmin,
    openDrawer,
    foldersMap
  } = useOutletContext();

  const [view, setView] = useState(localStorage.getItem('folderView') || 'card');
  const [query, setQuery] = useState('');
  const [keyFolders, setKeyFolders] = useState([]);
  const [otherFolders, setOtherFolders] = useState([]);
  const [openStates, setOpenStates] = useState({});
  const [renderReady, setRenderReady] = useState(false);

  const handleSetView = (_, newView) => {
    if (newView) {
      localStorage.setItem('folderView', newView);
      setView(newView);
    }
  };

  const openAllAncestors = (folderId, statesObj) => {
    let currentFolder = foldersMap[folderId];

    while (currentFolder && currentFolder.parent_id) {
      statesObj[currentFolder.parent_id] = true;
      currentFolder = foldersMap[currentFolder.parent_id];
    }

    statesObj[currentFolder.id] = true;
  };

  const openAllChildren = (folderId, statesObj) => {
    const childrenToOpen = [];

    const findChildren = (parentId) => {
      folders.forEach((folder) => {
        if (folder.parent_id === parentId) {
          childrenToOpen.push(folder.id);
          findChildren(folder.id);
        }
      });
    };

    findChildren(folderId);

    childrenToOpen.forEach((childId) => {
      statesObj[childId] = true;
    });

    if (childrenToOpen.length) {
      statesObj[folderId] = true;
    }
  };

  const handleExpandAll = () => {
    const tempOpenStates = {};

    const lcQuery = query?.toLowerCase();

    folders.forEach((folder) => {
      if (lcQuery && folder.name.toLowerCase().includes(lcQuery)) {
        openAllChildren(folder.id, tempOpenStates);
      } else {
        openAllAncestors(folder.id, tempOpenStates);
      }
    });

    setOpenStates(tempOpenStates);
  };

  const handleCollapseAll = () => {
    setOpenStates({});
  };

  useEffect(() => {
    const tempOpenStates = {};
    let filteredKeyFolders = [];
    let filteredOtherFolders = [];

    const lcQuery = query?.toLowerCase();

    (view === 'list' ?
      folders :
      folders.filter(folder => !lcQuery || folder.name.toLowerCase().includes(lcQuery)))
      .forEach(folder => {
        if (folder.is_key_folder) {
          filteredKeyFolders.push(folder);
        } else if (!folder.parent_id) {
          filteredOtherFolders.push(folder);
        }
      });

    if (view === 'list' && lcQuery) {
      folders.forEach((folder) => {
        if (folder.name.toLowerCase().includes(lcQuery)) {
          openAllAncestors(folder.id, tempOpenStates);
        }
      });

      filteredKeyFolders = filteredKeyFolders.filter((folder) => {
        return (
          tempOpenStates[folder.id]
        );
      });

      filteredOtherFolders = filteredOtherFolders.filter((folder) => {
        return (
          tempOpenStates[folder.id]
        );
      });
    }

    setKeyFolders(filteredKeyFolders);
    setOtherFolders(filteredOtherFolders);
    setOpenStates(tempOpenStates);

    if (!renderReady) {
      setRenderReady(true);
    }
  }, [query]);

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
              value={query}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon htmlColor="#cbcbcb" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title='Clear search'>
                      <IconButton size="small" onClick={() => setQuery('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
        !renderReady ?
          <CircularProgress size={30} sx={{ mx: 5, my: 4 }} />
          :
          view === 'list' ?
            <FolderList
              allFolders={folders}
              keyFolders={keyFolders}
              otherFolders={otherFolders}
              openStates={openStates}
              setOpenStates={setOpenStates}
              query={query.toLowerCase()}
              handleExpandAll={handleExpandAll}
              handleCollapseAll={handleCollapseAll}
            />
            :
            <>
              <FolderCards
                folders={keyFolders}
                title="Key Folders"
              />
              <Grid item xs={12} style={{ paddingTop: '1rem' }}>
                <Divider />
              </Grid>
              <FolderCards
                folders={otherFolders}
                title="Other Folders"
              />
            </>
      }
    </>
  );
};


function FolderList(props) {
  const {
    keyFolders,
    otherFolders,
    allFolders,
    openStates,
    setOpenStates,
    query,
    handleExpandAll,
    handleCollapseAll
  } = props;
  const navigate = useNavigate();

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [dblClickFlag, setDblClickFlag] = useState(false);

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
        <ButtonGroup size="small" variant="outlined" style={{ margin: '0 16px' }}>
          <Button
            onClick={handleExpandAll}
            startIcon={<UnfoldMoreRoundedIcon fontSize="small" />}>
            Expand
          </Button>
          <Button
            onClick={handleCollapseAll}
            endIcon={<UnfoldLessRoundedIcon fontSize="small" />}>
            Collapse
          </Button>
        </ButtonGroup>
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
                  query={query}
                />
              );
            })
          }
          <ListSubheader className="flex-ac">
            Other Folders
          </ListSubheader>
          {
            otherFolders.map(folder => {
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
                  query={query}
                />
              );
            })
          }
        </List>
      </Paper>
    </Grid>
  );
}

function renderNestedFolders(folders, parentFolderId, handleFolderClick, openStates, setOpenStates, selectedFolderId, query, depth = 1) {
  depth++;
  const nestedFolders = folders.filter(folder => folder.parent_id === parentFolderId);

  return nestedFolders.map(folder => {
    const hasNestedFolders = folders.some(subfolder => subfolder.parent_id === folder.id);

    return (
      <div key={folder.id}>
        <ListItemButton
          disableRipple
          selected={selectedFolderId === folder.id}
          sx={{ pl: `${(36 * depth)}px` }}
          onClick={() => handleFolderClick(folder.id)}>

          <ListItemIcon style={{ position: 'relative', minWidth: 34 }}>
            {
              hasNestedFolders ?
                <ChevronRightRoundedIcon
                  style={{ transform: openStates[folder.id] ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  className="toggle-icon" />
                : null
            }
            <FolderIcon htmlColor="#f7df92" />
          </ListItemIcon>
          <ListItemText primary={renderFolderName(query, folder.name)} />
        </ListItemButton>
        {
          hasNestedFolders ?
            <Collapse in={openStates[folder.id]} timeout="auto" unmountOnExit>
              {renderNestedFolders(folders, folder.id, handleFolderClick, openStates, setOpenStates, selectedFolderId, query, depth)}
            </Collapse> : null
        }
      </div>
    );
  });
}

function renderFolderName(lcQuery, name) {
  if (lcQuery) {
    const regex = new RegExp(`(${lcQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'i');
    const parts = name.split(regex);

    return (
      <span>
        {parts.map((part, index) => (
          regex.test(part) ? (
            <span key={index} className='highlighted-text'>{part}</span>
          ) : (
            part
          )
        ))}
      </span>
    );
  } else {
    return name;
  }
};


function FolderListItem(props) {
  const {
    name,
    id,
    selectedFolderId,
    handleFolderClick,
    allFolders,
    openStates,
    setOpenStates,
    query
  } = props;

  const hasNestedFolders = allFolders.some(subfolder => subfolder.parent_id === id);

  return (
    <>
      <ListItemButton
        selected={selectedFolderId === id}
        disableRipple
        sx={{ pl: '40px' }}
        onClick={() => handleFolderClick(id)}>
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
          <FolderIcon htmlColor="#f7df92" />
        </ListItemIcon>
        <ListItemText primary={renderFolderName(query, name)} />
      </ListItemButton>
      {
        hasNestedFolders ?
          <Collapse in={openStates[id]} timeout="auto" unmountOnExit>
            {renderNestedFolders(allFolders, id, handleFolderClick, openStates, setOpenStates, selectedFolderId, query)}
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
      {
        <TransitionGroup className="folders-transition-group" appear={false}>
          {folders.map((folder) => {
            let folderName = folder.name;

            if (folderName.length > 23) {
              folderName = folderName.substring(0, 23) + '...';
            }

            return (
              <Collapse
                component={Link}
                to={`${folder.id}`}
                orientation="horizontal"
                key={folder.id}
                className="folder-transitioner">
                <Paper className="folder-item folder-small"></Paper>
                <Box mt={1} maxWidth={80} style={{ overflowWrap: 'break-word' }}>
                  <Typography variant="body2">{folderName}</Typography>
                </Box>
              </Collapse>
            );
          })}
        </TransitionGroup>
      }
    </Grid>
  );
}