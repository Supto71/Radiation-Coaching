import re

file_path = 'frontend/src/pages/AdminDashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update states
content = content.replace("const [filterPaid, setFilterPaid] = useState('');",
                          "const [filterStatus, setFilterStatus] = useState('');\n  const [paymentModal, setPaymentModal] = useState({ show: false, fee: null, amount: '', date: new Date().toISOString().slice(0, 10) });")

# 2. Update form state
content = content.replace("const [form, setForm] = useState({ student_id: '', amount: '500', month: currentMonth, is_paid: false });",
                          "const [form, setForm] = useState({ student_id: '', amount: '500', month: currentMonth });")

# 3. Update fetchFees
content = content.replace("if (filterPaid !== '') url += `is_paid=${filterPaid}&`;",
                          "if (filterStatus !== '') url += `status=${filterStatus}&`;")

# 4. Replace handleMarkPaid with submitPayment
old_handle_mark_paid = """  const handleMarkPaid = async (feeId) => {
    await fetch(`/api/dashboard/fees/${feeId}/pay`, { method: 'PATCH' });
    fetchFees(); fetchAllFees();
  };"""
new_submit_payment = """  const submitPayment = async () => {
    if (!paymentModal.amount || !paymentModal.date) {
      setMsg({ text: 'টাকার পরিমাণ এবং তারিখ দিন!', type: 'error' }); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/fees/${paymentModal.fee.id}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(paymentModal.amount), date: paymentModal.date })
      });
      if (res.ok) {
        setMsg({ text: 'পেমেন্ট সফলভাবে যোগ হয়েছে!', type: 'success' });
        setPaymentModal({ show: false, fee: null, amount: '', date: '' });
        fetchFees(); fetchAllFees();
      } else {
        setMsg({ text: 'পেমেন্ট যোগ করতে সমস্যা হয়েছে।', type: 'error' });
      }
    } catch {
      setMsg({ text: 'সার্ভার এরর!', type: 'error' });
    }
    setSaving(false);
    setTimeout(() => setMsg({ text: '', type: 'success' }), 4000);
  };"""
content = content.replace(old_handle_mark_paid, new_submit_payment)

# 5. Update summary amounts
content = content.replace("const totalPaidAmount = fees.filter(f => f.is_paid).reduce((sum, f) => sum + f.amount, 0);",
                          "const totalPaidAmount = fees.reduce((sum, f) => sum + (f.paid_amount || 0), 0);")
content = content.replace("const totalUnpaidAmount = fees.filter(f => !f.is_paid).reduce((sum, f) => sum + f.amount, 0);",
                          "const totalUnpaidAmount = fees.reduce((sum, f) => sum + (f.amount - (f.paid_amount || 0)), 0);")

# 6. Update studentDues
content = content.replace("if (!fee.is_paid) {",
                          "if (fee.status !== 'Paid') {")
content = content.replace("acc[fee.student_id].total_due += fee.amount;",
                          "acc[fee.student_id].total_due += (fee.amount - (fee.paid_amount || 0));")

# 7. Update getStudentDue
content = content.replace("return allFees.filter(f => f.student_id === studentId && !f.is_paid).reduce((sum, f) => sum + f.amount, 0);",
                          "return allFees.filter(f => f.student_id === studentId && f.status !== 'Paid').reduce((sum, f) => sum + (f.amount - (f.paid_amount || 0)), 0);")

# 8. Filter dropdown
old_filter = """            <select value={filterPaid} onChange={e => setFilterPaid(e.target.value)}
              className="border border-gray-300 rounded-xl p-2.5 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium">
              <option value="">সব রেকর্ড</option>
              <option value="false">বকেয়া</option>
              <option value="true">পরিশোধিত</option>
            </select>"""
new_filter = """            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-xl p-2.5 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium">
              <option value="">সব রেকর্ড</option>
              <option value="Due">বকেয়া</option>
              <option value="Partial">আংশিক</option>
              <option value="Paid">পরিশোধিত</option>
            </select>"""
content = content.replace(old_filter, new_filter)

