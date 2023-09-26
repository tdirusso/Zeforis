/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Box, Divider, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, Menu, Paper, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { useOutletContext } from "react-router-dom";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createWidget, deleteWidget, updateWidget } from "../../../api/widgets";
import './styles.scss';

export default function WidgetsTab() {

  const {
    engagement,
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
  const [deleteMenuAnchor, setDeleteMenuAnchor] = useState(null);
  const [selectedWidget, setSelectedWidget] = useState(null);

  const bgColorMenuOpen = Boolean(bgColorMenu);
  const textColorMenuOpen = Boolean(textColorMenu);

  const deleteMenuOpen = Boolean(deleteMenuAnchor);

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
        engagementId: engagement.id,
        name: widgetName,
        title: widgetTitle,
        body: widgetBody,
        backgroundColor,
        textColor,
        isEnabled
      });

      if (widget) {
        setWidgets([...widgets, widget]);
        setSelectedWidget(widget);
        setLoading(false);
        openSnackBar('Widget created.', 'success');
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
        engagementId: engagement.id,
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

  const handleDeleteWidget = async () => {
    setLoading(true);

    try {
      const { success, message } = await deleteWidget({
        widgetId: selectedWidget.id,
        engagementId: engagement.id
      });

      if (success) {
        openSnackBar('Widget deleted.', 'success');

        setWidgets(widgets => widgets.filter(widget => widget.id !== selectedWidget.id));
        setSelectedWidget(null);
        setDeleteMenuAnchor(null);
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
        <Paper className="widgets-tab">
          <Typography variant="body2">
            The Widget Creator allows you to create personalized widgets that will display on your customer's dashboard.
            Customize titles, content, and design to enhance communication that engages and informs your customer's.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper className="px0">
          <Box component="h5" mx={2} style={{ marginBottom: '20px' }}>Your Widgets</Box>
          <Divider className="my1" />
          <Box style={{ maxHeight: 300, overflow: 'auto' }}>
            <List dense>
              <ListSubheader className="px0">
                <ListItemButton
                  disabled={loading}
                  onClick={() => setSelectedWidget({ id: 'new' })}>
                  <ListItemText style={{ color: '#bebebe' }}>
                    + New Widget
                  </ListItemText>
                </ListItemButton>
              </ListSubheader>
              {
                widgets.map((widget) => {
                  return (
                    <ListItem key={widget.id} className="p0">
                      <ListItemButton
                        disabled={loading}
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

      <Grid item xs={12} md={9} className="widget-preview">
        <Paper style={{ display: selectedWidget ? 'flex' : 'none' }} className="widget-preview-container">
          <Box flexBasis={'50%'} py={2} px={2}>
            <Box mb={3}>
              <FormGroup >
                <FormControlLabel
                  className="mx0"
                  control={<Switch
                    disabled={loading}
                    checked={isEnabled}
                    onChange={(_, val) => setIsEnabled(val)} />}
                  label="Enabled">
                </FormControlLabel>
              </FormGroup>
            </Box>
            <Box mb={2}>
              <Box display="flex" justifyContent='space-between' flexDirection='column' gap='8px'>
                <Box display='flex'>
                  <Typography>Background color</Typography>
                  <Box
                    style={{
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
                    style={{
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
                inputProps={{ style: { resize: 'vertical' } }}
                fullWidth
                variant="standard"
                multiline
                onChange={e => setWidgetBody(e.target.value)}
                label='Widget body'>
              </TextField>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <LoadingButton
                size="large"
                loading={loading}
                onClick={selectedWidget?.id === 'new' ? handleCreateWidget : handleUpdateWidget}
                variant="contained">
                Save
              </LoadingButton>
              <Tooltip title="Delete Widget" hidden={selectedWidget?.id === 'new'}>
                <IconButton
                  onClick={e => setDeleteMenuAnchor(e.currentTarget)}
                  disabled={loading}
                  size="large"
                  edge="end">
                  <DeleteOutlineIcon color="error" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box style={{ flexBasis: '50%', padding: '25px' }}>
            <Paper style={{
              minHeight: '250px',
              background: backgroundColor
            }}>
              <Box
                style={{ color: textColor, marginBottom: '8px' }}
                component="h5">
                {widgetTitle}
              </Box>
              <TextField
                className="readonly-textfield"
                fullWidth
                inputProps={{
                  style: {
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
        PaperProps={{ className: 'widget-color-picker-menu' }}
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
        className="color-picker-menu"
        PaperProps={{ className: 'widget-color-picker-menu' }}
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

      <Menu
        anchorEl={deleteMenuAnchor}
        open={deleteMenuOpen}
        onClose={() => setDeleteMenuAnchor(null)}>
        <Box px={2} py={1}>
          <LoadingButton
            disabled={loading}
            color='error'
            variant='contained'
            loading={loading}
            onClick={handleDeleteWidget}>
            Delete
          </LoadingButton>
        </Box>
      </Menu>
    </>
  );
};