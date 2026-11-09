import Transaction from "../models/Transaction.js";
import Alert from "../models/Alert.js";

class AnomalyDetector {
  constructor() {
    this.rules = {
      LARGE_AMOUNT: { threshold: 1000000, severity: "high" },
      RAPID_SUCCESSION: { windowMs: 300000, count: 5, severity: "medium" },
      CROSS_BORDER: { severity: "medium" },
      CIRCULAR_PATTERN: { minCircles: 3, severity: "high" },
      UNUSUAL_TIME: { hours: [22, 23, 0, 1, 2, 3, 4, 5], severity: "low" },
      MULTIPLE_DESTINATIONS: { threshold: 10, severity: "medium" },
      ROUND_AMOUNT: { severity: "low" },
      DORMANT_ACTIVATION: { dormantDays: 90, severity: "medium" },
    };
  }

  // Detect large transactions
  detectLargeAmount(transaction) {
    if (transaction.amount >= this.rules.LARGE_AMOUNT.threshold) {
      return {
        rule: "LARGE_AMOUNT",
        severity: this.rules.LARGE_AMOUNT.severity,
        message: `Large transaction detected: ${transaction.amount}`,
      };
    }
    return null;
  }

  // Detect rapid succession of transactions
  async detectRapidSuccession(fromAccount) {
    const windowMs = this.rules.RAPID_SUCCESSION.windowMs;
    const threshold = this.rules.RAPID_SUCCESSION.count;
    const timeWindow = new Date(Date.now() - windowMs);

    const recentTransactions = await Transaction.countDocuments({
      fromAccount,
      date: { $gte: timeWindow },
    });

    if (recentTransactions >= threshold) {
      return {
        rule: "RAPID_SUCCESSION",
        severity: this.rules.RAPID_SUCCESSION.severity,
        message: `Multiple transactions in short period: ${recentTransactions} in ${
          windowMs / 1000
        }s`,
      };
    }
    return null;
  }

  // Detect cross-border transactions
  detectCrossBorder(fromCountry, toCountry) {
    if (fromCountry !== toCountry) {
      return {
        rule: "CROSS_BORDER",
        severity: this.rules.CROSS_BORDER.severity,
        message: `Cross-border transaction: ${fromCountry} → ${toCountry}`,
      };
    }
    return null;
  }

  // Detect circular patterns (A→B→C→A)
  async detectCircularPattern(transaction) {
    const findCycles = async (start, visited = new Set(), path = []) => {
      if (visited.size > 5) return null;
      visited.add(start);

      const nextTxns = await Transaction.find({ fromAccount: start });
      for (const txn of nextTxns) {
        if (txn.toAccount === transaction.fromAccount && path.length >= 2) {
          return {
            rule: "CIRCULAR_PATTERN",
            severity: this.rules.CIRCULAR_PATTERN.severity,
            message: `Circular transaction pattern detected: ${path.join(
              " → "
            )} → ${txn.toAccount}`,
          };
        }
        if (!visited.has(txn.toAccount)) {
          const result = await findCycles(txn.toAccount, visited, [
            ...path,
            start,
          ]);
          if (result) return result;
        }
      }
      return null;
    };

    return await findCycles(transaction.toAccount);
  }

  // Detect unusual transaction times
  detectUnusualTime(date) {
    const hour = new Date(date).getHours();
    if (this.rules.UNUSUAL_TIME.hours.includes(hour)) {
      return {
        rule: "UNUSUAL_TIME",
        severity: this.rules.UNUSUAL_TIME.severity,
        message: `Transaction at unusual hour: ${hour}:00`,
      };
    }
    return null;
  }

  // Detect round amounts (suspicious pattern)
  detectRoundAmount(amount) {
    const amountStr = amount.toString();
    if (amountStr.endsWith("000000") || amountStr.endsWith("00000")) {
      return {
        rule: "ROUND_AMOUNT",
        severity: this.rules.ROUND_AMOUNT.severity,
        message: `Round amount transaction: ${amount}`,
      };
    }
    return null;
  }

  // Detect multiple destinations
  async detectMultipleDestinations(fromAccount) {
    const uniqueDestinations = await Transaction.distinct("toAccount", {
      fromAccount,
      date: { $gte: new Date(Date.now() - 86400000) }, // Last 24 hours
    });

    if (
      uniqueDestinations.length >= this.rules.MULTIPLE_DESTINATIONS.threshold
    ) {
      return {
        rule: "MULTIPLE_DESTINATIONS",
        severity: this.rules.MULTIPLE_DESTINATIONS.severity,
        message: `Multiple destinations in 24h: ${uniqueDestinations.length}`,
      };
    }
    return null;
  }

  // Main detection function
  async analyzeTransaction(transaction) {
    const detections = [];

    // Run all detection rules
    const largeAmount = this.detectLargeAmount(transaction);
    if (largeAmount) detections.push(largeAmount);

    const rapidSuccession = await this.detectRapidSuccession(
      transaction.fromAccount
    );
    if (rapidSuccession) detections.push(rapidSuccession);

    const crossBorder = this.detectCrossBorder(
      transaction.metadata?.country,
      transaction.metadata?.country
    );
    if (crossBorder) detections.push(crossBorder);

    const circular = await this.detectCircularPattern(transaction);
    if (circular) detections.push(circular);

    const unusualTime = this.detectUnusualTime(transaction.date);
    if (unusualTime) detections.push(unusualTime);

    const roundAmount = this.detectRoundAmount(transaction.amount);
    if (roundAmount) detections.push(roundAmount);

    const multiDest = await this.detectMultipleDestinations(
      transaction.fromAccount
    );
    if (multiDest) detections.push(multiDest);

    return detections;
  }
}

export default new AnomalyDetector();
