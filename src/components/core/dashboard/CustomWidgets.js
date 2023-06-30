import { Paper, Box, TextField, Grid, Divider, Tooltip, IconButton, Grow, Collapse } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import React, { useState } from "react";

export default function CustomWidgets({ widgets }) {
  const showDashboardWidgetsValue = localStorage.getItem('showDashboardWidgets');
  const showWidgetsOnLoad = showDashboardWidgetsValue === null || showDashboardWidgetsValue === 'true';

  const [expanded, setExpanded] = useState(showWidgetsOnLoad);

  const toggleWidgets = () => {
    localStorage.setItem('showDashboardWidgets', !expanded);
    setExpanded(!expanded);
  };

  return (
    <>
      <Grid item xs={12} hidden={widgets.length === 0}>
        <Divider textAlign="left">
          <Tooltip title={expanded ? 'Hide Widgets' : 'Show Widgets'}>
            <IconButton
              size="large"
              onClick={toggleWidgets}>
              <ArrowUpwardIcon
                sx={{
                  transition: 'transform 200ms',
                  transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)'
                }}
              />
            </IconButton>
          </Tooltip>
        </Divider>
      </Grid>
      <Grid item xs={12} sx={{ pt: '10px !important' }}>
        <Collapse in={expanded}>
          <Grid container spacing={3}>
            {
              widgets.filter(({ isEnabled }) => isEnabled).map(widget => {
                return (
                  <Grid item xs={12} md={4} key={widget.id}>
                    <Grow in={expanded} appear={false}>
                      <Paper sx={{
                        minHeight: '250px',
                        background: widget.backgroundColor
                      }}>
                        <Box
                          color={widget.textColor}
                          component="h5"
                          mb={1}>{widget.title}</Box>
                        <TextField
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root::before': { borderBottom: 'none !important' },
                            '& .MuiInputBase-root::after': { borderBottom: 'none !important' }
                          }}
                          inputProps={{
                            sx: {
                              color: widget.textColor,
                              fontWeight: 400,
                              fontSize: '0.875rem'
                            }
                          }}
                          InputProps={{ readOnly: true }}
                          variant="standard"
                          value={widget.body}
                          multiline>
                        </TextField>
                      </Paper>
                    </Grow>
                  </Grid>
                );
              })
            }
          </Grid>
        </Collapse>
      </Grid>
      <Grid item xs={12} sx={{ display: expanded && widgets.length > 0 ? 'block' : 'none' }}>
        <Divider />
      </Grid >
    </>
  );
};
