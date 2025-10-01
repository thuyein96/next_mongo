"use client";

import { useEffect, useState } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import { IconButton, Modal } from "@mui/material";
import ProductForm from "../components/forms/ProductForm";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddBoxIcon from "@mui/icons-material/AddBox";


export default function Home() {
  const columns = [
    { field: "code", headerName: "Code", width: 150 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "category", headerName: "Category", width: 150, 
      valueGetter: (params) => {
        const cat = category.find(c => c._id === params);
        return cat ? cat.name : 'Unknown';
      }
    },
    { field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => {
        return (
          <div>
            <button 
              onClick={() => startEdit(params.row)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
            >
              📝
            </button>
            <button 
              onClick={() => deleteProduct(params.row._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              ❌
            </button>
          </div>
        );
      }
    }
  ];
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedProduct(null);
  }

  const startEdit = (product) => {
    setSelectedProduct(product);
    setEditMode(true);
    setOpen(true);
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
        fetchProducts()
        handleClose()
      });
      return
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

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_BASE}/product/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">
          {/* <form onSubmit={handleSubmit(createProduct)}>
            <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
              <div>Code:</div>
              <div>
                <input
                  name="code"
                  type="text"
                  {...register("code", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Description:</div>
              <div>
                <textarea
                  name="description"
                  {...register("description", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Price:</div>
              <div>
                <input
                  name="name"
                  type="number"
                  {...register("price", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Category:</div>
              <div>
                <select
                  name="category"
                  {...register("category", { required: true })}
                  className="border border-black w-full"
                >
                  {category.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="submit"
                  value="Add"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              </div>
            </div>
          </form> */}
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
            onClose={handleClose}
          />
        </Modal>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={products}
            columns={columns}
          />
          {/* <h1 className="text-2xl">Products ({products.length})</h1>
          <ul className="list-disc ml-8">
            {
              products.map((p) => (
                <li key={p._id}>
                  <button className="border border-black p-1/2" onClick={startEdit(p._id)}>📝</button>{' '}
                  <button className="border border-black p-1/2" onClick={deleteById(p._id)}>❌</button>{' '}
                  <Link href={`/product/${p._id}`} className="font-bold">
                    {p.name}
                  </Link>{" "}
                  - {p.description}
                </li>
              ))}
          </ul> */}
        </div>
      </div>
    </>
  );
}
