/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Paper, Tooltip, TextField, InputAdornment, Collapse, IconButton, ButtonGroup, Button, CircularProgress, Menu, MenuItem, Typography } from "@mui/material";
import './styles.scss';
import { useOutletContext, useSearchParams } from "react-router-dom";
import Divider from '@mui/material/Divider';
import React, { useEffect, useRef, useState } from 'react';
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
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import AddIcon from '@mui/icons-material/Add';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { createFolder } from "../../../api/folders";
import { TransitionGroup } from "react-transition-group";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';
import FolderView from "./FolderView";

export default function FoldersPage() {
  const {
    folders,
    isAdmin,
    openDrawer,
    foldersMap,
    openSnackBar,
    engagement,
    setFolders,
    openModal
  } = useOutletContext();

  const [keyFolders, setKeyFolders] = useState([]);
  const [otherFolders, setOtherFolders] = useState([]);
  const [openStates, setOpenStates] = useState({});
  const [renderReady, setRenderReady] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams({ folderQ: '' });

  const viewingFolderId = searchParams.get('viewingFolderId');
  const query = searchParams.get('folderQ');

  const setViewingFolderId = id => {
    setSearchParams(prev => {
      prev.set('viewingFolderId', id);
      return prev;
    }, { replace: true });
  };

  const setQuery = value => {
    setSearchParams(prev => {
      prev.set('folderQ', value);
      return prev;
    }, { replace: true });
  };

  const prevFolders = useRef(folders);
  const prevQuery = useRef(query);

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
    let foldersUpdated = false;
    let queryUpdated = query !== prevQuery.current;

    if (!queryUpdated) {
      foldersUpdated = JSON.stringify(prevFolders.current) !== JSON.stringify(folders);
    } else {
      prevQuery.current = query;
    }

    if ((queryUpdated || foldersUpdated) || !renderReady) {
      const tempOpenStates = {};
      let filteredKeyFolders = [];
      let filteredOtherFolders = [];

      const lcQuery = query?.toLowerCase();

      folders.forEach(folder => {
        if (!folder.parent_id) {
          if (folder.is_key_folder) {
            filteredKeyFolders.push(folder);
          } else {
            filteredOtherFolders.push(folder);
          }
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

      if ((!foldersUpdated && lcQuery)) {
        setOpenStates(tempOpenStates);
      } else {
        prevFolders.current = folders;
      }

      if (!renderReady) {
        setRenderReady(true);
      }
    }
  }, [query, folders]);

  return (
    <>
      {
        !renderReady ?
          <Grid item xs={12} style={{ transition: 'all 250ms' }}>
            <Paper className="flex-ac">
              Loading folders ...
              <CircularProgress size={30} sx={{ mx: 2, my: 4 }} />
            </Paper>
          </Grid>
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
              viewingFolderId={viewingFolderId}
              setViewingFolderId={setViewingFolderId}
              foldersMap={foldersMap}
              openSnackBar={openSnackBar}
              engagement={engagement}
              setFolders={setFolders}
              openModal={openModal}
              renderReady={renderReady}
            />
            {
              viewingFolderId ?
                <FolderView
                  folderId={viewingFolderId}
                />
                :
                null
            }
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
    handleCollapseAll,
    setQuery,
    isAdmin,
    openDrawer,
    viewingFolderId,
    setViewingFolderId,
    openSnackBar,
    engagement,
    setFolders,
    openModal
  } = props;

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [dblClickFlag, setDblClickFlag] = useState(false);
  const [addFolderPopup, setAddFolderPopup] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [editFolderId, setEditFolderId] = useState(null);
  const [addingFolder, setAddingFolder] = useState(false);

  const addFolderPopupOpen = Boolean(addFolderPopup);
  const moreMenuOpen = Boolean(moreMenuAnchor);

  const newFolderName = useRef();

  const handleFolderClick = (folderId, hasNestedFolders) => {
    if (hasNestedFolders) {
      if (selectedFolderId === folderId && dblClickFlag === true) {
        clearTimeout(window.updateOpenFolderStates);
        setViewingFolderId(folderId);
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
      setViewingFolderId(folderId);
    }
  };

  const handleAddNewFolderClick = (e, folderId) => {
    e.stopPropagation();
    setEditFolderId(folderId);
    setAddFolderPopup(e.currentTarget);
  };

  const handleMoreMenuClick = (e, folderId) => {
    e.stopPropagation();
    setEditFolderId(folderId);
    setMoreMenuAnchor(e.currentTarget);
  };

  const handleAddFolder = async () => {
    const folderName = newFolderName.current.value;

    if (!folderName) {
      openSnackBar("Folder name can't be blank.");
      return;
    }

    if (!editFolderId) {
      openSnackBar("No folder is selected.");
      return;
    }

    setAddingFolder(true);

    try {
      const { folder, message } = await createFolder({
        name: folderName,
        engagementId: engagement.id,
        parentId: editFolderId
      });

      if (folder) {
        openSnackBar('Folder added.', 'success');
        setFolders(folders => [...folders, folder]);
        setAddingFolder(false);
        setAddFolderPopup(null);
      } else {
        openSnackBar(message, 'error');
        setAddingFolder(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setAddingFolder(false);
    }
  };

  const handleEditFolderClick = () => {
    openDrawer('folder', { folderProps: { id: editFolderId } });
    setMoreMenuAnchor(null);
  };

  const handleMoveFolderClick = () => {
    openModal('move-folder', { moveFolderId: editFolderId });
    setMoreMenuAnchor(null);
  };

  const gridWidth = viewingFolderId ? 2.5 : 12;

  return (
    <Grid item xs={gridWidth} style={{ transition: 'flex-basis 250ms, max-width 250ms' }}>
      <Paper sx={{ px: 0, py: 1.5 }}>
        <Box className="flex-ac" px={viewingFolderId ? 1.5 : 3} gap={3} flexWrap='wrap'>
          <Tooltip title="New folder" placement="bottom-end">
            <Box
              hidden={!isAdmin}
              className="new-folder-btn"
              onClick={() => openDrawer('folder')}>
              {
                document.body.className.includes('dark') ?
                  <img
                    alt=""
                    height={40}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACCklEQVR4nO2WzWrbQBSFRaF5iXTdF/AbSLZGxQXbwQ7YWfpWs9TG4GphnE0gbgLGzEDchTMqLYU29HlaMO2i0F27SLPPhOtSMKos+UfWTGEOHBBiBOe7ujNzLcvIyMjIyCimyWTyhDF2wxj7zTmX65gxdmrpEp5z/mvd4NpBMMZutgmvDQTboG20hOCcy/F4LHu9nqSUSgBQat/374Mg+BGGYWUtAAyvQ3CImVJ6PxgMSpkAWHnVYWGFgyD4ngmgY/VhqZ0yAVSHhAwbADB/AEwLpUp1i4DZxKC+ymCOUVBfaTAXGehpK0tKgvkg22FH1i4a0ruqyvLMWxif8V37ZWexRkuAdr8jybQqnYik2ptWZad/ohHAC5BHZ83M4P9YkIvhcPhIOcBW4aO/dkdKAbBtVoWLa9U6W7h1NQA+LPp5dwDyrfWxdVA4AJ42ae0RV9paW3itwgFql438ACLyLgngdp8A3vR5auAsxTbzlySAT/sEqMye5QcgyF0SwFMA+Pk/ANjCvU08iSilh91u98M+2gnHg9wAIvLZKlqOcN/ntYkd4b4tHKAckeP8TqFKs3CA0uvSY0eQ+c4XWUS+Jl5kRah8TY52/gNvSM1SKZwqnW2HOUHOLdXCkdiO3FebA7ij1HG6aNnCraftiaWqz5W3zSrhxsbBDGcbPNvxhkXj8593lSauSfr4AcLfCU7i0+ZhAAAAAElFTkSuQmCC"></img>
                  :
                  <img
                    width={40}
                    alt=""
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEy0lEQVR4nO2bz28bRRTHV5T00CNwA/EHwDGi4hZpN8wa1SUgcMsFEIhyKFJFfHGEKpmgiKRuQrNukWshsWvRgJQckKAVTauCeitSULwQBDHubiFcWloJ4fU+IyoGjV2KMEkc79p+a8/7Sl8pUn7I+/3MvDczO1EUEolEIpFIJBKJRCKRSCQSiUQikUikJlVW33jUKyZPeHZyrWKPe56d5J10xR5/i0LfRHwtvdsrJk9W7OTtTofuEYQdhX+x28F7NBM2lxj5vQzfo3L035rfi7LjEYStRv/4PFb43j8zoZickbYxe/b4d9gAPJlXR14xWcEO35N5JjSHUF2b4P76FPfLsxwcg4Obldq+Y/Bqebbmr09/Xf1+an9XAVRLUxS6uw0QAaM0U+Qr6T0dB+CXj6GPNugT++XMzY5BuDvyI/Bg0EeulqZXOwJA1Hyq9dn2IThZXrs6uS88gHUa/RC0FJVmVkID8Mtz6NMZ+tT+1TkID8CdR38Q6FP7jvFXaADYDwF9bgLgEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKEH4YgGDqAS4BQB+FQDMAPwigEoQfBiCYeoBLANBHIdAMwA8CqAThhwEIph7gEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKUP+46hh81Z7khctH+NFzL/GXl57lY2fiXC88Wbf4+pWl5+rfEz9TtN/mvkM9gIcNfuOHYzx36TA/8PFTXLP0tnzwozGe++J1vrGeoSYMbQZ/vTTLjy8f4noh1nbwzRZ/Y+7Ca/z6j407tbQKcrcP//yVFB9biIcOvtlPL+zny19NEADYIviKM88z51/tePD/s8lOD+eHh+hyrvtv+L+VT/DUpy90P/y7Zufi+Xiwf1nCXpFAF0Z+b8NvWDXZxcRiYrf0ADK9KDtbz4Sc1AA+v5JqO7RWahtCgR2UEsCN0ix/5kwcHYBq6bdGFuIPSAfg+PKhQGWj4zOg0Q/ekwrAxnom8CarSwD+GC2MPiwNgNylw4EbZzcA3ClF01IA8J1s/ZwmagA0k/2SWEzsGngAq/Zk8JC6CaA+C9jegQdQuHwksgBGTTbREoDvZn/HDhFC+OjZF0MFHFbblyF9qTUAx1jDDhFCWLw4iSoA1WLftC5BjvEudogQwq2OmjEBaCb7tSWA2jXjEd8xbmMHCQHdav2PCUC1WK0lgEYfMAzsIEFmAHwlP+S7xgXsMEHGEtQEYd53sn9ihwoyNeHNegI42TnfzX7ru0YFO2AY9GVov0u19DfDbJZCBdzCqsVSyqBr1Iw9HlUA2gexx5RBVzqdvke19J+jBkA19Z/EZ1NkkGrp09EDwN5RZNHIh7GHxEuQqAAQ63/V2vegIpM0i+WiAkAz9ZOKbGLvs/vExgcbgGrqN9t6KT9IUs0nnscHEEsoMksz2emgjTO82SlFdiUWE7s0S/+k1+GrFjs78uXIvdjPHwnF8/E94sJsz8I39c8CX84dVA3nh4eCrozaLTs08reRuKsZZHW0g5JzQ/qGu1NpBe1+cV1QbJA6EHxNrPPFsnfHH4DUkNidimOLIGdH4nfE8YJ0O1ylC2oc4LG94t6OOLMXL07ErWZxnFG3pd/STGbf+V5KnGoGPVj7GyCRo+oGQ60BAAAAAElFTkSuQmCC" />
              }

            </Box>
          </Tooltip>
          <ExpandCollapseButtonGroup
            handleExpandAll={handleExpandAll}
            handleCollapseAll={handleCollapseAll}
          />
          {
            !viewingFolderId ?
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
          viewingFolderId ?
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
            <ListSubheader className="flex-ac" disableSticky>
              <StarIcon htmlColor="gold" style={{ marginRight: '2px' }} />  Key Folders
            </ListSubheader>
          }>
          <TransitionGroup>
            {
              keyFolders.map(folder => {
                return (
                  <Collapse key={folder.id}>
                    <FolderListItem
                      name={folder.name}
                      id={folder.id}
                      selectedFolderId={selectedFolderId}
                      handleFolderClick={handleFolderClick}
                      allFolders={allFolders}
                      openStates={openStates}
                      setOpenStates={setOpenStates}
                      query={query}
                      viewingFolderId={viewingFolderId}
                      handleAddNewFolderClick={handleAddNewFolderClick}
                      handleMoreMenuClick={handleMoreMenuClick}
                    />
                  </Collapse>
                );
              })
            }
          </TransitionGroup>
          <ListSubheader className="flex-ac" disableSticky>
            Other Folders
          </ListSubheader>
          <TransitionGroup>
            {
              otherFolders.map(folder => {
                return (
                  <Collapse key={folder.id}>
                    <FolderListItem
                      name={folder.name}
                      id={folder.id}
                      selectedFolderId={selectedFolderId}
                      handleFolderClick={handleFolderClick}
                      allFolders={allFolders}
                      openStates={openStates}
                      setOpenStates={setOpenStates}
                      query={query}
                      viewingFolderId={viewingFolderId}
                      handleAddNewFolderClick={handleAddNewFolderClick}
                      handleMoreMenuClick={handleMoreMenuClick}
                    />
                  </Collapse>
                );
              })
            }
          </TransitionGroup>
        </List>
      </Paper>

      <Menu
        anchorEl={addFolderPopup}
        open={addFolderPopupOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => setAddFolderPopup(null)}>
        <TextField
          disabled={addingFolder}
          onKeyDown={e => e.key === 'Enter' ? handleAddFolder() : null}
          autoFocus
          size="small"
          placeholder="Folder name"
          style={{ margin: '0 10px' }}
          variant="standard"
          inputRef={newFolderName}
          inputProps={{
            style: {
              fontSize: '14px'
            }
          }}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <Tooltip title="Save">
                  <span>
                    <IconButton
                      disabled={addingFolder}
                      size="small"
                      onClick={handleAddFolder}>
                      {
                        addingFolder ?
                          <CircularProgress size={15} />
                          :
                          <CheckRoundedIcon
                            color="success"
                            fontSize="small" />
                      }
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
          }}
        />
      </Menu>

      <Menu
        className="folder-actions-menu"
        anchorEl={moreMenuAnchor}
        open={moreMenuOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => setMoreMenuAnchor(null)}>
        <MenuItem dense onClick={handleEditFolderClick}>
          <EditOutlinedIcon fontSize="small" />
          Edit folder
        </MenuItem>
        <MenuItem dense onClick={handleMoveFolderClick}>
          <ShortcutRoundedIcon fontSize="small" />
          Move folder
        </MenuItem>
        <Divider className="m0" />
        <MenuItem dense>
          <ListItemText inset color="error">
            <Typography color="error" component="span">
              Delete folder
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Grid>
  );
}

function renderNestedFolders(folders, parentFolderId, handleFolderClick, openStates, setOpenStates, selectedFolderId, query, viewingFolderId, handleAddNewFolderClick, handleMoreMenuClick, depth = 1) {
  depth++;
  const nestedFolders = folders.filter(folder => folder.parent_id === parentFolderId);

  const indent = viewingFolderId ? (`${24 * depth}px`) : (`${36 * depth}px`);
  const itemTextStyle = { flexGrow: viewingFolderId ? 1 : 0, flexBasis: viewingFolderId ? 'auto' : '20%' };

  return (
    <TransitionGroup>
      {
        nestedFolders.map(folder => {
          const hasNestedFolders = folders.some(subfolder => subfolder.parent_id === folder.id);

          return (
            <Collapse key={folder.id}>
              <ListItemButton
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
                <ListItemText
                  style={itemTextStyle}
                  primary={renderFolderName(query, folder.name)} />
                <Box className="folder-actions">
                  <Tooltip title="Add folder">
                    <IconButton size="small" onClick={e => handleAddNewFolderClick(e, folder.id)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More">
                    <IconButton size="small" onClick={e => handleMoreMenuClick(e, folder.id)}>
                      <MoreVertOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItemButton>
              {
                hasNestedFolders ?
                  <Collapse in={openStates[folder.id]} timeout="auto">
                    {renderNestedFolders(folders, folder.id, handleFolderClick, openStates, setOpenStates, selectedFolderId, query, viewingFolderId, handleAddNewFolderClick, handleMoreMenuClick, depth)}
                  </Collapse> : null
              }
            </Collapse>
          );
        })
      }
    </TransitionGroup>
  );
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
    query,
    viewingFolderId,
    handleAddNewFolderClick,
    handleMoreMenuClick
  } = props;

  const hasNestedFolders = allFolders.some(subfolder => subfolder.parent_id === id);

  return (
    <>
      <ListItemButton
        className="folder-listitem"
        selected={selectedFolderId === id}
        disableRipple
        sx={{ pl: viewingFolderId ? '32px' : '40px', transition: 'padding 250ms' }}
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
        <ListItemText
          primary={renderFolderName(query, name)}
          style={{ flexGrow: viewingFolderId ? 1 : 0, flexBasis: viewingFolderId ? 'auto' : '20%' }}
        />

        <Box className="folder-actions">
          <Tooltip title="Add folder">
            <IconButton
              size="small"
              onClick={e => handleAddNewFolderClick(e, id)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More">
            <IconButton
              onClick={e => handleMoreMenuClick(e, id)}
              size="small">
              <MoreVertOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </ListItemButton>
      {
        hasNestedFolders ?
          <Collapse in={openStates[id]} timeout="auto">
            {renderNestedFolders(allFolders, id, handleFolderClick, openStates, setOpenStates, selectedFolderId, query, viewingFolderId, handleAddNewFolderClick, handleMoreMenuClick)}
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