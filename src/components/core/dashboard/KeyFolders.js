import { Box, LinearProgress, Paper, Typography, Button, Grid } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

export default function KeyFolders() {

  const {
    keyFolders,
    folders
  } = useOutletContext();

  return (
    <>
      {
        folders.map(folder => {
          return (
            <Grid item xs={12} md={6} key={folder.id}>
              <Paper>
                <Box
                  component="h5"
                  sx={{ mb: 3 }}>Key Tasks</Box>
                <h4>{folder.name}</h4>
                <Box display="flex" alignItems="center" gap={5}>
                  <h5>Task Item</h5>
                  <h5>Links</h5>
                </Box>
                {
                  folder.tasks?.slice(0, 3).map(task => {
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
            </Grid>
          );
        })
      }
    </>
  );
};
