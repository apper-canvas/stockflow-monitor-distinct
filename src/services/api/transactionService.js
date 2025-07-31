const tableName = 'transaction_c';

export const transactionService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [{
          fieldName: "timestamp_c",
          sorttype: "DESC"
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
        console.error("Error fetching transactions:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching transactions:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "timestamp_c" } }
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
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching transaction with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  },

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: transactionData.Name || `Transaction for Product ${transactionData.productId_c || transactionData.productId}`,
          productId_c: parseInt(transactionData.productId_c || transactionData.productId),
          type_c: transactionData.type_c || transactionData.type,
          quantity_c: parseInt(transactionData.quantity_c || transactionData.quantity),
          reason_c: transactionData.reason_c || transactionData.reason,
          timestamp_c: new Date().toISOString()
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
          console.error(`Failed to create transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating transaction:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating transaction:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getByProductId(productId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [{
          FieldName: "productId_c",
          Operator: "EqualTo",
          Values: [parseInt(productId)]
        }],
        orderBy: [{
          fieldName: "timestamp_c",
          sorttype: "DESC"
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
        console.error("Error fetching transactions by product ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching transactions by product ID:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getRecent(limit = 10) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        orderBy: [{
          fieldName: "timestamp_c",
          sorttype: "DESC"
        }],
        pagingInfo: {
          limit: limit,
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
        console.error("Error fetching recent transactions:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching recent transactions:", error.message);
        throw new Error(error.message);
      }
    }
  }
};