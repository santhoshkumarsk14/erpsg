import React, { useState } from 'react';
import { bulkUpdateAppendixItems } from '../../services/appendixService';

const AppendixBulkUpdate: React.FC<{ appendixId: number }> = ({ appendixId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const handleBulkUpdate = async () => {
    await bulkUpdateAppendixItems(appendixId, items);
    setMessage('Bulk update successful!');
  };

  return (
    <div>
      <h3>Bulk Update Appendix Items</h3>
      {/* Add UI for editing items array here */}
      <button onClick={handleBulkUpdate}>Bulk Update</button>
      {message && <div>{message}</div>}
    </div>
  );
};

export default AppendixBulkUpdate; 