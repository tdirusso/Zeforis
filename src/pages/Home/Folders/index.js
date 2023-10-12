/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Paper, Typography, Tooltip, TextField, InputAdornment, Grow } from "@mui/material";
import './styles.scss';
import { Link, useOutletContext } from "react-router-dom";
import Divider from '@mui/material/Divider';
import React, { useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SearchIcon from '@mui/icons-material/Search';

export default function FoldersPage() {
  const {
    folders,
    isAdmin,
    openDrawer
  } = useOutletContext();

  const [view, setView] = useState('card');
  const [query, setQuery] = useState('');
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(true);
  }, []);

  const handleSetView = (_, newView) => {
    if (newView) {
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

      <Grid item xs={12}>
        <Box component="h6" className="flex-ac" mb={2}>
          <StarIcon htmlColor="gold" style={{ marginRight: '2px' }} /> Key Folders
        </Box>
        <Box display='flex' alignItems='start' gap={2} flexWrap='wrap'>
          {
            keyFolders.length === 0 ?
              <Grid item xs={12}>
                <Typography>No key folders.</Typography>
              </Grid> :
              keyFolders.map(folder =>
                <Folder
                  shouldAnimate={shouldAnimate}
                  key={folder.id}
                  folder={folder}
                />)
          }
        </Box>
      </Grid>

      <Grid item xs={12} style={{ paddingTop: '1rem' }}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Box component="h6" mb={2}>
          Other Folders
        </Box>
        <Box display='flex' alignItems='start' gap={2} flexWrap='wrap'>
          {
            otherFolders.length === 0 ?
              <Grid item xs={12}>
                <Typography variant="body2">No other folders.</Typography>
              </Grid> :
              otherFolders.map(folder =>
                <Folder
                  shouldAnimate={shouldAnimate}
                  key={folder.id}
                  folder={folder}
                />)
          }
        </Box>
      </Grid>
    </>
  );
};

function Folder({ folder, shouldAnimate }) {
  let folderName = folder.name;

  if (folderName.length > 23) {
    folderName = folderName.substring(0, 23) + '...';
  }

  return (
    <Grow in appear={shouldAnimate}>
      <Link
        to={`/home/tasks?folderId=${folder.id}`}
        className="folder-container">
        <Paper
          className="folder-item folder-small">
        </Paper>
        <Box mt={1} maxWidth={80} style={{ overflowWrap: 'break-word' }}>
          <Typography variant="body2">
            {folderName}
          </Typography>
        </Box>
      </Link>
    </Grow>
  );
}