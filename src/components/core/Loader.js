import { Box, CircularProgress } from "@mui/material";


export default function Loader() {
    return (
      <Box className="flex-centered" style={{ height: '100%' }}>
        <CircularProgress />
      </Box>
    );

};
