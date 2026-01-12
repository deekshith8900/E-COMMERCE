import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { FileText } from 'lucide-react'

// ... (previous interfaces)

export default function AdminOrdersPage() {
    // ... (previous state)

    // ... (previous fetchOrders)

    const generateInvoice = (order: Order) => {
        const doc = new jsPDF()

        // Header
        doc.setFontSize(20)
        doc.text('INVOICE', 14, 22)

        doc.setFontSize(10)
        doc.text(`Invoice #: ${order.id.slice(0, 8).toUpperCase()}`, 14, 30)
        doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 14, 35)

        // Customer Info
        doc.text('Bill To:', 14, 45)
        doc.setFont('helvetica', 'bold')
        doc.text(order.shipping_address?.fullName || 'Guest', 14, 50)
        doc.setFont('helvetica', 'normal')
        doc.text(order.shipping_address?.address || '', 14, 55)
        doc.text(`${order.shipping_address?.city}, ${order.shipping_address?.zipCode}`, 14, 60)

        // Table
        const tableColumn = ["Item", "Quantity", "Price", "Total"]
        const tableRows: any[] = []

        order.items?.forEach(item => {
            const itemData = [
                item.product?.name || 'Item',
                item.quantity,
                `$${item.price_at_time}`,
                `$${(item.quantity * item.price_at_time).toFixed(2)}`
            ]
            tableRows.push(itemData)
        })

        // @ts-ignore
        doc.autoTable({
            startY: 70,
            head: [tableColumn],
            body: tableRows,
        })

        // Total
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 10
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`Total Amount: $${order.total_amount}`, 14, finalY)

        // Save
        doc.save(`invoice_${order.id.slice(0, 8)}.pdf`)
    }

    // ... (previous updateStatus)

    // ... (previous getStatusColor)

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Order Management</h1>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.shipping_address?.fullName}</span>
                                        <span className="text-xs text-slate-500">{order.shipping_address?.city}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold">${order.total_amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {order.items?.length} items
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <select
                                        className="border rounded px-2 py-1 text-xs"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        onClick={() => generateInvoice(order)}
                                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                        title="Download Invoice"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    )
}
