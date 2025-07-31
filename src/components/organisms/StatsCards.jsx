import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";

const StatsCards = ({ products }) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const lowStockCount = products.filter(product => product.quantity <= product.minStock && product.quantity > 0).length;
  const outOfStockCount = products.filter(product => product.quantity === 0).length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: "Package",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      title: "Inventory Value",
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: "DollarSign",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: "AlertTriangle",
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50 to-orange-100"
    },
    {
      title: "Out of Stock",
      value: outOfStockCount,
      icon: "XCircle",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gradient-to-br ${stat.bgColor}`}>
                <ApperIcon 
                  name={stat.icon} 
                  className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className={`h-2 rounded-full bg-gradient-to-r ${stat.color} opacity-20`}></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;