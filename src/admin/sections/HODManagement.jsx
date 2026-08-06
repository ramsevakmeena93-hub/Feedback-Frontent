import React, { useState, useEffect } from 'react';
import { UserCog, Building2, UserPlus, ArrowRightLeft, ShieldCheck, Mail, Award, CheckCircle } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

export default function HODManagement({ subSection = 'hod_all' }) {
  const [hods, setHods] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [assignUserId, setAssignUserId] = useState('');
  const [assignDept, setAssignDept] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [hodRes, facRes, deptRes] = await Promise.all([
        api.get('/api/admin/users?role=hod'),
        api.get('/api/admin/users?role=faculty'),
        api.get('/api/admin/departments'),
      ]);
      setHods(Array.isArray(hodRes.data) ? hodRes.data : []);
      setFacultyList(Array.isArray(facRes.data) ? facRes.data : []);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
    } catch (err) {
      toast.error('Failed to load HOD data');
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignHOD(e) {
    e.preventDefault();
    if (!assignUserId || !assignDept) {
      toast.error('Please select both faculty member and department');
      return;
    }
    try {
      await api.patch(`/api/admin/departments/${encodeURIComponent(assignDept)}/hod`, {
        userId: assignUserId
      });
      toast.success('HOD assigned successfully!');
      setAssignUserId('');
      setAssignDept('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign HOD');
    }
  }

  async function handleRemoveHOD(hodId) {
    if (!window.confirm('Revert this HOD back to Faculty role?')) return;
    try {
      await api.patch(`/api/admin/users/${hodId}`, { role: 'faculty' });
      toast.success('HOD role removed successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove HOD role');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCog className="text-indigo-600 dark:text-indigo-400" /> Head of Department (HOD) Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Dynamic HOD allocations, department leadership transfers, performance tracking, and role management.
        </p>
      </div>

      {/* Sub-Section Content Switcher */}
      {subSection === 'hod_assign' ? (
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="text-indigo-600" /> Assign New HOD to Department
          </h2>
          <form onSubmit={handleAssignHOD} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Faculty Member</label>
              <select 
                value={assignUserId} 
                onChange={e => setAssignUserId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                required
              >
                <option value="">-- Choose Faculty --</option>
                {facultyList.map(f => (
                  <option key={f._id} value={f._id}>{f.name} ({f.department || 'No Dept'}) - {f.email}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Department</label>
              <select 
                value={assignDept} 
                onChange={e => setAssignDept(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                required
              >
                <option value="">-- Choose Department --</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>

            <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md">
              Promote to HOD
            </button>
          </form>
        </div>
      ) : (
        /* Default: All HODs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hods.map(h => (
            <div key={h._id} className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-base">
                    {h.name?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{h.name}</h3>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{h.department || 'Head of Department'}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  HOD
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail size={14} /> {h.email}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 size={14} /> {h.department || 'Unassigned'}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={12} /> Active Leadership
                </span>
                <button 
                  onClick={() => handleRemoveHOD(h._id)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-lg text-[10px] font-semibold transition-colors"
                >
                  Demote to Faculty
                </button>
              </div>
            </div>
          ))}

          {hods.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-slate-400">
              No HODs currently assigned. Use "Assign HOD" to promote a faculty member.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
