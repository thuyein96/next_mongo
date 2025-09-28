"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import ProductForm from "@/app/v2/components/forms/ProductForm";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const columns = [
    { field: "code", headerName: "Code", width: 120 },
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "category", headerName: "Category", width: 150, 
      valueGetter: (params) => {
        const cat = category.find(c => c._id === params);
        return cat ? cat.name : 'Unknown';
      }
    },
    { field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => (
      <>
        <button
          onClick={() => handleEdit(params.row)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(params.row._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Delete
        </button>
      </>
    )}
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedProduct(null);
  };

  function handleEdit(product) {
    setSelectedProduct(product);
    setEditMode(true);
    setOpen(true);
  }

  function handleDelete(productId) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`${API_BASE}/product/${productId}`, {
        method: "DELETE",
      }).then(() => {
        fetchProducts();
      });
    }
  }

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    const p = await data.json();
    const p2 = p.map((product) => {
      product.id = product._id;
      return product;
    });
    setProducts(p2);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  function handleProductFormSubmit(data) {
    if (editMode && selectedProduct) {
      const updateData = { ...data, _id: selectedProduct._id };
      fetch(`${API_BASE}/product/${selectedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }).then(() => {
        fetchProducts();
        handleClose();
      });
      return;
    }
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchProducts();
      handleClose();
    });
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <div className="mx-4">
        <span>Products ({products.length})</span>
        <IconButton aria-label="new-product" color="secondary" onClick={handleOpen}>
          <AddBoxIcon />
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ProductForm 
            onSubmit={handleProductFormSubmit} 
            initialData={selectedProduct}
            editMode={editMode}
            categories={category}
          />
        </Modal>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={products}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </div>
    </>
  );
}
