"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
  query,
  getDocs,
  collection,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Button color="inherit" onClick={handleOpen}>Add New Item</Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inventory Items
        </Typography>
        
        <Stack spacing={2}>
          {inventory.map(({ name, quantity }) => (
            <Card key={name} elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton 
                  color="primary" 
                  onClick={() => addItem(name)}
                  aria-label="add"
                >
                  <AddIcon />
                </IconButton>
                <IconButton 
                  color="secondary" 
                  onClick={() => removeItem(name)}
                  aria-label="remove"
                >
                  <RemoveIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Container>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Item
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              addItem(itemName);
              setItemName("");
              handleClose();
            }}
            sx={{ mt: 2 }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}