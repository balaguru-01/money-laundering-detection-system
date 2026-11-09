import Transaction from "../models/Transaction.js";

class NetworkAnalyzer {
  // Build transaction network graph
  async buildNetwork() {
    const transactions = await Transaction.find().lean();
    const nodes = new Set();
    const edges = [];

    transactions.forEach((txn) => {
      nodes.add(txn.fromAccount);
      nodes.add(txn.toAccount);
      edges.push({
        source: txn.fromAccount,
        target: txn.toAccount,
        amount: txn.amount,
        date: txn.date,
      });
    });

    return {
      nodes: Array.from(nodes).map((id) => ({ id })),
      edges,
    };
  }

  // Find connected components (network clusters)
  findClusters(nodes, edges) {
    const adjacencyList = {};
    nodes.forEach((node) => {
      adjacencyList[node.id] = [];
    });

    edges.forEach((edge) => {
      adjacencyList[edge.source].push(edge.target);
      adjacencyList[edge.target].push(edge.source);
    });

    const visited = new Set();
    const clusters = [];

    const dfs = (node, cluster) => {
      visited.add(node);
      cluster.push(node);
      adjacencyList[node].forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          dfs(neighbor, cluster);
        }
      });
    };

    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        const cluster = [];
        dfs(node.id, cluster);
        clusters.push(cluster);
      }
    });

    return clusters;
  }

  // Calculate centrality measures
  calculateCentrality(nodes, edges) {
    const centrality = {};
    nodes.forEach((node) => {
      centrality[node.id] = {
        degree: 0,
        betweenness: 0,
        closeness: 0,
      };
    });

    // Degree centrality
    edges.forEach((edge) => {
      centrality[edge.source].degree += 1;
      centrality[edge.target].degree += 1;
    });

    return centrality;
  }

  // Detect anomalous subgraphs
  async detectAnomalousSubgraphs() {
    const network = await this.buildNetwork();
    const clusters = this.findClusters(network.nodes, network.edges);

    // Flag clusters with suspicious characteristics
    const anomalies = [];
    clusters.forEach((cluster, idx) => {
      if (cluster.length >= 5) {
        anomalies.push({
          clusterId: idx,
          size: cluster.length,
          accounts: cluster,
          severity: cluster.length > 10 ? "high" : "medium",
        });
      }
    });

    return anomalies;
  }

  // Get account statistics
  async getAccountStats(accountId) {
    const sentTransactions = await Transaction.find({
      fromAccount: accountId,
    }).lean();
    const receivedTransactions = await Transaction.find({
      toAccount: accountId,
    }).lean();

    const totalSent = sentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalReceived = receivedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    return {
      accountId,
      sentCount: sentTransactions.length,
      receivedCount: receivedTransactions.length,
      totalSent,
      totalReceived,
      netFlow: totalReceived - totalSent,
      uniqueCounterparties: new Set([
        ...sentTransactions.map((t) => t.toAccount),
        ...receivedTransactions.map((t) => t.fromAccount),
      ]).size,
    };
  }
}

export default new NetworkAnalyzer();
