import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";

const QuickSaleModal = ({ product, onSubmit, onCancel }) => {
  const [quantity, setQuantity] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const saleQuantity = parseInt(quantity);
    
    if (!saleQuantity || saleQuantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (saleQuantity > product.quantity) {
      toast.error("Sale quantity cannot exceed available stock");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(product.Id, saleQuantity);
      toast.success(`Sale recorded: ${saleQuantity} × ${product.name}`);
      onCancel();
    } catch (error) {
      toast.error(error.message || "Failed to record sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = (parseFloat(quantity) || 0) * product.price;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="ShoppingCart" className="h-5 w-5 text-primary-600" />
                Quick Sale
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
                  <span>Price:</span>
                  <span className="font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className={`font-semibold ${
                    product.quantity <= product.minStock ? "text-amber-600" : "text-green-600"
                  }`}>
                    {product.quantity} units
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Sale Quantity" required>
                <Input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </FormField>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Total Amount:</span>
                  <span className="text-xl font-bold text-green-900">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !quantity || parseInt(quantity) <= 0}
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Check" className="h-4 w-4 mr-2" />
                      Record Sale
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

export default QuickSaleModal;