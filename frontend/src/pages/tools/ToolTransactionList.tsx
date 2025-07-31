import React, { useEffect, useState } from 'react';
import { getToolTransactions } from '../../services/toolsService';

const ToolTransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await getToolTransactions();
    setTransactions(res.data.data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Tool Transactions</h2>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>
            Tool ID: {tx.toolId}, User ID: {tx.userId}, Type: {tx.type}, Date: {tx.date}, Remarks: {tx.remarks}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToolTransactionList; 