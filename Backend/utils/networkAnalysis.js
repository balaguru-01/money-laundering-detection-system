// Network Analysis for Transaction Visualization
const {
  mockTransactions,
  mockAccounts,
  mockBanks,
} = require("../data/mockData");

/**
 * Build network graph from transactions
 * @param {Array} transactions
 * @returns {Object} Network graph with nodes and links
 */
function buildNetworkGraph(transactions) {
  const nodes = new Map();
  const links = [];

  // Add account nodes
  mockAccounts.forEach((acc) => {
    nodes.set(acc.id, {
      id: acc.id,
      label: acc.name,
      type: "account",
      balance: acc.balance,
      risk: acc.risk,
      size: Math.log(acc.balance) / 2,
    });
  });

  // Add bank nodes
  mockBanks.forEach((bank) => {
    nodes.set(bank.id, {
      id: bank.id,
      label: bank.name,
      type: "bank",
      country: bank.country,
      size: 8,
    });
  });

  // Create links from transactions
  const linkMap = new Map();
  transactions.forEach((tx) => {
    const linkKey = `${tx.fromAccount}-${tx.toAccount}`;
    if (linkMap.has(linkKey)) {
      const existing = linkMap.get(linkKey);
      existing.value += tx.amount;
      existing.count += 1;
    } else {
      linkMap.set(linkKey, {
        source: tx.fromAccount,
        target: tx.toAccount,
        value: tx.amount,
        count: 1,
        type: tx.type,
      });
    }
  });

  links.push(...linkMap.values());

  return {
    nodes: Array.from(nodes.values()),
    links: links,
  };
}

/**
 * Calculate network statistics
 * @param {Array} transactions
 * @returns {Object} Network statistics
 */
function getNetworkStats(transactions) {
  const uniqueAccounts = new Set();
  let totalVolume = 0;
  const accountOutflow = {};

  transactions.forEach((tx) => {
    uniqueAccounts.add(tx.fromAccount);
    uniqueAccounts.add(tx.toAccount);
    totalVolume += tx.amount;

    if (!accountOutflow[tx.fromAccount]) {
      accountOutflow[tx.fromAccount] = 0;
    }
    accountOutflow[tx.fromAccount] += tx.amount;
  });

  // Find hub accounts (highest outflow)
  const hubAccounts = Object.entries(accountOutflow)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([account, volume]) => ({ account, volume }));

  return {
    uniqueNodes: uniqueAccounts.size,
    totalTransactions: transactions.length,
    totalVolume: totalVolume,
    avgTransactionSize: totalVolume / transactions.length,
    hubAccounts: hubAccounts,
  };
}

module.exports = {
  buildNetworkGraph,
  getNetworkStats,
};
