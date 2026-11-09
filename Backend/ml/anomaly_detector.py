 
import numpy as np
import json
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from scipy import stats

class MLAnomalyDetector:
    def __init__(self):
        self.iso_forest = IsolationForest(contamination=0.1, random_state=42)
        self.lof = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
        
    def detect_anomalies(self, transactions):
        """
        Multi-model anomaly detection
        Args:
            transactions: List of transaction dicts with 'amount', 'fromAccount', etc.
        Returns:
            List of anomalous transactions with scores
        """
        if not transactions:
            return []
        
        anomalies = []
        
        # Feature extraction
        amounts = np.array([tx.get('amount', 0) for tx in transactions]).reshape(-1, 1)
        
        # Model 1: Isolation Forest
        iso_predictions = self.iso_forest.fit_predict(amounts)
        iso_scores = self.iso_forest.score_samples(amounts)
        
        # Model 2: Local Outlier Factor
        lof_predictions = self.lof.fit_predict(amounts)
        lof_scores = self.lof.negative_outlier_factor_
        
        # Model 3: Statistical Z-score
        z_scores = np.abs(stats.zscore(amounts))
        
        # Ensemble: Combine predictions
        for i, tx in enumerate(transactions):
            # Count how many models flagged this as anomaly
            anomaly_votes = 0
            scores = []
            
            if iso_predictions[i] == -1:
                anomaly_votes += 1
                scores.append(('isolation_forest', abs(iso_scores[i])))
            
            if lof_predictions[i] == -1:
                anomaly_votes += 1
                scores.append(('lof', abs(lof_scores[i])))
            
            if z_scores[i][0] > 2.5:
                anomaly_votes += 1
                scores.append(('z_score', float(z_scores[i][0])))
            
            # Flag if 2+ models agree or z-score is extreme
            if anomaly_votes >= 2 or z_scores[i][0] > 3.5:
                anomalies.append({
                    'id': f"ml_anomaly_{tx.get('id', i)}",
                    'transactionId': tx.get('id'),
                    'fromAccount': tx.get('fromAccount'),
                    'toAccount': tx.get('toAccount'),
                    'amount': tx.get('amount'),
                    'anomalyScore': float(np.mean([s[1] for s in scores])),
                    'models_flagged': anomaly_votes,
                    'reason': f'Flagged by {anomaly_votes} ML models',
                    'confidence': min(0.99, 0.5 + (anomaly_votes * 0.25)),
                    'model_details': scores,
                })
        
        return anomalies
    
    def detect_behavioral_patterns(self, transactions):
        """
        Detect unusual behavioral patterns
        Args:
            transactions: List of transactions
        Returns:
            List of behavioral anomalies
        """
        behavioral_anomalies = []
        
        # Group by sender
        account_stats = {}
        for tx in transactions:
            account = tx.get('fromAccount')
            if account not in account_stats:
                account_stats[account] = {
                    'count': 0,
                    'total_volume': 0,
                    'avg_amount': 0,
                    'max_amount': 0,
                    'min_amount': float('inf'),
                    'transactions': []
                }
            
            stats_entry = account_stats[account]
            stats_entry['count'] += 1
            stats_entry['total_volume'] += tx.get('amount', 0)
            stats_entry['max_amount'] = max(stats_entry['max_amount'], tx.get('amount', 0))
            stats_entry['min_amount'] = min(stats_entry['min_amount'], tx.get('amount', 0))
            stats_entry['transactions'].append(tx)
        
        # Detect behavioral patterns
        for account, stats_data in account_stats.items():
            stats_data['avg_amount'] = stats_data['total_volume'] / stats_data['count']
            
            # Pattern 1: Sudden increase in volume
            if stats_data['count'] > 3:
                recent_avg = np.mean([tx.get('amount', 0) for tx in stats_data['transactions'][-2:]])
                historical_avg = stats_data['avg_amount']
                
                if recent_avg > historical_avg * 2:
                    behavioral_anomalies.append({
                        'id': f"ml_behavior_volume_{account}",
                        'fromAccount': account,
                        'anomalyType': 'sudden_volume_increase',
                        'reason': f'Transaction volume increased from {historical_avg:.0f} to {recent_avg:.0f}',
                        'confidence': 0.75,
                        'model': 'behavioral-pattern',
                    })
            
            # Pattern 2: High velocity (many transactions)
            if stats_data['count'] > 5:
                behavioral_anomalies.append({
                    'id': f"ml_behavior_velocity_{account}",
                    'fromAccount': account,
                    'anomalyType': 'high_velocity',
                    'reason': f'High transaction velocity: {stats_data["count"]} transactions',
                    'confidence': 0.65,
                    'model': 'behavioral-pattern',
                })
        
        return behavioral_anomalies


def main():
    """Test the ML detector with sample data"""
    detector = MLAnomalyDetector()
    
    sample_transactions = [
        {'id': 1, 'fromAccount': 'ACC001', 'toAccount': 'ACC002', 'amount': 500000},
        {'id': 2, 'fromAccount': 'ACC001', 'toAccount': 'ACC003', 'amount': 600000},
        {'id': 3, 'fromAccount': 'ACC002', 'toAccount': 'ACC001', 'amount': 5000000},  # Outlier
        {'id': 4, 'fromAccount': 'ACC001', 'toAccount': 'ACC004', 'amount': 550000},
        {'id': 5, 'fromAccount': 'ACC003', 'toAccount': 'ACC002', 'amount': 15000000},  # Major outlier
    ]
    
    anomalies = detector.detect_anomalies(sample_transactions)
    behaviors = detector.detect_behavioral_patterns(sample_transactions)
    
    print("Detected Anomalies:")
    print(json.dumps(anomalies, indent=2))
    
    print("\nBehavioral Patterns:")
    print(json.dumps(behaviors, indent=2))


if __name__ == '__main__':
    main()
