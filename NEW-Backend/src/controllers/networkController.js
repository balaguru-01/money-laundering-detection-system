import Account from "../models/Account.js";
import networkAnalyzer from "../utils/networkAnalyzer.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get network graph
export const getNetwork = asyncHandler(async (req, res) => {
  const network = await networkAnalyzer.buildNetwork();
  const clusters = networkAnalyzer.findClusters(network.nodes, network.edges);
  const centrality = networkAnalyzer.calculateCentrality(
    network.nodes,
    network.edges
  );

  res.json({
    success: true,
    data: {
      nodes: network.nodes,
      edges: network.edges,
      clusters,
      centrality,
    },
  });
});

// Get anomalous subgraphs
export const getAnomalousSubgraphs = asyncHandler(async (req, res) => {
  const anomalies = await networkAnalyzer.detectAnomalousSubgraphs();

  res.json({
    success: true,
    count: anomalies.length,
    data: anomalies,
  });
});

// Get account statistics
export const getAccountStats = asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const stats = await networkAnalyzer.getAccountStats(accountId);

  res.json({ success: true, data: stats });
});

// Get all accounts
export const getAccounts = asyncHandler(async (req, res) => {
  const { limit = 50, riskLevel } = req.query;

  const filter = {};
  if (riskLevel) filter.riskLevel = riskLevel;

  const accounts = await Account.find(filter)
    .limit(parseInt(limit))
    .select("-transactionHistory");

  res.json({
    success: true,
    count: accounts.length,
    data: accounts,
  });
});
