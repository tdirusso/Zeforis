import { Box, Grid, Paper } from "@mui/material";
import React from "react";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

export default function Settings() {

  const context = useOutletContext();

  const {
    isOrgOwner,
    isAdmin
  } = context;

  return (
    <>
      <Grid item xs={3} className="settings-nav">
        <Box className="title">Engagement</Box>
        <Box>
          <ul>
            <li>
              <NavLink to="engagement/collaborators" draggable={false}>
                <GroupOutlinedIcon />
                Collaborators
              </NavLink>
            </li>
            <li hidden={!isAdmin}>
              <NavLink to="engagement/tags" draggable={false}>
                <LocalOfferOutlinedIcon />
                Tags
              </NavLink>
            </li>
            <li>
              <NavLink to="engagement/about" draggable={false}>
                <InfoOutlinedIcon />
                Details
              </NavLink>
            </li>
          </ul>
        </Box>
        <Box className="title" mt={5} hidden={!isOrgOwner}>
          Organization
        </Box>
        <Box hidden={!isOrgOwner}>
          <ul>
            <li>
              <NavLink to="organization/members" draggable={false}>
                <LockOpenOutlinedIcon />
                Members & Permissions
              </NavLink>
            </li>
            <li>
              <NavLink to="organization/about" draggable={false}>
                <InfoOutlinedIcon />
                Details
              </NavLink>
            </li>
          </ul>
        </Box>
        <Box className="title" mt={5}>
          Account
        </Box>
        <Box>
          <ul>
            <li>
              <NavLink to="account/profile" draggable={false}>
                <AccountBoxOutlinedIcon />
                Profile
              </NavLink>
            </li>
            <li hidden={!isOrgOwner}>
              <NavLink to="account/billing" draggable={false}>
                <MonetizationOnOutlinedIcon />
                Billing & Plan
              </NavLink>
            </li>
          </ul>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Outlet context={context} />
      </Grid>
    </>
  );
};

export function SettingsSection() {
  return (
    <Paper className="settings-container">
      <Outlet context={useOutletContext()} />
    </Paper>
  );
}