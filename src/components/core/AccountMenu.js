import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function AccountMenu(props) {

  const context = useOutletContext() || props;

  const {
    user,
    curOrgId,
    shouldDisable = false
  } = context;

  const { changeHandler } = props;

  const [orgId, setOrgId] = useState(curOrgId || '');

  useEffect(() => {
    //need this update since the org ID is programatically reset when drawer to change org/client is cloesd
    setOrgId(curOrgId);
  }, [curOrgId]);

  const handleSelection = e => {
    setOrgId(e.target.value);

    if (changeHandler) {
      const orgObject = user.memberOfAccounts.find(org => org.id === e.target.value);
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
          user.memberOfAccounts.map(account => {
            return (
              <MenuItem
                key={account.id}
                value={account.id}>
                {account.name}
              </MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );
};
