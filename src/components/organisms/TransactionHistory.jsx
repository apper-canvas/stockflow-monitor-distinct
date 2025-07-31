import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { transactionService } from "@/services/api/transactionService";
import { toast } from "react-toastify";

const TransactionHistory = ({ productData }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getRecent(20);
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = productData.find(p => p.Id === productId);
    return product ? product.name : "Unknown Product";
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "sale":
        return "ShoppingCart";
      case "restock":
        return "Plus";
      case "adjustment":
        return "Edit2";
      default:
        return "Package";
    }
  };

  const getTransactionVariant = (type) => {
    switch (type) {
      case "sale":
        return "success";
      case "restock":
        return "info";
      case "adjustment":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Clock" className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded animate-shimmer"></div>
                  <div>
                    <div className="h-4 bg-slate-200 rounded animate-shimmer w-32 mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded animate-shimmer w-24"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-slate-200 rounded animate-shimmer w-16 mb-1"></div>
                  <div className="h-3 bg-slate-200 rounded animate-shimmer w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="Clock" className="h-5 w-5 text-primary-600" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Clock" className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.Id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-200">
                    <ApperIcon 
                      name={getTransactionIcon(transaction.type)} 
                      className="h-4 w-4 text-slate-600" 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {getProductName(transaction.productId)}
                    </p>
                    <p className="text-sm text-slate-600">{transaction.reason}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getTransactionVariant(transaction.type)}>
                      {transaction.type}
                    </Badge>
                    <span className={`font-semibold ${
                      transaction.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.quantity > 0 ? "+" : ""}{transaction.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {format(new Date(transaction.timestamp), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;