import React, { useEffect, useState } from 'react';
import { getQuotes, deleteQuote, convertToInvoice, downloadQuoteExcel } from '../../services/quoteService';

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const res = await getQuotes();
    setQuotes(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deleteQuote(id);
    fetchQuotes();
  };

  const handleConvert = async (id: number) => {
    await convertToInvoice(id);
    fetchQuotes();
  };

  const handleDownloadExcel = async (id: number) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadQuoteExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `quote-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Quotes</h2>
      <ul>
        {quotes.map(qt => (
          <li key={qt.id}>
            {qt.quoteNumber}: {qt.client}, Amount: {qt.amount}, Status: {qt.status}
            <button onClick={() => handleConvert(qt.id)} disabled={qt.convertedToInvoice}>Convert to Invoice</button>
            <button onClick={() => handleDelete(qt.id)}>Delete</button>
            <button onClick={() => handleDownloadExcel(qt.id)} disabled={downloadingExcel[qt.id]}>Download Excel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuoteList; 