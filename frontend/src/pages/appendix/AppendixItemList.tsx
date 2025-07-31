import React, { useEffect, useState } from 'react';
import { getAppendixItems, deleteAppendixItem } from '../../services/appendixService';

const AppendixItemList: React.FC<{ appendixId: number }> = ({ appendixId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [appendixId]);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getAppendixItems(appendixId);
    setItems(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteAppendixItem(id);
    fetchItems();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Appendix Items</h3>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.description}, Status: {item.status}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppendixItemList; 