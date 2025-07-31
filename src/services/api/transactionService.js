import transactionsData from "@/services/mockData/transactions.json";

let transactions = [...transactionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getAll() {
    await delay(250);
    return [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await delay(150);
    const transaction = transactions.find(t => t.Id === parseInt(id));
    if (!transaction) throw new Error("Transaction not found");
    return { ...transaction };
  },

  async create(transactionData) {
    await delay(200);
    const maxId = Math.max(...transactions.map(t => t.Id), 0);
    const newTransaction = {
      ...transactionData,
      Id: maxId + 1,
      timestamp: new Date().toISOString()
    };
    transactions.push(newTransaction);
    return { ...newTransaction };
  },

  async getByProductId(productId) {
    await delay(200);
    const filtered = transactions.filter(t => t.productId === parseInt(productId));
    return [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getRecent(limit = 10) {
    await delay(200);
    return [...transactions]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
};