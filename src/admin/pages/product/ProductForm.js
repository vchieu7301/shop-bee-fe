import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import apiService from '../../services/apiService';

const ProductForm = ({
  initialProduct,
  handleSubmit,
  handleClose,
  handleAddCategory,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [product, setProduct] = useState(initialProduct || {});
  const [categoryList, setCategoryList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [addCategoryDialog, setAddCategoryDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [currentImage, setCurrentImage] = useState(product.images || null);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await apiService.getCategories();
        if (response && response.result) {
          setCategoryList(response.result);
        }
      } catch (error) {
        console.error("Error fetching categories list:", error);
      }
    };
    setProduct(initialProduct || {});
    setCurrentImage(initialProduct?.image || null);
    fetchCategoryList();
  }, [initialProduct, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.onload = (event) => {
        const base64String = event.target.result.split(",")[1];
        setPreviewImage(event.target.result);
        setImageFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setCurrentImage(null);
    setPreviewImage(null);
  };

  const handleAddCategoryDialogOpen = () => {
    setAddCategoryDialog(true);
  };

  const handleAddCategoryDialogClose = () => {
    setAddCategoryDialog(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const productData = {
      product_name: product.name,
      product_description: product.description,
      price: product.price,
      quantity: product.quantity,
      category_id: product.category_id,
      images: imageFile,
    };
    handleSubmit(productData);
    handleClose();
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const categoryData = {
      category_name: categoryName,
      description: categoryDescription,
    };
    await handleAddCategory(categoryData);
    setAddCategoryDialog(false);
  };

  const imageUrl = apiUrl + "/images/" + currentImage;

  return (
    <Box>
      <Dialog
        open={true}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="md"
        sx={{}}
      >
        <DialogTitle>
          {initialProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent sx={{ overflow: "visible", height: "auto" }}>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={product.name || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={product.description || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Price"
                  type="number"
                  name="price"
                  value={product.price || "0"}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={product.quantity || "0"}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <InputLabel id="category-select-label">
                        Select a Category*
                      </InputLabel>
                      <Select
                        id="category-select"
                        name="category_id"
                        value={product.category_id || "0"}
                        label="Select a Category"
                        labelId="category-select-label"
                        onChange={handleChange}
                      >
                        <MenuItem value="0">
                          <em>-None-</em>
                        </MenuItem>
                        {categoryList.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.category_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <IconButton
                      color="primary"
                      onClick={handleAddCategoryDialogOpen}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box component="div" xs={3}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="image-upload-input"
                  />
                  <label htmlFor="image-upload-input">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Image
                    </Button>
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12}>
                {currentImage && (
                  <Box>
                    <img
                      src={imageUrl}
                      alt="Current Images"
                      style={{
                        maxWidth: "30%",
                        height: "auto",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleDeleteImage}
                      style={{ marginTop: "10px" }}
                    >
                      Undo Image
                    </Button>
                  </Box>
                )}
                {previewImage && (
                  <Box>
                    <img
                      src={previewImage}
                      alt="Images Preview"
                      style={{
                        maxWidth: "30%",
                        height: "auto",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleDeleteImage}
                      style={{ marginTop: "10px" }}
                    >
                      Undo Image
                    </Button>
                  </Box>
                )}
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
                    {initialProduct ? "Save" : "Add"}
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addCategoryDialog}
        onClose={handleAddCategoryDialogClose}
        fullWidth={true}
      >
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent sx={{ overflow: "visible", height: "auto" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Category Name"
                name="category_name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <DialogActions>
                <Button
                  onClick={handleAddCategoryDialogClose}
                  color="primary"
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addCategory}
                  color="primary"
                  variant="contained"
                  size="large"
                >
                  Add
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductForm;
