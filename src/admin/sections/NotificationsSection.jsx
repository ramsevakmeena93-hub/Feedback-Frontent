import React, { useState } from 'react';
import { Bell, Mail, AlertTriangle, UserCheck, ShieldAlert, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsSection() {
  const [supportIssues, setSupportIssues] = useState([
    {
      id: 1,
      senderName: 'Dr. Shishir Dixit',
      email: 'shishir.dixit1@mitsgwalior.in',
      role: 'HOD',
      department: 'Electrical Engineering',
      photo: '',
      time: '2026-08-06T09:30:00Z',
      problem: 'Unable to send feedback report emails to 3 faculty members. SMTP timeout error received.',
      status: 'pending'
    },
    {
      id: 2,
      senderName: 'Dr. Anjali S Patil',
      email: 'anjalipatil@mitsgwalior.in',
      role: 'HOD',
      department: 'Architecture',
      photo: '',
      time: '2026-08-06T08:15:00Z',
      problem: 'Digital signature upload failed due to file size restriction (>2MB). Requesting admin override.',
      status: 'pending'
    },
    {
      id: 3,
      senderName: 'Dr. Vice Chancellor',
      email: 'vc@mitsgwalior.in',
      role: 'VC',
      department: 'Executive Office',
      photo: '',
      time: '2026-08-05T16:45:00Z',
      problem: 'Requesting updated college-wide NAAC summary report for executive sign-off.',
      status: 'resolved'
    }
  ]);

  function handleResolve(id) {
    setSupportIssues(supportIssues.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
    toast.success('Issue marked as resolved');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="text-indigo-600 dark:text-indigo-400" /> Notifications & User Support Inbox
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Support issues, email sending problems, and system notifications reported by HODs, Faculty, and VC.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {supportIssues.map(issue => (
            <div key={issue.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {issue.photo ? (
                  <img src={issue.photo} alt={issue.senderName} className="w-12 h-12 rounded-full object-cover border" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-base shrink-0">
                    {issue.senderName.charAt(0)}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{issue.senderName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {issue.role} — {issue.department}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1"><Mail size={12}/> {issue.email}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    "{issue.problem}"
                  </p>

                  <div className="text-[10px] text-slate-400">
                    Reported on {new Date(issue.time).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {issue.status === 'resolved' ? (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle size={14} /> Resolved
                  </span>
                ) : (
                  <button 
                    onClick={() => handleResolve(issue.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
