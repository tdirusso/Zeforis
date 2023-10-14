/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Paper, Tooltip, TextField, InputAdornment, Collapse, IconButton, ButtonGroup, Button, CircularProgress, Fade } from "@mui/material";
import './styles.scss';
import { useOutletContext } from "react-router-dom";
import Divider from '@mui/material/Divider';
import React, { useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloseIcon from '@mui/icons-material/Close';
import DoubleArrowRoundedIcon from '@mui/icons-material/DoubleArrowRounded';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function FoldersPage() {
  const {
    folders,
    isAdmin,
    openDrawer,
    foldersMap
  } = useOutletContext();

  const [query, setQuery] = useState('');
  const [keyFolders, setKeyFolders] = useState([]);
  const [otherFolders, setOtherFolders] = useState([]);
  const [openStates, setOpenStates] = useState({});
  const [renderReady, setRenderReady] = useState(false);
  const [viewingFolder, setViewingFolder] = useState(null);

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

    folders
      .forEach(folder => {
        if (folder.is_key_folder) {
          filteredKeyFolders.push(folder);
        } else if (!folder.parent_id) {
          filteredOtherFolders.push(folder);
        }
      });

    if (lcQuery) {
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {
        !renderReady ?
          <CircularProgress size={30} sx={{ mx: 5, my: 4 }} />
          :
          <>
            <FolderList
              allFolders={folders}
              keyFolders={keyFolders}
              otherFolders={otherFolders}
              openStates={openStates}
              setOpenStates={setOpenStates}
              query={query.toLowerCase()}
              handleExpandAll={handleExpandAll}
              handleCollapseAll={handleCollapseAll}
              setQuery={setQuery}
              isAdmin={isAdmin}
              openDrawer={openDrawer}
              viewingFolder={viewingFolder}
              setViewingFolder={setViewingFolder}
              foldersMap={foldersMap}
            />
            {
              viewingFolder ?
                <FolderView folder={viewingFolder} />
                :
                null
            }
          </>
      }
    </>
  );
};

function FolderView({ folder }) {
  return (
    <Grid item xs={8.5}>
      <Fade in appear style={{ transitionDuration: '250ms', transitionDelay: '255ms' }}>
        <Paper sx={{ px: 0 }}>
          <TableContainer>
            <Table>
              <TableBody>
                {folder.tasks.map((task) => (
                  <TableRow key={task.task_id}>
                    <TableCell>{task.task_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Fade>
    </Grid>
  );
}


function FolderList(props) {
  const {
    keyFolders,
    otherFolders,
    allFolders,
    openStates,
    setOpenStates,
    query,
    handleExpandAll,
    handleCollapseAll,
    setQuery,
    isAdmin,
    openDrawer,
    viewingFolder,
    setViewingFolder,
    foldersMap
  } = props;

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [dblClickFlag, setDblClickFlag] = useState(false);

  const handleFolderClick = (folderId, hasNestedFolders) => {
    if (hasNestedFolders) {
      if (selectedFolderId === folderId && dblClickFlag === true) {
        clearTimeout(window.updateOpenFolderStates);
        setViewingFolder(foldersMap[folderId]);
        return;
      }

      setDblClickFlag(true);
      setSelectedFolderId(folderId);

      window.updateOpenFolderStates = setTimeout(() => {
        setOpenStates(prevOpenStates => ({
          ...prevOpenStates,
          [folderId]: !prevOpenStates[folderId],
        }));
      }, 200);

      setTimeout(() => {
        setDblClickFlag(false);
      }, 200);
    } else {
      setSelectedFolderId(folderId);
      setViewingFolder(foldersMap[folderId]);
    }
  };

  const gridWidth = viewingFolder ? 3.5 : 12;

  return (
    <Grid item xs={gridWidth} style={{ transition: 'all 250ms' }}>
      <Paper sx={{ px: 0, py: 1.5 }}>
        <Box className="flex-ac" px={viewingFolder ? 1.5 : 3} gap={3}>
          <Tooltip title="New folder" placement="bottom-end">
            <Box
              hidden={!isAdmin}
              className="new-folder-btn"
              onClick={() => openDrawer('folder')}>
              <img
                width={40}
                alt=""
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEy0lEQVR4nO2bz28bRRTHV5T00CNwA/EHwDGi4hZpN8wa1SUgcMsFEIhyKFJFfHGEKpmgiKRuQrNukWshsWvRgJQckKAVTauCeitSULwQBDHubiFcWloJ4fU+IyoGjV2KMEkc79p+a8/7Sl8pUn7I+/3MvDczO1EUEolEIpFIJBKJRCKRSCQSiUQikUikJlVW33jUKyZPeHZyrWKPe56d5J10xR5/i0LfRHwtvdsrJk9W7OTtTofuEYQdhX+x28F7NBM2lxj5vQzfo3L035rfi7LjEYStRv/4PFb43j8zoZickbYxe/b4d9gAPJlXR14xWcEO35N5JjSHUF2b4P76FPfLsxwcg4Obldq+Y/Bqebbmr09/Xf1+an9XAVRLUxS6uw0QAaM0U+Qr6T0dB+CXj6GPNugT++XMzY5BuDvyI/Bg0EeulqZXOwJA1Hyq9dn2IThZXrs6uS88gHUa/RC0FJVmVkID8Mtz6NMZ+tT+1TkID8CdR38Q6FP7jvFXaADYDwF9bgLgEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKEH4YgGDqAS4BQB+FQDMAPwigEoQfBiCYeoBLANBHIdAMwA8CqAThhwEIph7gEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKUP+46hh81Z7khctH+NFzL/GXl57lY2fiXC88Wbf4+pWl5+rfEz9TtN/mvkM9gIcNfuOHYzx36TA/8PFTXLP0tnzwozGe++J1vrGeoSYMbQZ/vTTLjy8f4noh1nbwzRZ/Y+7Ca/z6j407tbQKcrcP//yVFB9biIcOvtlPL+zny19NEADYIviKM88z51/tePD/s8lOD+eHh+hyrvtv+L+VT/DUpy90P/y7Zufi+Xiwf1nCXpFAF0Z+b8NvWDXZxcRiYrf0ADK9KDtbz4Sc1AA+v5JqO7RWahtCgR2UEsCN0ix/5kwcHYBq6bdGFuIPSAfg+PKhQGWj4zOg0Q/ekwrAxnom8CarSwD+GC2MPiwNgNylw4EbZzcA3ClF01IA8J1s/ZwmagA0k/2SWEzsGngAq/Zk8JC6CaA+C9jegQdQuHwksgBGTTbREoDvZn/HDhFC+OjZF0MFHFbblyF9qTUAx1jDDhFCWLw4iSoA1WLftC5BjvEudogQwq2OmjEBaCb7tSWA2jXjEd8xbmMHCQHdav2PCUC1WK0lgEYfMAzsIEFmAHwlP+S7xgXsMEHGEtQEYd53sn9ihwoyNeHNegI42TnfzX7ru0YFO2AY9GVov0u19DfDbJZCBdzCqsVSyqBr1Iw9HlUA2gexx5RBVzqdvke19J+jBkA19Z/EZ1NkkGrp09EDwN5RZNHIh7GHxEuQqAAQ63/V2vegIpM0i+WiAkAz9ZOKbGLvs/vExgcbgGrqN9t6KT9IUs0nnscHEEsoMksz2emgjTO82SlFdiUWE7s0S/+k1+GrFjs78uXIvdjPHwnF8/E94sJsz8I39c8CX84dVA3nh4eCrozaLTs08reRuKsZZHW0g5JzQ/qGu1NpBe1+cV1QbJA6EHxNrPPFsnfHH4DUkNidimOLIGdH4nfE8YJ0O1ylC2oc4LG94t6OOLMXL07ErWZxnFG3pd/STGbf+V5KnGoGPVj7GyCRo+oGQ60BAAAAAElFTkSuQmCC" />
            </Box>
          </Tooltip>

          <ExpandCollapseButtonGroup
            handleExpandAll={handleExpandAll}
            handleCollapseAll={handleCollapseAll}
          />
          {
            !viewingFolder ?
              <TextField
                style={{ transition: 'all 1s' }}
                onChange={e => setQuery(e.target.value)}
                variant="standard"
                size="small"
                value={query}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start" style={{ visibility: query ? 'visible' : 'hidden' }}>
                      <Tooltip title='Clear'>
                        <IconButton size="small" onClick={() => setQuery('')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                placeholder="Search"
              />
              : null
          }
        </Box>
        {
          viewingFolder ?
            <Box p={1} ml={1}>
              <TextField
                style={{ transition: 'all 1s' }}
                onChange={e => setQuery(e.target.value)}
                variant="standard"
                size="small"
                value={query}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title='Clear'>
                        <IconButton size="small" onClick={() => setQuery('')}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start" style={{ visibility: query ? 'visible' : 'hidden' }}>
                      <Tooltip title='Clear'>
                        <IconButton size="small" onClick={() => setQuery('')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                placeholder="Search"
              />
            </Box> :
            null
        }

        <Divider sx={{ mt: 1 }} />

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
          onClick={() => handleFolderClick(folder.id, hasNestedFolders)}>
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


export function FolderListItem(props) {
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

function ExpandCollapseButtonGroup({ handleExpandAll, handleCollapseAll }) {
  return (
    <ButtonGroup variant="outlined" style={{ marginLeft: -10 }}>
      <Tooltip title="Expand all">
        <Button
          onClick={handleExpandAll}>
          <DoubleArrowRoundedIcon
            style={{ transform: 'rotate(90deg)', fontSize: 14 }}
          />
        </Button>
      </Tooltip>
      <Tooltip title="Collapse all">
        <Button
          onClick={handleCollapseAll}>
          <DoubleArrowRoundedIcon
            style={{ transform: 'rotate(-90deg)', fontSize: 14 }}
          />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}