import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";

const StockAdjustModal = ({ product, onSubmit, onCancel }) => {
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const adjustQuantity = parseInt(quantity);
    
    if (!adjustQuantity || adjustQuantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for the adjustment");
      return;
    }

    const finalQuantity = adjustmentType === "add" ? adjustQuantity : -adjustQuantity;

    if (adjustmentType === "remove" && adjustQuantity > product.quantity) {
      toast.error("Cannot remove more items than available in stock");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(product.Id, finalQuantity, reason.trim());
      toast.success(`Stock adjusted: ${adjustmentType === "add" ? "+" : "-"}${adjustQuantity} ${product.name}`);
      onCancel();
    } catch (error) {
      toast.error(error.message || "Failed to adjust stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const newQuantity = adjustmentType === "add" 
    ? product.quantity + (parseInt(quantity) || 0)
    : Math.max(0, product.quantity - (parseInt(quantity) || 0));

  const adjustmentReasons = {
    add: [
      "New inventory received",
      "Stock correction",
      "Return from customer",
      "Found additional items"
    ],
    remove: [
      "Damaged items",
      "Expired products",
      "Theft/Loss",
      "Quality control",
      "Stock correction"
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Package" className="h-5 w-5 text-primary-600" />
                Adjust Stock
              </CardTitle>
              <Button variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Stock:</span>
                  <span className="font-semibold">{product.quantity} units</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Adjustment Type" required>
                <Select
                  value={adjustmentType}
                  onChange={(e) => {
                    setAdjustmentType(e.target.value);
                    setReason("");
                  }}
                >
                  <option value="add">Add to Stock</option>
                  <option value="remove">Remove from Stock</option>
                </Select>
              </FormField>

              <FormField label="Quantity" required>
                <Input
                  type="number"
                  min="1"
                  max={adjustmentType === "remove" ? product.quantity : undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </FormField>

              <FormField label="Reason" required>
                <Select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  {adjustmentReasons[adjustmentType].map((reasonOption) => (
                    <option key={reasonOption} value={reasonOption}>
                      {reasonOption}
                    </option>
                  ))}
                </Select>
              </FormField>

              {quantity && (
                <div className={`p-4 rounded-lg border ${
                  adjustmentType === "add" 
                    ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200" 
                    : "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Stock Level:</span>
                    <span className="text-xl font-bold">{newQuantity} units</span>
                  </div>
                  <div className="text-sm mt-1">
                    <span className={adjustmentType === "add" ? "text-green-700" : "text-amber-700"}>
                      {adjustmentType === "add" ? "+" : "-"}{quantity} units
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !quantity || !reason}
                  variant={adjustmentType === "add" ? "primary" : "accent"}
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                      Adjusting...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Check" className="h-4 w-4 mr-2" />
                      Adjust Stock
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockAdjustModal;