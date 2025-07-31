import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { categoryService } from "@/services/api/categoryService";

const CategorySidebar = ({ selectedCategory, onCategorySelect, productsByCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoryData = await categoryService.getAll();
      setCategories(categoryData);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const allProductsCount = Object.values(productsByCategory).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <ApperIcon name="Tag" className="h-5 w-5 text-primary-600" />
        Categories
      </h3>
      
      <div className="space-y-2">
        <Button
          variant={selectedCategory === "" ? "primary" : "ghost"}
          className="w-full justify-between h-10"
          onClick={() => onCategorySelect("")}
        >
          <span className="flex items-center gap-2">
            <ApperIcon name="Grid3x3" className="h-4 w-4" />
            All Products
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            selectedCategory === "" 
              ? "bg-white/20 text-white" 
              : "bg-slate-100 text-slate-600"
          }`}>
            {allProductsCount}
          </span>
        </Button>

        {categories.map((category) => {
          const count = productsByCategory[category.name] || 0;
          const isSelected = selectedCategory === category.name;
          
          return (
            <Button
              key={category.Id}
              variant={isSelected ? "primary" : "ghost"}
              className="w-full justify-between h-10"
              onClick={() => onCategorySelect(category.name)}
            >
              <span className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isSelected 
                  ? "bg-white/20 text-white" 
                  : "bg-slate-100 text-slate-600"
              }`}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySidebar;