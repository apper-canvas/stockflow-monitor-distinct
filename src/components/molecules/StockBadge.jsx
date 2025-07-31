import React from "react";
import Badge from "@/components/atoms/Badge";

const StockBadge = ({ quantity, minStock = 10 }) => {
  const getStockStatus = () => {
    if (quantity === 0) {
      return { variant: "danger", text: "Out of Stock" };
    } else if (quantity <= minStock) {
      return { variant: "warning", text: "Low Stock" };
    } else {
      return { variant: "success", text: "In Stock" };
    }
  };

  const status = getStockStatus();

  return (
    <Badge variant={status.variant}>
      {status.text}
    </Badge>
  );
};

export default StockBadge;