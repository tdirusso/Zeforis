import { Box, LinearProgress, Paper, Typography, Button } from "@mui/material";
import './styles/dashboard.css';

import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {

  const {
    client,
    folders,
    tasks
  } = useOutletContext();

  const foldersMap = {};

  const keyTasks = [];

  folders.forEach(folder => {
    foldersMap[folder.id] = { ...folder, tasks: [] };
  });

  tasks.forEach(task => {
    foldersMap[task.folder_id].tasks.push(task);

    if (task.is_key_task) keyTasks.push(task);
  });

  return (
    <Paper className="Dashboard" sx={{ p: 5 }}>
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <h2>Key Tasks</h2>
          <Box display="flex" textAlign="center" pl={3} pr={3}>
            <h4>Task Item</h4>
            <h4 style={{ flex: 1 }}>Progress</h4>
            <h4 style={{ width: 85 }}>Links</h4>
          </Box>
          {
            keyTasks.map(task => {
              return (
                <Box
                  display="flex"
                  textAlign="center"
                  pl={3}
                  pr={3}
                  alignItems="center"
                  gap={3}
                  mb={2}
                  key={task.task_id}
                  justifyContent="center">
                  <Typography component={Link} to={`/home/task/${task.task_id}?exitPath=/home/dashboard`}>
                    {task.task_name}
                  </Typography>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        sx={{
                          height: 10,
                          width: '100%',
                          mr: 1.5
                        }}
                      />
                      <span>{task.progress}%</span>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    component="a"
                    href={task.link_url}
                    target="_blank"
                    disabled={task.link_url === '' || task.link_url === null}
                    size="small">
                    Open Link
                  </Button>
                </Box>
              );
            })
          }
        </Paper>
      </Box>

      <Box sx={{ display: 'flex' }}>
        {
          folders.map(folder => {
            return (
              <Paper key={folder.id} sx={{ p: 3, m: 3 }}>
                <h4>{folder.name}</h4>
                <Box display="flex" alignItems="center" gap={5}>
                  <h5>Task Item</h5>
                  <h5>Links</h5>
                </Box>
                {
                  foldersMap[folder.id].tasks?.slice(0, 3).map(task => {
                    let taskName = task.task_name;
                    if (task.task_name.length > 15) {
                      taskName = taskName.substring(0, 15) + ' ...';
                    }
                    return (
                      <Box key={task.task_id}>
                        {taskName}
                        <Button
                          variant="outlined"
                          component="a"
                          href={task.link_url}
                          target="_blank"
                          disabled={task.link_url === '' || task.link_url === null}
                          size="small">
                          Open Link
                        </Button>
                      </Box>
                    );
                  })
                }
                <br></br>
                <Button>View More</Button>
              </Paper>
            );
          })
        }
      </Box>
    </Paper>
  );
};
