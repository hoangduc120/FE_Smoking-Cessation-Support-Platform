import { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Divider,
  Badge,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const drawerWidth = 320;

export default function ContactList({
  contacts,
  selectedContact,
  onContactSelect,
  onContactUpdate,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSelect = (contactId) => {
    onContactSelect(contactId);
    // Mark messages as read
    onContactUpdate((prev) =>
      prev.map((contact) =>
        contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
      )
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          position: "relative",
          height: "100%",
          border: "none",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Tin nhắn
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {filteredContacts.map((contact) => (
          <ListItem
            key={contact.id}
            button
            selected={selectedContact === contact.id}
            onClick={() => handleContactSelect(contact.id)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.light",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                color="success"
                variant="dot"
                invisible={!contact.isOnline}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar src={contact.avatar} alt={contact.name} />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: contact.unreadCount > 0 ? "bold" : "normal",
                    }}
                  >
                    {contact.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {contact.timestamp}
                  </Typography>
                </Box>
              }
              secondary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "180px",
                      fontWeight: contact.unreadCount > 0 ? "bold" : "normal",
                    }}
                  >
                    {contact.lastMessage}
                  </Typography>
                  {contact.unreadCount > 0 && (
                    <Chip
                      label={contact.unreadCount}
                      size="small"
                      color="primary"
                      sx={{ minWidth: "20px", height: "20px" }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
