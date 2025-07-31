const tableName = 'product_c';

export const productService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "minStock_c" } },
          { field: { Name: "lastUpdated_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        pagingInfo: {
          limit: 1000,
          offset: 0
        }
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching products:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "minStock_c" } },
          { field: { Name: "lastUpdated_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching product with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  },

  async create(productData) {
    try {
      const params = {
        records: [{
          Name: productData.Name || productData.name,
          sku_c: productData.sku_c || productData.sku,
          category_c: productData.category_c || productData.category,
          price_c: parseFloat(productData.price_c || productData.price),
          quantity_c: parseInt(productData.quantity_c || productData.quantity),
          minStock_c: parseInt(productData.minStock_c || productData.minStock),
          lastUpdated_c: new Date().toISOString()
        }]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create products ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        return response.results.find(result => result.success)?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating product:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async update(id, productData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: productData.Name || productData.name,
          sku_c: productData.sku_c || productData.sku,
          category_c: productData.category_c || productData.category,
          price_c: parseFloat(productData.price_c || productData.price),
          quantity_c: parseInt(productData.quantity_c || productData.quantity),
          minStock_c: parseInt(productData.minStock_c || productData.minStock),
          lastUpdated_c: new Date().toISOString()
        }]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update products ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        return response.results.find(result => result.success)?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating product:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete products ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.find(result => result.success)?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting product:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async updateStock(id, quantity, reason = "Stock adjustment") {
    try {
      // First get current product
      const currentProduct = await this.getById(id);
      
      const params = {
        records: [{
          Id: parseInt(id),
          quantity_c: Math.max(0, currentProduct.quantity_c + quantity),
          lastUpdated_c: new Date().toISOString()
        }]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update stock ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.find(result => result.success)?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating stock:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating stock:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "minStock_c" } },
          { field: { Name: "lastUpdated_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "Name",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "sku_c",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "category_c",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }],
        pagingInfo: {
          limit: 1000,
          offset: 0
        }
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error searching products:", error.message);
        throw new Error(error.message);
      }
    }
  }
};