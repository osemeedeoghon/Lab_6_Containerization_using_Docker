import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const API = "http://localhost:3001/formData";

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await fetch(API);
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load records", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  function showToast(message, severity = "success") {
    setSnackbar({ open: true, message, severity });
  }

  function openCreate() {
    setSelected(null);
    setIsCreateMode(true);
    setIsDialogOpen(true);
  }

  function openEdit(record) {
    setSelected(record);
    setIsCreateMode(false);
    setIsDialogOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast("Deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete", "error");
    }
  }

  async function handleSave(formValues) {
    if (isCreateMode) {
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formValues, id: generateId() })
        });
        if (!res.ok) throw new Error("Create failed");
        const newRec = await res.json();
        setRecords((prev) => [...prev, newRec]);
        showToast("Created");
        setIsDialogOpen(false);
      } catch (err) {
        console.error(err);
        showToast("Failed to create", "error");
      }
    } else {
      try {
        const res = await fetch(`${API}/${formValues.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        showToast("Updated");
        setIsDialogOpen(false);
      } catch (err) {
        console.error(err);
        showToast("Failed to update", "error");
      }
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Assignment #5 - React CRUD with Material UI</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        {loading && <Typography>Loading...</Typography>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Actions</Typography>
              <Button startIcon={<AddIcon />} sx={{ mt: 2 }} variant="contained" fullWidth onClick={openCreate}>
                New Record
              </Button>
              <Button sx={{ mt: 2 }} variant="outlined" fullWidth onClick={() => window.location.reload()}>
                Refresh Table
              </Button>
              <Typography sx={{ mt: 2 }} variant="body2">Records: {records.length}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Records Table</Typography>
              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.age}</TableCell>
                        <TableCell>{r.country}</TableCell>
                        <TableCell>{r.isStudent ? "Yes" : "No"}</TableCell>
                        <TableCell>{r.rating}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => openEdit(r)} aria-label="edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(r.id)} aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <RecordDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={isCreateMode ? null : selected}
        isCreateMode={isCreateMode}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function RecordDialog({ open, onClose, onSave, initialData, isCreateMode }) {
  const [form, setForm] = useState(defaultForm());

  useEffect(() => {
    if (initialData) setForm({ ...initialData });
    else setForm(defaultForm());
  }, [initialData, open]);

  function defaultForm() {
    return {
      id: generateId(),
      name: "",
      email: "",
      age: 0,
      height: 0,
      birthDate: "",
      gender: "",
      country: "",
      isStudent: false,
      rating: 5,
      notes: ""
    };
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert("Name and email are required");
      return;
    }
    onSave(form);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isCreateMode ? "New Record" : "Edit Record"}</DialogTitle>
      <DialogContent>
        <form id="record-form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" fullWidth required />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Age" name="age" value={form.age} onChange={handleChange} type="number" fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Height" name="height" value={form.height} onChange={handleChange} type="number" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Birth Date" name="birthDate" value={form.birthDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select labelId="gender-label" label="Gender" name="gender" value={form.gender} onChange={handleChange}>
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Country" name="country" value={form.country} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Checkbox checked={form.isStudent} onChange={handleChange} name="isStudent" />} label="Is Student" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Rating (1-10)" name="rating" value={form.rating} onChange={handleChange} type="number" inputProps={{ min: 1, max: 10 }} fullWidth />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button form="record-form" type="submit" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function generateId() {
  return Math.random().toString(16).slice(2, 6);
}

export default App;
