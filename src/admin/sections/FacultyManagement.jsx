import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Mail, BookOpen, Star, PenTool, CheckCircle, Clock, AlertTriangle, Edit } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, []);

  async function fetchFaculty() {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users?role=faculty');
      setFaculty(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to load faculty list');
    } finally {
      setLoading(false);
    }
  }

  const filteredFaculty = faculty.filter(f => 
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="text-indigo-600 dark:text-indigo-400" /> Faculty Management Module
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track teaching staff, department allocations, feedback ratings, and digital signature status.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search faculty by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map(f => (
          <div key={f._id} className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {f.profilePhoto ? (
                  <img src={f.profilePhoto} alt={f.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    {f.name?.charAt(0) || 'F'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{f.name}</h3>
                  <span className="text-xs text-slate-400">{f.department || 'Unassigned Dept'}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                FACULTY
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail size={14} /> {f.email}
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpen size={14} /> {f.designation || 'Lecturer / Asst Professor'}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <PenTool size={14} className="text-indigo-500" />
                <span className="text-slate-500">Signature:</span>
                {f.signatureStatus === 'verified' ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                ) : f.signatureImage ? (
                  <span className="font-semibold text-amber-600">Uploaded</span>
                ) : (
                  <span className="text-slate-400">Pending</span>
                )}
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                {f.qualification || 'Higher Ed'}
              </span>
            </div>
          </div>
        ))}

        {filteredFaculty.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No faculty members found.
          </div>
        )}
      </div>
    </div>
  );
}
