import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function OrgMenu(props) {

  const { user } = useOutletContext() || props;
  const {
    changeHandler,
    curOrgId,
    shouldDisable
  } = props;

  const [orgId, setOrgId] = useState(curOrgId || '');


  useEffect(() => {
    //need this update since the org ID is programatically reset when drawer to change org/engagement is cloesd
    if (curOrgId) {
      setOrgId(curOrgId);
    } else {
      setOrgId('');
    }
  }, [curOrgId]);

  const handleSelection = e => {
    setOrgId(e.target.value);

    if (changeHandler) {
      const orgObject = user.memberOfOrgs.find(org => org.id === e.target.value);
      changeHandler(orgObject);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Organization</InputLabel>
      <Select
        label="Organization"
        value={orgId}
        disabled={shouldDisable}
        onChange={handleSelection}>
        {
          user.memberOfOrgs.map(org => {
            return (
              <MenuItem
                key={org.id}
                value={org.id}>
                {org.name}
              </MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );
};
