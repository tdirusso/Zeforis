import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";

export default function AccountMenu({ accounts, accountId, parentHandler }) {

  const [selectedAccountId, setSelectedAccountId] = useState(accountId);

  const handleSelection = e => {
    const id = e.target.value;
    setSelectedAccountId(id);

    if (parentHandler) {
      parentHandler(id);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="org-label">Organization</InputLabel>
      <Select
        labelId="org-label"
        label="Organization"
        value={selectedAccountId}
        onChange={handleSelection}>
        {
          accounts.map(account => {
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
