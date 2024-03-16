import React, { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer as MuiDrawer,
  List,
  Divider,
  IconButton,
  ListSubheader,
  Typography,
  ListItem,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  SignalCellularAlt as SignalCellularAltIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  AddShoppingCart as AddShoppingCartIcon,
  Bookmark as BookmarkIcon,
  EmojiNature as EmojiNatureIcon,
} from "@mui/icons-material";
import { 
  ListItemButton,
   ListItemIcon,
    ListItemText 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LayoutContext from "../context/LayoutContext";

const drawerWidth = 220;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const handleToggle = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();
  const { setSelectedListItem } = useContext(LayoutContext);

  const handleListItemClick = (text) => {
    setSelectedListItem(text);
  };
  

  const menuItems = [
    { text: "Dashboard", icon: <SignalCellularAltIcon />, path: "/admin/dashboard" },
    { text: "Orders", icon: <AttachMoneyIcon />, path: "/admin/orders" },
    { text: "Users", icon: <GroupIcon />, path: "/admin/users" },
    { text: "Products", icon: <AddShoppingCartIcon />, path: "/admin/products" },
    { text: "Categories", icon: <BookmarkIcon />, path: "/admin/categories" },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
      <Box sx={{ display: "flex", alignItems: "center", opacity: open ? 1 : 0 }}>
          <EmojiNatureIcon fontSize="large" /> 
          <Typography variant="h5" sx={{ ml: 1 }}>
            Shop-bee
          </Typography>
        </Box>
        <IconButton onClick={handleToggle}>{open ? <ChevronLeftIcon /> : <MenuIcon />}</IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListSubheader sx={{ opacity: open ? 1 : 0 }}>System Setting</ListSubheader>
        {menuItems.map((item, index) => (
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            key={index}
            onClick={() => {
              handleListItemClick(item.text);
              navigate(item.path);
            }}
          >
            <ListItemButton sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
