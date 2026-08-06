import React, { useState, useEffect } from 'react';
import { Crown, Mail, Shield, CheckCircle, FileText, Activity } from 'lucide-react';
import api from '../../api';

export default function VCManagement() {
  const [vcUsers, setVcUsers] = useState([]);

  useEffect(() => {
    fetchVC();
  }, []);

  async function fetchVC() {
    try {
      const res = await api.get('/api/admin/users?role=vc');
      setVcUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crown className="text-purple-600 dark:text-purple-400" /> VC Executive Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Vice Chancellor oversight, executive signature approvals, and college-wide feedback sign-offs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vcUsers.map(vc => (
          <div key={vc._id} className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xl">
                {vc.name?.charAt(0) || 'V'}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{vc.name}</h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider block">Vice Chancellor</span>
                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12}/> {vc.email}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                EXECUTIVE AUTHORITY
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle size={12} /> Active Access
              </span>
            </div>
          </div>
        ))}

        {vcUsers.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-900 p-8 rounded-2xl text-center text-slate-400 border border-slate-200 dark:border-slate-800">
            No VC user currently registered. Assign VC role from the Master User Directory.
          </div>
        )}
      </div>
    </div>
  );
}
