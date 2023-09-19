/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngagementTab from "../../../components/core/settings/engagement";
import OrgTab from "../../../components/core/settings/org";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTab from "../../../components/core/settings/account/";
import { useLocation } from "react-router-dom";

const buttonStyles = {
  padding: '10px 15px',
  borderRadius: '24px',
  transition: 'color 200ms linear'
};

export default function Settings() {
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const qsTab = queryParams.get('tab');
  const isPaymentSuccess = queryParams.get('isPaymentSuccess');

  const initialTabValue = isPaymentSuccess ? 2 : (Number(qsTab) || 0);
  const [tabVal, setTabVal] = useState(initialTabValue);

  useEffect(() => {
    if (!isPaymentSuccess) {
      const newQsTab = queryParams.get('tab');
      if ((Number(newQsTab) || 0) !== tabVal) {
        setTabVal(Number(newQsTab));
      }
    }
  }, [search]);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <EngagementTab />;
      case 1:
        return <OrgTab />;
      case 2:
        return <AccountTab isPaymentSuccess={isPaymentSuccess} />;
      default:
        break;
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box display='flex' gap='1rem' flexWrap='wrap'>
          <Paper className={`custom-tab ${tabVal === 0 ? 'active' : ''}`}>
            <Button
              onClick={() => setTabVal(0)}
              style={{
                ...buttonStyles,
                color: tabVal === 0 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<AccountBoxIcon />}>
              Engagement
            </Button>
          </Paper>

          <Paper className={`custom-tab ${tabVal === 1 ? 'active' : ''}`}>
            <Button
              onClick={() => setTabVal(1)}
              style={{
                ...buttonStyles,
                color: tabVal === 1 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<ApartmentIcon />}>
              Organization
            </Button>
          </Paper>
          <Paper className={`custom-tab ${tabVal === 2 ? 'active' : ''}`}>
            <Button
              onClick={() => setTabVal(2)}
              style={{
                ...buttonStyles,
                color: tabVal === 2 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<ManageAccountsIcon />}>
              My Account
            </Button>
          </Paper>
        </Box>
      </Grid>
      {
        getTabContent()
      }
    </>
  );
};
