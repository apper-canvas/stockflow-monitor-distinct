import React, { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StockBadge from "@/components/molecules/StockBadge";

const ProductTable = ({ products, onEdit, onDelete, onQuickSale, onStockAdjust }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ApperIcon 
          name={sortField === field && sortDirection === "desc" ? "ChevronDown" : "ChevronUp"} 
          className={`h-4 w-4 ${sortField === field ? "text-primary-600" : "text-slate-400"}`}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <SortableHeader field="name">Product Name</SortableHeader>
              <SortableHeader field="sku">SKU</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="price">Price</SortableHeader>
              <SortableHeader field="quantity">Stock</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <SortableHeader field="lastUpdated">Last Updated</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
{sortedProducts.map((product, index) => (
              <tr 
                key={product.Id} 
                className={`hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{product.Name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">
                    {product.sku_c}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{product.category_c}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-slate-900">
                    ${product.price_c?.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    product.quantity_c === 0 ? "text-red-600" : 
                    product.quantity_c <= product.minStock_c ? "text-amber-600" : 
                    "text-slate-900"
                  }`}>
                    {product.quantity_c}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StockBadge quantity={product.quantity_c} minStock={product.minStock_c} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(new Date(product.lastUpdated_c), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onQuickSale(product)}
disabled={product.quantity_c === 0}
                      className="h-8 w-8 p-0"
                      title="Quick Sale"
                    >
                      <ApperIcon name="ShoppingCart" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onStockAdjust(product)}
                      className="h-8 w-8 p-0"
                      title="Adjust Stock"
                    >
                      <ApperIcon name="Package" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8 p-0"
                      title="Edit Product"
                    >
                      <ApperIcon name="Edit2" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(product)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete Product"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;