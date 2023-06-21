/* eslint-disable react-hooks/exhaustive-deps */
import { Box, FormControlLabel, FormGroup, Grid, List, ListItem, ListItemButton, ListItemText, ListSubheader, Menu, Paper, Switch, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { useOutletContext } from "react-router-dom";

export default function WidgetsTab() {

  const {
    tasks,
    client,
    foldersMap,
    tagsMap
  } = useOutletContext();

  const widgetName = useRef();

  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetBody, setWidgetBody] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColorMenu, setBgColorMenu] = useState(null);
  const [textColorMenu, setTextColorMenu] = useState(null);

  const bgColorMenuOpen = Boolean(bgColorMenu);
  const textColorMenuOpen = Boolean(textColorMenu);

  const widgets = [

  ];

  return (
    <>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="body2">
            The Widget Creator allows you to created personalized widgets that will display on your customer's dashboard.
            Customize titles, content, design and formatting to enhance communication that engages and informs your customer's.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper sx={{ px: 0 }}>
          <Box component="h5" mx={2}>Your Widgets</Box>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List>
              <ListSubheader sx={{ px: 0 }}>
                <ListItemButton>
                  <ListItemText sx={{ color: '#bebebe' }}>
                    + New Widget
                  </ListItemText>
                </ListItemButton>
              </ListSubheader>
              {
                widgets.map((widget, i) => {
                  return (
                    <ListItem key={i} sx={{ px: 0 }}>
                      <ListItemButton>
                        <ListItemText>
                          {widget}
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  );
                })
              }
            </List>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Paper sx={{ display: 'flex' }}>
          <Box flexBasis={'50%'} py={2} px={2}>
            <Box mb={2}>
              <FormGroup>
                <FormControlLabel
                  sx={{ justifyContent: 'flex-end', mx: 0 }}
                  labelPlacement="start"
                  control={<Switch defaultChecked />}
                  label="Enabled">
                </FormControlLabel>
              </FormGroup>
            </Box>
            <Box mb={1}>
              <Box display="flex" justifyContent='space-between'>
                <Box display='flex'>
                  <Typography>Background color</Typography>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      background: backgroundColor
                    }}
                    onClick={e => setBgColorMenu(e.currentTarget)}
                    width={25}
                    height={25}
                    border="1px solid #9c9c9c"
                    borderRadius="4px"
                    ml={0.75}>
                  </Box>
                </Box>
                <Box display='flex'>
                  <Typography>Text color</Typography>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      background: textColor
                    }}
                    onClick={e => setTextColorMenu(e.currentTarget)}
                    width={25}
                    height={25}
                    border="1px solid #9c9c9c"
                    borderRadius="4px"
                    ml={0.75}>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="standard"
                inputRef={widgetName}
                label='Widget name'>
              </TextField>
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="standard"
                onChange={e => setWidgetTitle(e.target.value)}
                label='Widget title'>
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                inputProps={{ sx: { minHeight: '60px' } }}
                variant="standard"
                multiline
                onChange={e => setWidgetBody(e.target.value)}
                label='Widget body'>
              </TextField>
            </Box>
          </Box>
          <Box flexBasis={'50%'} p={5}>
            <Paper sx={{
              minHeight: '250px',
              background: backgroundColor
            }}>
              <Box
                color={textColor}
                component="h5"
                mb={1}>{widgetTitle}</Box>
              <TextField
                sx={{
                  '& .MuiInputBase-root::before': { borderBottom: 'none !important' },
                  '& .MuiInputBase-root::after': { borderBottom: 'none !important' }
                }}
                inputProps={{
                  sx: {
                    color: textColor,
                    fontWeight: 400,
                    fontSize: '0.875rem'
                  }
                }}
                InputProps={{ readOnly: true }}
                variant="standard"
                value={widgetBody}
                multiline>
              </TextField>
            </Paper>
          </Box>
        </Paper>
      </Grid>

      <Menu
        PaperProps={{ sx: { '& .MuiList-root': { p: 0 } } }}
        anchorEl={bgColorMenu}
        open={bgColorMenuOpen}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setBgColorMenu(null)}>

        <ChromePicker
          color={backgroundColor}
          disableAlpha
          onChange={color => setBackgroundColor(color.hex)}
        />
      </Menu>

      <Menu
        PaperProps={{ sx: { '& .MuiList-root': { p: 0 } } }}
        anchorEl={textColorMenu}
        open={textColorMenuOpen}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setTextColorMenu(null)}>

        <ChromePicker
          color={textColor}
          disableAlpha
          onChange={color => setTextColor(color.hex)}
        />
      </Menu>
    </>
  );
};;