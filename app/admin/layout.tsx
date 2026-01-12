import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Store } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Store size={18} />
                        </div>
                        <span>Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/admin/products" icon={<Package size={20} />} label="Products" />
                    <NavItem href="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" />
                    <NavItem href="/admin/customers" icon={<Users size={20} />} label="Customers" />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                        <LogOut size={20} />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
