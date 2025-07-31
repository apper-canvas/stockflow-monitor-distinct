import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-full p-8 mb-6">
        <ApperIcon name={icon} className="h-16 w-16 text-slate-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;