import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ProductForm({ onSubmit, initialData, editMode, categories, onClose }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { code: '', name: '', categoryId: '', price: 0, description: '' }
  });
  useEffect(() => {
    if(initialData) {
      reset({
        code: initialData.code || '',
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        category: initialData.category || ''
      })
    }
  }, [initialData, reset]);
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {editMode ? 'Edit Product' : 'Add Product'}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 m-4">
            <div>Code:</div>
            <div>
              <input
                name="code"
                type="text"
                {...register("code", { required: true })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>Description:</div>
            <div>
              <textarea
                name="description"
                rows="3"
                {...register("description", { required: true })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>Price:</div>
            <div>
              <input
                name="price"
                type="number"
                step="0.01"
                {...register("price", { required: true })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>Category:</div>
            <div>
              <select
                name="category"
                {...register("category", { required: true })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="submit"
                value={editMode ? "Edit" : "Add"}
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              />
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              />
            </div>
          </div>
        </form>
      </Typography>
    </Box>
  );
}