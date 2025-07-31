import productsData from "@/services/mockData/products.json";

let products = [...productsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...products];
  },

  async getById(id) {
    await delay(200);
    const product = products.find(p => p.Id === parseInt(id));
    if (!product) throw new Error("Product not found");
    return { ...product };
  },

  async create(productData) {
    await delay(400);
    const maxId = Math.max(...products.map(p => p.Id), 0);
    const newProduct = {
      ...productData,
      Id: maxId + 1,
      lastUpdated: new Date().toISOString()
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(350);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Product not found");
    
    products[index] = {
      ...products[index],
      ...productData,
      Id: parseInt(id),
      lastUpdated: new Date().toISOString()
    };
    return { ...products[index] };
  },

  async delete(id) {
    await delay(250);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Product not found");
    
    const deletedProduct = products.splice(index, 1)[0];
    return { ...deletedProduct };
  },

  async updateStock(id, quantity, reason = "Stock adjustment") {
    await delay(300);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Product not found");
    
    products[index] = {
      ...products[index],
      quantity: Math.max(0, products[index].quantity + quantity),
      lastUpdated: new Date().toISOString()
    };
    
    return { ...products[index] };
  },

  async search(query) {
    await delay(200);
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    return [...filtered];
  }
};