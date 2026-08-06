import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Mail, Phone, Shield, Building2, 
  Edit, Trash2, Ban, CheckCircle, Plus, RefreshCw, Clock, LogIn
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [googleOnlyFilter, setGoogleOnlyFilter] = useState(false);
  
  // Selected user for editing
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create user form state
  const [createForm, setCreateForm] = useState({
    name: '', email: '', password: '', role: 'faculty', department: '', phone: '', designation: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, deptFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      let url = '/api/admin/users?';
      if (roleFilter) url += `role=${roleFilter}&`;
      if (deptFilter) url += `department=${encodeURIComponent(deptFilter)}&`;
      const res = await api.get(url);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase());
    
    const matchesGoogle = googleOnlyFilter ? (u.googleVerified || u.googleId) : true;
    return matchesSearch && matchesGoogle;
  });

  async function handleStatusToggle(userId, currentStatus) {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/api/admin/users/${userId}/status`, { status: nextStatus });
      toast.success(`User status set to ${nextStatus.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  }

  async function handleDelete(userId) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  }

  async function handleUpdateRoleDept() {
    if (!selectedUser) return;
    try {
      await api.patch(`/api/admin/users/${selectedUser._id}`, {
        role: newRole || selectedUser.role,
        department: newDept || selectedUser.department
      });
      toast.success('User role & department updated');
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role');
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      await api.post('/api/admin/users', createForm);
      toast.success('New user created successfully!');
      setShowCreateModal(false);
      setCreateForm({ name: '', email: '', password: '', role: 'faculty', department: '', phone: '', designation: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create user');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" /> Master User Directory & Session Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unified user management containing Google Auth users, photos, roles, departments, login counts, and session time spent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Add User
          </button>
          <button 
            onClick={fetchUsers}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            title="Refresh Directory"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <input 
              type="checkbox" 
              checked={googleOnlyFilter} 
              onChange={e => setGoogleOnlyFilter(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Google Auth Only
          </label>

          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vc">VC</option>
            <option value="hod">HOD</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
      </div>

      {/* Unified Users Table */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">Loading directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">User & Auth Method</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Login Count</th>
                  <th className="px-6 py-4">Time Spent (Session)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.profilePhoto ? (
                          <img src={u.profilePhoto} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                            {u.name}
                            {(u.googleVerified || u.googleId) && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                <CheckCircle size={9} /> Google
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-xs flex items-center gap-1"><Mail size={12}/> {u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' :
                        u.role === 'vc' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                        u.role === 'hod' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {u.department || 'General Faculty'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {u.loginCount || 1} logins
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                        <Clock size={12} /> {u.sessionTimeMinutes || 30} mins spent
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        u.status === 'active' 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role);
                            setNewDept(u.department || '');
                            setShowRoleModal(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                          title="Assign Role & Dept"
                        >
                          <Edit size={15} />
                        </button>

                        <button 
                          onClick={() => handleStatusToggle(u._id, u.status || 'active')}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 rounded-lg transition-colors"
                          title={u.status === 'active' ? 'Suspend User' : 'Activate User'}
                        >
                          <Ban size={15} />
                        </button>

                        <button 
                          onClick={() => handleDelete(u._id)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                      No users match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Edit Role & Department */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Modify User Access</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update role & department for <strong className="text-slate-800 dark:text-slate-200">{selectedUser.name}</strong> ({selectedUser.email}).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">System Role</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                >
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD (Head of Department)</option>
                  <option value="vc">VC (Vice Chancellor)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input 
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateRoleDept}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New User Account</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input required type="text" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input required type="email" value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input required type="password" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
                    <option value="faculty">Faculty</option>
                    <option value="hod">HOD</option>
                    <option value="vc">VC</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input type="text" placeholder="CSE / EE" value={createForm.department} onChange={e => setCreateForm({...createForm, department: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
