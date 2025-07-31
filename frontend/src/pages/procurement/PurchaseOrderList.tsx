import React, { useEffect, useState } from 'react';
import { getPurchaseOrders, deletePurchaseOrder, downloadPurchaseOrderExcel } from '../../services/procurementService';

const PurchaseOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getPurchaseOrders();
    setOrders(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deletePurchaseOrder(id);
    fetchOrders();
  };

  const handleDownloadExcel = async (id: number) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadPurchaseOrderExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `po-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Purchase Orders</h2>
      <ul>
        {orders.map(po => (
          <li key={po.id}>
            {po.poNumber}: {po.supplier}, Amount: {po.amount}, Status: {po.status}
            <button onClick={() => handleDelete(po.id)}>Delete</button>
            <button onClick={() => handleDownloadExcel(po.id)} disabled={downloadingExcel[po.id]}>Download Excel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurchaseOrderList; 