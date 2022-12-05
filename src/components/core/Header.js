import { Paper, Typography } from "@mui/material";
import './styles/Header.css';
import SearchIcon from '@mui/icons-material/Search';

export default function Header() {
  return (
    <Paper sx={{width: '100%', mb: 1}} elevation={1} className="Header">
      <button className="search-btn flex-centered">
        <SearchIcon color="primary" fontSize="small"/>
        <Typography variant="span">Search...</Typography>
      </button>
    </Paper>
  )
};
