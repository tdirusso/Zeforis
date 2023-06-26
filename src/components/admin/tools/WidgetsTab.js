/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Box, Divider, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, Menu, Paper, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { useOutletContext } from "react-router-dom";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createWidget, updateWidget } from "../../../api/widgets";

export default function WidgetsTab() {

  const {
    client,
    openSnackBar,
    widgets,
    setWidgets
  } = useOutletContext();

  const [widgetName, setWidgetName] = useState('');
  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetBody, setWidgetBody] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColorMenu, setBgColorMenu] = useState(null);
  const [textColorMenu, setTextColorMenu] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedWidget, setSelectedWidget] = useState(null);

  const bgColorMenuOpen = Boolean(bgColorMenu);
  const textColorMenuOpen = Boolean(textColorMenu);

  useEffect(() => {
    if (selectedWidget) {
      if (selectedWidget.id === 'new') {
        setWidgetName('');
        setWidgetTitle('');
        setWidgetBody('');
        setBackgroundColor('#FFFFFF');
        setTextColor('#000000');
        setIsEnabled(true);
      } else {
        setWidgetName(selectedWidget.name);
        setWidgetTitle(selectedWidget.title);
        setWidgetBody(selectedWidget.body);
        setBackgroundColor(selectedWidget.backgroundColor);
        setTextColor(selectedWidget.textColor);
        setIsEnabled(Boolean(selectedWidget.isEnabled));
      }
    }
  }, [selectedWidget]);

  const handleCreateWidget = async () => {
    if (!widgetName) {
      openSnackBar('Please enter a name for the new widget.');
      return;
    }

    setLoading(true);

    try {
      const { widget, message } = await createWidget({
        clientId: client.id,
        name: widgetName,
        title: widgetTitle,
        body: widgetBody,
        backgroundColor,
        textColor,
        isEnabled
      });

      if (widget) {
        openSnackBar('Widget created.', 'success');
        setWidgets([...widgets, widget]);
        setLoading(false);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  const handleUpdateWidget = async () => {
    if (!widgetName) {
      openSnackBar('Please enter a name for the widget.');
      return;
    }

    setLoading(true);

    try {
      const widgetParams = {
        widgetId: selectedWidget.id,
        clientId: client.id,
        name: widgetName,
        title: widgetTitle,
        body: widgetBody,
        backgroundColor,
        textColor,
        isEnabled
      };

      const { success, message } = await updateWidget(widgetParams);

      if (success) {
        openSnackBar('Widget updated.', 'success');

        const updatedWidgets = widgets.map(widget => {
          if (widget.id === selectedWidget.id) {
            return { ...widgetParams, id: selectedWidget.id };
          }
          return widget;
        });

        console.log(updatedWidgets);

        setWidgets(updatedWidgets);
        setLoading(false);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="body2">
            The Widget Creator allows you to create personalized widgets that will display on your customer's dashboard.
            Customize titles, content, and design to enhance communication that engages and informs your customer's.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper sx={{ px: 0 }}>
          <Box component="h5" mx={2}>Your Widgets</Box>
          <Divider sx={{ py: 1 }} />
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List dense>
              <ListSubheader sx={{ px: 0 }}>
                <ListItemButton onClick={() => setSelectedWidget({ id: 'new' })}>
                  <ListItemText sx={{ color: '#bebebe' }}>
                    + New Widget
                  </ListItemText>
                </ListItemButton>
              </ListSubheader>
              {
                widgets.map((widget) => {
                  return (
                    <ListItem key={widget.id} sx={{ px: 0, py: 0 }}>
                      <ListItemButton
                        selected={selectedWidget?.id === widget.id}
                        onClick={() => setSelectedWidget(widget)}>
                        <ListItemText>
                          {widget.name}
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
        <Paper sx={{ display: selectedWidget ? 'flex' : 'none' }}>
          <Box flexBasis={'50%'} py={2} px={2}>
            <Box mb={2}>
              <FormGroup>
                <FormControlLabel
                  sx={{ justifyContent: 'flex-end', mx: 0 }}
                  labelPlacement="start"
                  control={<Switch
                    disabled={loading}
                    checked={isEnabled}
                    onChange={(_, val) => setIsEnabled(val)} />}
                  label="Enabled">
                </FormControlLabel>
              </FormGroup>
            </Box>
            <Box mb={2}>
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
            <Box mb={2}>
              <TextField
                fullWidth
                value={widgetName}
                onChange={e => setWidgetName(e.target.value)}
                disabled={loading}
                variant="standard"
                label='Widget name'>
              </TextField>
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                value={widgetTitle}
                disabled={loading}
                variant="standard"
                onChange={e => setWidgetTitle(e.target.value)}
                label='Widget title'>
              </TextField>
            </Box>
            <Box mb={5}>
              <TextField
                disabled={loading}
                value={widgetBody}
                inputProps={{ sx: { resize: 'vertical' } }}
                fullWidth
                variant="standard"
                multiline
                onChange={e => setWidgetBody(e.target.value)}
                label='Widget body'>
              </TextField>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <LoadingButton
                sx={{ alignSelf: 'center' }}
                size="large"
                loading={loading}
                onClick={selectedWidget?.id === 'new' ? handleCreateWidget : handleUpdateWidget}
                variant="contained">
                Save
              </LoadingButton>
              <Tooltip title="Delete Widget" hidden={selectedWidget?.id === 'new'}>
                <IconButton
                  disabled={loading}
                  size="large"
                  edge="end"
                  sx={{ mr: 0.5 }}
                  onClick={() => { }}>
                  <DeleteOutlineIcon color="error" />
                </IconButton>
              </Tooltip>
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
                fullWidth
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
};

// function EditWidgetPanel(props) {
//   return (

//   );
// }