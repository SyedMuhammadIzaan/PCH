import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Shield, UserCheck, UserX, Mail, Phone, ShoppingBag, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const AdminUsers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+92 300 1234567');
  const [newRole, setNewRole] = useState<'customer' | 'admin'>('customer');
  const toast = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (e) {
      console.error('Failed to load customers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (customer: CustomerRecord) => {
    const nextStatus = customer.status === 'active' ? 'inactive' : 'active';
    try {
      await api.updateCustomerStatus(customer.id, nextStatus);
      toast.success(
        nextStatus === 'active' ? 'Account Activated' : 'Account Deactivated',
        `${customer.name} is now ${nextStatus}.`
      );
      fetchCustomers();
    } catch (e: any) {
      toast.error('Update Failed', e.message || 'Could not update user status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register({
        name: newName,
        email: newEmail,
        phone: newPhone,
      });
      toast.success('User Created', `Added ${newName} to registered accounts.`);
      setIsModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('+92 300 ');
      fetchCustomers();
    } catch (e: any) {
      toast.error('Creation Failed', e.message || 'Could not create user account');
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif italic text-xl font-bold text-pch-dark">Registered Customer Accounts</h2>
          <p className="text-xs text-slate-500">Manage client profiles, account statuses, order history, and access privileges.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="pl-9 pr-4 py-2 bg-white border border-pch rounded-sm text-xs w-64 focus:outline-emerald-700 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-pch rounded-sm text-xs focus:outline-emerald-700 font-bold uppercase"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="inactive">Inactive Accounts</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-pch-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Users Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-sm border border-pch flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Registered</p>
            <p className="text-xl font-bold text-pch-dark">{customers.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-pch flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Active Customers</p>
            <p className="text-xl font-bold text-emerald-700">
              {customers.filter((c) => c.status === 'active').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-pch flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Customer Orders</p>
            <p className="text-xl font-bold text-pch-dark">
              {customers.reduce((acc, c) => acc + (c.totalOrders || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm border border-pch shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-pch bg-slate-50 text-slate-400 uppercase tracking-widest text-[10px]">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Email & Phone</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pch">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No customer accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{cust.name}</p>
                        <span className="text-[10px] text-slate-400">ID: {cust.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-800 font-medium">{cust.email}</p>
                      <p className="text-[10px] text-slate-400">{cust.phone || 'No phone'}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">
                      {cust.totalOrders || 0} orders
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      Rs. {(cust.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded-xs ${
                          cust.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {cust.status === 'active' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{cust.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-xs transition ${
                          cust.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {cust.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-pch max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-pch pb-3">
              <h3 className="font-serif italic text-lg font-bold text-pch-dark">Register New Customer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Fatima Tariq"
                  className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. fatima@example.com"
                  className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-pch">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-pch rounded-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pch-dark text-white rounded-sm font-bold hover:bg-black uppercase tracking-wider"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
