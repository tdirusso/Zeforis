import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function AccountMenu(props) {

  const context = useOutletContext() || props;

  const {
    user,
    account,
    changeHandler
  } = context;

  const accountId = account.id;
  const [selectedAccountId, setSelectedAccountId] = useState(accountId);

  const handleSelection = e => {
    const id = e.target.value;
    setSelectedAccountId(id);

    if (changeHandler) {
      changeHandler(id);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Organization</InputLabel>
      <Select
        label="Organization"
        value={selectedAccountId}
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
