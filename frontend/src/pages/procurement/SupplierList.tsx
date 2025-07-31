import React, { useEffect, useState } from 'react';
import { getSuppliers, deleteSupplier } from '../../services/procurementService';

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const res = await getSuppliers();
    setSuppliers(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteSupplier(id);
    fetchSuppliers();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Suppliers</h2>
      <ul>
        {suppliers.map(sup => (
          <li key={sup.id}>
            {sup.name} ({sup.contact})
            <button onClick={() => handleDelete(sup.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList; 