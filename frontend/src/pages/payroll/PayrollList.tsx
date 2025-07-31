import React, { useEffect, useState } from 'react';
import { getPayrolls, deletePayroll, downloadPayrollSlipPdf, calculateCpfSdl, downloadPayrollExcel } from '../../services/payrollService';

const PayrollList: React.FC = () => {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cpfSdl, setCpfSdl] = useState<{ [key: number]: any }>({});
  const [downloading, setDownloading] = useState<{ [key: number]: boolean }>({});
  const [downloadingExcel, setDownloadingExcel] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    setLoading(true);
    const res = await getPayrolls();
    setPayrolls(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await deletePayroll(id);
    fetchPayrolls();
  };

  const handleDownloadPdf = async (id: number) => {
    setDownloading(d => ({ ...d, [id]: true }));
    const res = await downloadPayrollSlipPdf(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payslip-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloading(d => ({ ...d, [id]: false }));
  };

  const handleDownloadExcel = async (id: number) => {
    setDownloadingExcel(d => ({ ...d, [id]: true }));
    const res = await downloadPayrollExcel(id);
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payroll-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    setDownloadingExcel(d => ({ ...d, [id]: false }));
  };

  const handleCalculateCpfSdl = async (id: number) => {
    const res = await calculateCpfSdl(id);
    setCpfSdl(c => ({ ...c, [id]: res.data.data }));
    fetchPayrolls();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Payrolls</h2>
      <ul>
        {payrolls.map(pr => (
          <li key={pr.id}>
            Employee: {pr.employeeId}, Period: {pr.period}, Amount: {pr.amount}, Status: {pr.status}
            <button onClick={() => handleDelete(pr.id)}>Delete</button>
            <button onClick={() => handleDownloadPdf(pr.id)} disabled={downloading[pr.id]}>Download PDF</button>
            <button onClick={() => handleDownloadExcel(pr.id)} disabled={downloadingExcel[pr.id]}>Download Excel</button>
            <button onClick={() => handleCalculateCpfSdl(pr.id)}>Calc CPF/SDL</button>
            {cpfSdl[pr.id] && (
              <span>
                &nbsp;| CPF Employer: {cpfSdl[pr.id].cpfEmployer}, CPF Employee: {cpfSdl[pr.id].cpfEmployee}, SDL: {cpfSdl[pr.id].sdl}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PayrollList; 