import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { categoryService } from "@/services/api/categoryService";

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    quantity: "",
    minStock: "10"
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        quantity: product.quantity?.toString() || "",
        minStock: product.minStock?.toString() || "10"
      });
    }
  }, [product]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoryData = await categoryService.getAll();
      setCategories(categoryData);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Valid quantity is required";
    }

    if (!formData.minStock || isNaN(formData.minStock) || parseInt(formData.minStock) < 0) {
      newErrors.minStock = "Valid minimum stock is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock)
      };

      await onSubmit(submitData);
      toast.success(product ? "Product updated successfully!" : "Product created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <Button variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
          <ApperIcon name="X" className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Product Name" required error={errors.name}>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter product name"
            />
          </FormField>

          <FormField label="SKU" required error={errors.sku}>
            <Input
              value={formData.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
              placeholder="Enter SKU"
            />
          </FormField>

          <FormField label="Category" required error={errors.category}>
            <Select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Price" required error={errors.price}>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Current Stock" required error={errors.quantity}>
            <Input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              placeholder="0"
            />
          </FormField>

          <FormField label="Minimum Stock Alert" required error={errors.minStock}>
            <Input
              type="number"
              min="0"
              value={formData.minStock}
              onChange={(e) => handleChange("minStock", e.target.value)}
              placeholder="10"
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                {product ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {product ? "Update Product" : "Create Product"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;