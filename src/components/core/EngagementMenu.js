import { FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Typography } from "@mui/material";

export default function EngagementMenu(props) {

  const {
    changeHandler,
    curEngagementId,
    engagements,
    shouldDisable = false
  } = props;

  const [engagementId, setEngagementId] = useState(curEngagementId || '');

  const label = engagementId ? 'Engagement' : 'Select Engagement';

  const handleSelection = e => {
    setEngagementId(e.target.value);

    if (changeHandler) {
      const selectedEngagementObject = engagements.find(engagement => engagement.id === e.target.value);
      changeHandler(selectedEngagementObject);
    }
  };

  useEffect(() => {
    //need this check & update since the array of engagements can be updated when user is changing orgs
    //note - the "engagements" variable changes, followed by curEngagementId
    //curEngagementId is also updated back to its original value when the change drawer is closed
    if (curEngagementId) {
      setEngagementId(curEngagementId);
    } else {
      setEngagementId('');
    }
  }, [curEngagementId]);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={engagementId}
        label={label}
        disabled={shouldDisable}
        inputProps={{
          sx: {
            display: 'flex',
            alignItems: 'center'
          }
        }}
        onChange={handleSelection}>
        {
          engagements.map(engagement => {
            return (
              <MenuItem sx={{
                display: 'flex',
                alignItems: 'center',
              }}
                key={engagement.id}
                value={engagement.id}>
                {engagement.name}
                <Typography variant="body2" color="#b9b9b9" sx={{ ml: 1.5 }}>
                  {
                    engagement.access === 'admin' ? 'Admin' : 'Member'
                  }
                </Typography>
              </MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );
};
