import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import StatsCards from "@/components/organisms/StatsCards";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import ProductTable from "@/components/organisms/ProductTable";
import ProductForm from "@/components/organisms/ProductForm";
import QuickSaleModal from "@/components/organisms/QuickSaleModal";
import StockAdjustModal from "@/components/organisms/StockAdjustModal";
import TransactionHistory from "@/components/organisms/TransactionHistory";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { transactionService } from "@/services/api/transactionService";
import { AuthContext } from "../../App";
const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  // Modal states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [showStockAdjust, setShowStockAdjust] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts(prev => [...prev, newProduct]);
      setShowProductForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      const updatedProduct = await productService.update(editingProduct.Id, productData);
      setProducts(prev => prev.map(p => p.Id === editingProduct.Id ? updatedProduct : p));
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await productService.delete(product.Id);
      setProducts(prev => prev.filter(p => p.Id !== product.Id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleQuickSale = async (productId, quantity) => {
    try {
      // Update product stock
      await productService.updateStock(productId, -quantity, "Customer purchase");
      
      // Record transaction
      await transactionService.create({
        productId,
        type: "sale",
        quantity: -quantity,
        reason: "Customer purchase"
      });
      
      // Refresh products
      loadProducts();
    } catch (error) {
      throw error;
    }
  };

  const handleStockAdjustment = async (productId, quantity, reason) => {
    try {
      // Update product stock
      await productService.updateStock(productId, quantity, reason);
      
      // Record transaction
      await transactionService.create({
        productId,
        type: "adjustment",
        quantity,
        reason
      });
      
      // Refresh products
      loadProducts();
    } catch (error) {
      throw error;
    }
  };

  // Filter and sort products
  const filteredProducts = products
.filter(product => {
      const matchesSearch = product.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.sku_c?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "" || product.category_c === selectedCategory;
      return matchesSearch && matchesCategory;
    })
.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.Name?.localeCompare(b.Name);
        case "quantity":
          return b.quantity_c - a.quantity_c;
        case "price":
          return b.price_c - a.price_c;
        case "lowStock":
          return (a.quantity_c <= a.minStock_c ? 0 : 1) - (b.quantity_c <= b.minStock_c ? 0 : 1);
        default:
          return 0;
      }
    });

  // Group products by category for sidebar
const productsByCategory = products.reduce((acc, product) => {
    acc[product.category_c] = (acc[product.category_c] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProducts} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 p-6">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            productsByCategory={productsByCategory}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
<div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Inventory Dashboard
              </h1>
              <p className="text-slate-600">
                Manage your products and track inventory levels
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <Button 
                onClick={() => setShowProductForm(true)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
                Add Product
              </Button>
              <Button 
                onClick={logout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ApperIcon name="LogOut" className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">
            <StatsCards products={products} />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or SKU..."
              />
            </div>
            
            {/* Mobile category filter */}
            <div className="lg:hidden">
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {Object.keys(productsByCategory).map(category => (
                  <option key={category} value={category}>
                    {category} ({productsByCategory[category]})
                  </option>
                ))}
              </Select>
            </div>

            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Stock</option>
              <option value="price">Sort by Price</option>
              <option value="lowStock">Low Stock First</option>
            </Select>
          </div>

          {/* Products Table */}
          <div className="mb-8">
            {filteredProducts.length === 0 ? (
              <Empty
                title={searchQuery || selectedCategory ? "No products found" : "No products yet"}
                description={
                  searchQuery || selectedCategory
                    ? "Try adjusting your search or filters to find products."
                    : "Get started by adding your first product to inventory."
                }
                actionLabel="Add First Product"
                onAction={() => setShowProductForm(true)}
                icon="Package"
              />
            ) : (
              <ProductTable
                products={filteredProducts}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setShowProductForm(true);
                }}
                onDelete={handleDeleteProduct}
                onQuickSale={(product) => {
                  setSelectedProduct(product);
                  setShowQuickSale(true);
                }}
                onStockAdjust={(product) => {
                  setSelectedProduct(product);
                  setShowStockAdjust(true);
                }}
              />
            )}
          </div>

          {/* Transaction History */}
          <TransactionHistory productData={products} />
        </div>
      </div>

      {/* Modals */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}

      {showQuickSale && selectedProduct && (
        <QuickSaleModal
          product={selectedProduct}
          onSubmit={handleQuickSale}
          onCancel={() => {
            setShowQuickSale(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showStockAdjust && selectedProduct && (
        <StockAdjustModal
          product={selectedProduct}
          onSubmit={handleStockAdjustment}
          onCancel={() => {
            setShowStockAdjust(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;