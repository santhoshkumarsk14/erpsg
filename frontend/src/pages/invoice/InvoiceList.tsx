import React, { useEffect, useState } from 'react';
import { getInvoices, deleteInvoice, downloadInvoiceExcel, downloadInvoicePdf, sendInvoiceByEmail, getAuditTrail, getStatusHistory } from '../../services/invoiceService';

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: number]: boolean }>({});
  const [downloadingPdf, setDownloadingPdf] = useState<{ [key: number]: boolean }>({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendInvoiceId, setSendInvoiceId] = useState<number | null>(null);
  const [sendEmail, setSendEmail] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditInvoiceId, setAuditInvoiceId] = useState<number | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusInvoiceId, setStatusInvoiceId] = useState<number | null>(null);
  const [statusLogs, setStatusLogs] = useState<any[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const res = await getInvoices();
    setInvoices(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteInvoice(id);
    fetchInvoices();
  };

  const handleDownloadExcel = async (id: number) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadInvoiceExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  const handleDownloadPdf = async (id: number) => {
    setDownloadingPdf(d => ({ ...d, [id]: true }));
    const res = await downloadInvoicePdf(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingPdf(d => ({ ...d, [id]: false }));
  };

  const handleSendClick = (id: number) => {
    setSendInvoiceId(id);
    setShowSendModal(true);
    setSendEmail('');
    setSendMessage('');
    setSendSuccess(false);
  };

  const handleSendInvoice = async () => {
    if (!sendInvoiceId) return;
    setSending(true);
    try {
      await sendInvoiceByEmail(sendInvoiceId, { to: sendEmail, message: sendMessage });
      setSendSuccess(true);
    } catch (e) {
      alert('Failed to send invoice');
    }
    setSending(false);
  };

  const handleAuditClick = async (id: number) => {
    setAuditInvoiceId(id);
    setShowAuditModal(true);
    setLoadingAudit(true);
    try {
      const res = await getAuditTrail(id);
      setAuditLogs(res.data.data);
    } catch (e) {
      setAuditLogs([]);
    }
    setLoadingAudit(false);
  };

  const handleStatusClick = async (id: number) => {
    setStatusInvoiceId(id);
    setShowStatusModal(true);
    setLoadingStatus(true);
    try {
      const res = await getStatusHistory(id);
      setStatusLogs(res.data.data);
    } catch (e) {
      setStatusLogs([]);
    }
    setLoadingStatus(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Invoices</h2>
      <ul>
        {invoices.map(inv => (
          <li key={inv.id}>
            {inv.invoiceNumber}: {inv.client}, Amount: {inv.amount}, Status: {inv.status}
            <button onClick={() => handleDelete(inv.id)}>Delete</button>
            <button onClick={() => handleDownloadExcel(inv.id)} disabled={downloadingExcel[inv.id]}>Download Excel</button>
            <button onClick={() => handleDownloadPdf(inv.id)} disabled={downloadingPdf[inv.id]}>Download PDF</button>
            <button onClick={() => handleSendClick(inv.id)}>Send by Email</button>
            <button onClick={() => handleAuditClick(inv.id)}>Audit Trail</button>
            <button onClick={() => handleStatusClick(inv.id)}>Status History</button>
          </li>
        ))}
      </ul>
      {showSendModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
            <h3>Send Invoice by Email</h3>
            <label>
              To:
              <input type="email" value={sendEmail} onChange={e => setSendEmail(e.target.value)} style={{ width: '100%' }} />
            </label>
            <label>
              Message:
              <textarea value={sendMessage} onChange={e => setSendMessage(e.target.value)} style={{ width: '100%' }} />
            </label>
            <div style={{ marginTop: 12 }}>
              <button onClick={handleSendInvoice} disabled={sending || !sendEmail}>{sending ? 'Sending...' : 'Send'}</button>
              <button onClick={() => setShowSendModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
            {sendSuccess && <div style={{ color: 'green', marginTop: 8 }}>Invoice sent successfully!</div>}
          </div>
        </div>
      )}
      {showAuditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, maxHeight: 500, overflowY: 'auto' }}>
            <h3>Audit Trail</h3>
            {loadingAudit ? <div>Loading...</div> : (
              <table style={{ width: '100%', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Field</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                    <th>User</th>
                    <th>Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.action}</td>
                      <td>{log.fieldName}</td>
                      <td>{log.oldValue}</td>
                      <td>{log.newValue}</td>
                      <td>{log.changedBy}</td>
                      <td>{log.changedAt}</td>
                      <td>{log.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setShowAuditModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {showStatusModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, maxHeight: 500, overflowY: 'auto' }}>
            <h3>Status History</h3>
            {loadingStatus ? <div>Loading...</div> : (
              <table style={{ width: '100%', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Old Status</th>
                    <th>New Status</th>
                    <th>User</th>
                    <th>Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {statusLogs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.oldStatus}</td>
                      <td>{log.newStatus}</td>
                      <td>{log.changedBy}</td>
                      <td>{log.changedAt}</td>
                      <td>{log.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setShowStatusModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList; 