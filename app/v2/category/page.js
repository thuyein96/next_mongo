"use client";
import { useState, useEffect } from "react";

import CategoryForm from "@/app/v2/components/forms/CategoryForm";
import Link from "next/link";

import { DataGrid, GridToolbar , GridRowsProp, GridColDef } from "@mui/x-data-grid";

import Modal from "@mui/material/Modal";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function Home() {
  const [category, setCategory] = useState([]);
  const columns = [
    { field: "name", headerName: "Category Name", width: 150 },
    { field: 'order', headerName: 'Order', width: 150 },
    { field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => {
        return (
          <div>
            <button onClick={() => startEditMode(params.row)}>📝</button>
            <button onClick={() => deleteCategory(params.row)}>🗑️</button>
          </div>
        )
      }},
  ];

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.log(`${API_BASE}/category`);
  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      category.id = category._id;
      return category;
    });
    setCategory(c2);
  }

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  function startEditMode(category) {
    // console.log(category)
    setSelectedCategory(category);
    setEditMode(true);
    setOpen(true);
  }

  function stopEditMode() {
    setSelectedCategory(null);
    setEditMode(false);
    setOpen(false);
  }

  function handleCategoryFormSubmit(data) {
    if (editMode && selectedCategory) {
      const updateData = { ...data, _id: selectedCategory._id };
      fetch(`${API_BASE}/category/${selectedCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }).then(() => {
        fetchCategory()
        handleClose()
      });
      return
    }
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchCategory()
      handleClose()
    });
  }

  async function deleteCategory(category) {
    if (!confirm(`Are you sure to delete [${category.name}]`)) return;

    const id = category._id
    await fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE"
    })
    fetchCategory()
  }

  return (
    <main>
      {/* <form onSubmit={handleSubmit(createCategory)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4">
          <div>Category:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>Order:</div>
          <div>
            <input
              name="order"
              type="number"
              {...register("order", { required: true, defaultValue: 0 })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="col-span-2 text-right">
            {editMode ?
              <input
                type="submit"
                value="Update"
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              />

              :
              <input
                type="submit"
                value="Add"
                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            }
            {
              editMode &&
              <button
                onClick={() => {
                  reset({ name: '', order: '' })
                  setEditMode(false)
                }}
                className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              >Cancel</button>
            }
          </div>
        </div>
      </form> */}
      <div className="mx-4">
        <span>Category ({category.length})</span>
        <IconButton aria-label="new-category" color="secondary" onClick={handleOpen}>
          <AddBoxIcon />
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <CategoryForm 
            onSubmit={handleCategoryFormSubmit} 
            initialData={selectedCategory}
            editMode={editMode}
          />
        </Modal>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={category}
          columns={columns}
        />
      </div>
    </main>
  );
}
