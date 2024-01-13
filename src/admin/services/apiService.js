import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

const apiService = {
  //API Auth
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //API Users
  getUsers: async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editUser: async (userId, userData) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addUser: async (userData) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const token = getToken();
      const response = await axios.delete(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/admin/change-password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //API Orders
  getOrders: async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editOrder: async (orderId, orderData) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${orderId}`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addOrder: async (orderData) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/admin/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const token = getToken();
      const response = await axios.delete(
        `${API_BASE_URL}/admin/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //API Categories

  getCategories: async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editCategory: async (categoryId, categoryData) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_BASE_URL}/admin/categories/${categoryId}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addCategory: async (categoryData) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/admin/categories`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const token = getToken();
      const response = await axios.delete(
        `${API_BASE_URL}/admin/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //API Products

  getProducts: async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editProduct: async (productId, productData) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_BASE_URL}/admin/products/${productId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addProduct: async (productData) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/admin/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const token = getToken();
      const response = await axios.delete(
        `${API_BASE_URL}/admin/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