# 9. Payment Modal HTML
modal_html = """
      {/* Payment Modal */}
      {paymentModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
            <h3 className="font-bold text-lg mb-4">পেমেন্ট যোগ করুন</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">টাকার পরিমাণ</label>
                <input type="number" value={paymentModal.amount} onChange={e => setPaymentModal({...paymentModal, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="কত টাকা?" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">তারিখ</label>
                <input type="date" value={paymentModal.date} onChange={e => setPaymentModal({...paymentModal, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setPaymentModal({ show: false, fee: null, amount: '', date: '' })}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">বাতিল</button>
              <button onClick={submitPayment} disabled={saving}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400">
                {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
"""
content = content.replace("{/* ── All Records View ── */}", modal_html + "\n      {/* ── All Records View ── */}")

# 10. Fix add fee form (remove checkbox)
old_checkbox = """            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" id="isPaid" checked={form.is_paid} onChange={e => setForm({ ...form, is_paid: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer" />
              <label htmlFor="isPaid" className="font-semibold text-gray-700 cursor-pointer">এখনই পরিশোধিত মার্ক করুন</label>
            </div>"""
content = content.replace(old_checkbox, "")

# 11. Replace the table rendering logic for fees
# We will just replace the mapping function
old_map_start = "{displayedFees.map(f => ("
old_map_end = """                    <td className="p-4 flex gap-2 items-center h-full">
                      {!f.is_paid && (
                        <button onClick={() => handleMarkPaid(f.id)}
                          className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                          পরিশোধিত মার্ক করুন
                        </button>
                      )}
                      <button onClick={() => handleDeleteFee(f.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 p-1.5 rounded-lg" title="ডিলিট করুন">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}"""

import re
# Regex to replace the displayedFees.map logic
pattern = re.compile(r'\{displayedFees\.map\(f => \(\s*<tr key=\{f\.id\}.*?</tr>\s*\)\)}', re.DOTALL)

new_map = """{displayedFees.map(f => {
                  let statusBadge = null;
                  if (f.status === 'Paid') {
                    statusBadge = <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">✓ সম্পূর্ণ</span>;
                  } else if (f.status === 'Partial') {
                    statusBadge = (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800" title={`বকেয়া: ৳${f.amount - (f.paid_amount || 0)}`}>
                        ⚠ আংশিক (৳{f.paid_amount})
                      </span>
                    );
                  } else {
                    statusBadge = <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">✗ বকেয়া</span>;
                  }

                  let paymentHistoryList = [];
                  try {
                    paymentHistoryList = JSON.parse(f.payment_history || '[]');
                  } catch (e) {}

                  return (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-700">{f.month}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{f.student_name}</div>
                      <div className="text-xs text-gray-400 font-semibold">{f.student_id}</div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {editingFeeId === f.id ? (
                        <div className="flex gap-2 items-center">
                          <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} 
                            className="border border-gray-300 rounded px-2 py-1 w-20 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" />
                          <button onClick={() => handleEditFeeAmount(f.id)} className="text-green-600 font-bold hover:bg-green-50 p-1 rounded transition-colors">✓</button>
                          <button onClick={() => setEditingFeeId(null)} className="text-red-500 font-bold hover:bg-red-50 p-1 rounded transition-colors">✗</button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex gap-2 items-center">
                            <span>৳{f.amount}</span>
                            {f.status !== 'Paid' && (
                              <button onClick={() => { setEditingFeeId(f.id); setEditAmount(f.amount.toString()); }} className="text-gray-400 hover:text-blue-600 transition-colors" title="মোট পরিমাণ এডিট করুন">
                                ✎
                              </button>
                            )}
                          </div>
                          {f.status === 'Partial' && <span className="text-xs text-red-500 font-medium">বকেয়া: ৳{f.amount - (f.paid_amount || 0)}</span>}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        {statusBadge}
                        {paymentHistoryList.length > 0 && (
                          <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                            {paymentHistoryList.map((p, i) => (
                              <div key={i}>{p.date}: ৳{p.amount}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 flex gap-2 items-center h-full">
                      {f.status !== 'Paid' && (
                        <button onClick={() => setPaymentModal({ show: true, fee: f, amount: (f.amount - (f.paid_amount || 0)).toString(), date: new Date().toISOString().slice(0, 10) })}
                          className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                          পরিশোধ করুন
                        </button>
                      )}
                      <button onClick={() => handleDeleteFee(f.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 p-1.5 rounded-lg" title="ডিলিট করুন">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )})}"""

content = pattern.sub(new_map, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced AdminDashboard.jsx successfully.")
