import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const CategoryForm = ({ initialCategory, handleSubmit, handleClose }) => {
  const [category, setCategory] = useState(initialCategory || {});

  useEffect(() => {
    setCategory(initialCategory || {});
  }, [initialCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(category);
    handleClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth={true} maxWidth="md">
      <DialogTitle>
        {initialCategory ? "Edit Category" : "Add Category"}
      </DialogTitle>
      <DialogContent sx={{ overflow: "visible", height: "auto" }}>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Category Name"
                name="category_name"
                value={category.category_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={category.description || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DialogActions>
                <Button onClick={handleClose} color="primary" size="large">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                >
                  {initialCategory ? "Save" : "Add"}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
