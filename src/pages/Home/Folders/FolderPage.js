/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Paper, Typography, Tooltip, TextField, InputAdornment, Collapse } from "@mui/material";
import './styles.scss';
import { Link, Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { FolderListItem } from "./FoldersPage";

export default function FolderPage() {
  const {
    folders,
    isAdmin,
    openDrawer,
    foldersMap
  } = useOutletContext();

  const [keyFolders, setKeyFolders] = useState([]);
  const [otherFolders, setOtherFolders] = useState([]);
  const [openStates, setOpenStates] = useState({});
  const [renderReady, setRenderReady] = useState(false);

  const { folderId } = useParams();

  const folder = foldersMap[folderId];

  useEffect(() => {

  }, []);

  const buildBreadcrumbPath = (folderId) => {
    const breadcrumb = [];

    const findParentFolder = (folderId) => {
      const parentFolder = foldersMap[folderId];
      if (parentFolder) {
        breadcrumb.unshift(parentFolder);
        findParentFolder(parentFolder.parent_id);
      }
    };

    findParentFolder(folderId);
    return breadcrumb;
  };

  const childFolders = folders;//folders.filter((f) => f.parent_id === folder.id);

  return (
    <>
      <Grid item xs={12} style={{ paddingTop: 8 }}>
        <Box className="flex-ac">
          <Breadcrumbs separator=">">
            <Link color="inherit" to={`/home/folders`}>
              Home
            </Link>
            {buildBreadcrumbPath(folder.id).map((crumb) => (
              <Link key={crumb.id} color="inherit" to={`/home/folders/${crumb.id}`}>
                {crumb.name}
              </Link>
            ))}
          </Breadcrumbs>
          <Divider flexItem orientation="vertical" sx={{ ml: 3, mr: 1 }} />
          <Tooltip title="New folder" placement="bottom-end">
            <Box
              mr={0}
              hidden={!isAdmin}
              className="new-folder-btn"
              onClick={() => openDrawer('folder', { parentId: folder.id })}>
              <img
                width={40}
                alt=""
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEy0lEQVR4nO2bz28bRRTHV5T00CNwA/EHwDGi4hZpN8wa1SUgcMsFEIhyKFJFfHGEKpmgiKRuQrNukWshsWvRgJQckKAVTauCeitSULwQBDHubiFcWloJ4fU+IyoGjV2KMEkc79p+a8/7Sl8pUn7I+/3MvDczO1EUEolEIpFIJBKJRCKRSCQSiUQikUikJlVW33jUKyZPeHZyrWKPe56d5J10xR5/i0LfRHwtvdsrJk9W7OTtTofuEYQdhX+x28F7NBM2lxj5vQzfo3L035rfi7LjEYStRv/4PFb43j8zoZickbYxe/b4d9gAPJlXR14xWcEO35N5JjSHUF2b4P76FPfLsxwcg4Obldq+Y/Bqebbmr09/Xf1+an9XAVRLUxS6uw0QAaM0U+Qr6T0dB+CXj6GPNugT++XMzY5BuDvyI/Bg0EeulqZXOwJA1Hyq9dn2IThZXrs6uS88gHUa/RC0FJVmVkID8Mtz6NMZ+tT+1TkID8CdR38Q6FP7jvFXaADYDwF9bgLgEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKEH4YgGDqAS4BQB+FQDMAPwigEoQfBiCYeoBLANBHIdAMwA8CqAThhwEIph7gEgD0UQg0A/CDACpB+GEAgqkHuAQAfRQCzQD8IIBKUP+46hh81Z7khctH+NFzL/GXl57lY2fiXC88Wbf4+pWl5+rfEz9TtN/mvkM9gIcNfuOHYzx36TA/8PFTXLP0tnzwozGe++J1vrGeoSYMbQZ/vTTLjy8f4noh1nbwzRZ/Y+7Ca/z6j407tbQKcrcP//yVFB9biIcOvtlPL+zny19NEADYIviKM88z51/tePD/s8lOD+eHh+hyrvtv+L+VT/DUpy90P/y7Zufi+Xiwf1nCXpFAF0Z+b8NvWDXZxcRiYrf0ADK9KDtbz4Sc1AA+v5JqO7RWahtCgR2UEsCN0ix/5kwcHYBq6bdGFuIPSAfg+PKhQGWj4zOg0Q/ekwrAxnom8CarSwD+GC2MPiwNgNylw4EbZzcA3ClF01IA8J1s/ZwmagA0k/2SWEzsGngAq/Zk8JC6CaA+C9jegQdQuHwksgBGTTbREoDvZn/HDhFC+OjZF0MFHFbblyF9qTUAx1jDDhFCWLw4iSoA1WLftC5BjvEudogQwq2OmjEBaCb7tSWA2jXjEd8xbmMHCQHdav2PCUC1WK0lgEYfMAzsIEFmAHwlP+S7xgXsMEHGEtQEYd53sn9ihwoyNeHNegI42TnfzX7ru0YFO2AY9GVov0u19DfDbJZCBdzCqsVSyqBr1Iw9HlUA2gexx5RBVzqdvke19J+jBkA19Z/EZ1NkkGrp09EDwN5RZNHIh7GHxEuQqAAQ63/V2vegIpM0i+WiAkAz9ZOKbGLvs/vExgcbgGrqN9t6KT9IUs0nnscHEEsoMksz2emgjTO82SlFdiUWE7s0S/+k1+GrFjs78uXIvdjPHwnF8/E94sJsz8I39c8CX84dVA3nh4eCrozaLTs08reRuKsZZHW0g5JzQ/qGu1NpBe1+cV1QbJA6EHxNrPPFsnfHH4DUkNidimOLIGdH4nfE8YJ0O1ylC2oc4LG94t6OOLMXL07ErWZxnFG3pd/STGbf+V5KnGoGPVj7GyCRo+oGQ60BAAAAAElFTkSuQmCC" />
            </Box>
          </Tooltip>
          <Divider flexItem orientation="vertical" sx={{ mx: 1, }} />
          <ChildFolders folders={childFolders} />

        </Box>
      </Grid>



      <Grid item xs={12} style={{ paddingTop: 10 }}>
        <Divider />
      </Grid>
      <Grid item xs className="folders-controls" style={{ paddingTop: 5 }}>
        {/* <Box className="flex-ac">
          <Paper style={{ padding: '4px 2px', borderRadius: '8px' }} className="flex-ac">
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
        </Box> */}
      </Grid>

      <Grid item xs={3}>
        <List
          className="folders-list"
          dense
          component="nav"
          subheader={
            <ListSubheader className="flex-ac">
              <StarIcon htmlColor="gold" style={{ marginRight: '2px' }} />  Key Folders
            </ListSubheader>
          }>

          {/* {
            keyFolders.map(folder => {
              return (
                <FolderListItem
                  name={folder.name}
                  id={folder.id}
                  key={folder.id}
                  // selectedFolderId={selectedFolderId}
                  // handleFolderClick={handleFolderClick}
               //   allFolders={allFolders}
                  openStates={openStates}
                  setOpenStates={setOpenStates}
                //query={query}
                />
              );
            })
          } */}
          {/* <ListSubheader className="flex-ac">
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
          } */}
        </List>
      </Grid>

      <Grid item xs={9} style={{ paddingTop: '8px' }}>
        <Paper>
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
      </Grid>

    </>
  );
};

function ChildFolders({ folders }) {

  return (
    <Box className="child-folders-container">
      {
        folders.map((folder) => {
          let folderName = folder.name;

          if (folderName.length > 16) {
            folderName = folderName.substring(0, 16) + '...';
          }

          return (
            <Paper
              className="flex-ac subfolder-item"
              component={Link}
              key={folder.id}
              to={`/home/folders/${folder.id}`}>
              <FolderIcon fontSize="small" />
              <Box style={{ overflowWrap: 'break-word', marginLeft: '4px' }}>
                <Typography variant="body2">{folderName}</Typography>
              </Box>
            </Paper>
          );
        })
      }
    </Box>
  );
}