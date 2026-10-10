import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Search, Trash2, LogOut, Lock, 
  RefreshCw, Radio, ShieldCheck, ArrowLeft, Clock
} from 'lucide-react';
import { RSVPResponse, RSVPSummary } from '../types';

interface RSVPTrackingDashboardProps {
  onBackToInvitation: () => void;
}

export const RSVPTrackingDashboard: React.FC<RSVPTrackingDashboardProps> = ({ onBackToInvitation }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data state
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [summary, setSummary] = useState<RSVPSummary>({ total: 0, attending: 0, declined: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'declined'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Check saved session in sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem('zia_rsvp_admin_user');
    const savedPass = sessionStorage.getItem('zia_rsvp_admin_pass');
    if (
      savedUser &&
      (savedUser === 'Zia' || savedUser.toLowerCase() === 'zia') &&
      savedPass === 'Zia@07'
    ) {
      setUsername('Zia');
      setPassword('Zia@07');
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // Check credentials: Valid credentials are Zia and Zia@07
    const isUserValid = cleanUser === 'Zia' || cleanUser.toLowerCase() === 'zia';
    const isPassValid = cleanPass === 'Zia@07';

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('zia_rsvp_admin_user', 'Zia');
      sessionStorage.setItem('zia_rsvp_admin_pass', 'Zia@07');
      setAuthError('');
      setIsLoggingIn(false);

      // Best effort sync with server endpoint if active
      try {
        await fetch('/api/rsvp/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUser, password: cleanPass }),
        });
      } catch {
        // Safe to ignore on serverless or static host
      }
      return;
    }

    // If inputs didn't match default client credentials, attempt server verification
    try {
      const res = await fetch('/api/rsvp/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          sessionStorage.setItem('zia_rsvp_admin_user', cleanUser);
          sessionStorage.setItem('zia_rsvp_admin_pass', cleanPass);
          setIsLoggingIn(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    setAuthError('Incorrect username or password. Please try again.');
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('zia_rsvp_admin_user');
    sessionStorage.removeItem('zia_rsvp_admin_pass');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Fetch full list & summary
  const fetchRSVPData = async () => {
    setIsLoading(true);
    let serverList: RSVPResponse[] | null = null;
    let serverSummary: RSVPSummary | null = null;

    try {
      const res = await fetch('/api/rsvp/admin', {
        headers: {
          'x-admin-username': 'Zia',
          'x-admin-password': 'Zia@07',
        },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.list)) {
          serverList = data.list;
          serverSummary = data.summary;
        }
      }
    } catch (err) {
      console.warn('RSVP data fetch notice:', err);
    }

    // Merge with local submissions so no responses are ever lost on static hosting
    const recordMap = new Map<string, RSVPResponse>();

    if (serverList) {
      serverList.forEach((r) => {
        const key = (r.id || r.name).toLowerCase().trim();
        recordMap.set(key, r);
      });
    }

    try {
      const rawAll = localStorage.getItem('zia_all_rsvps');
      if (rawAll) {
        const parsed = JSON.parse(rawAll);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: RSVPResponse) => {
            const key = (item.id || item.name).toLowerCase().trim();
            if (!recordMap.has(key)) {
              recordMap.set(key, item);
            }
          });
        }
      }

      const rawOffline = localStorage.getItem('zia_guest_rsvp_offline');
      if (rawOffline) {
        const parsed = JSON.parse(rawOffline);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: RSVPResponse) => {
            const key = (item.id || item.name).toLowerCase().trim();
            if (!recordMap.has(key)) {
              recordMap.set(key, item);
            }
          });
        }
      }
    } catch {
      // ignore
    }

    const merged = Array.from(recordMap.values());
    const attendingCount = merged.filter((r) => r.status === 'attending').length;
    const declinedCount = merged.filter((r) => r.status === 'declined').length;

    setRsvps(merged);
    setSummary(
      serverSummary && serverList && serverList.length >= merged.length
        ? serverSummary
        : {
            total: merged.length,
            attending: attendingCount,
            declined: declinedCount,
          }
    );
    setIsLoading(false);
  };

  // Connect SSE for Realtime updates
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchRSVPData();

    let eventSource: EventSource | null = null;
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        eventSource = new EventSource('/api/rsvp/events?username=Zia&password=Zia@07');

        eventSource.onopen = () => {
          setIsLiveConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.list && data.summary) {
              setRsvps(data.list);
              setSummary(data.summary);
            }
          } catch (err) {
            console.error('SSE parse error:', err);
          }
        };

        eventSource.onerror = () => {
          setIsLiveConnected(false);
        };
      }
    } catch {
      setIsLiveConnected(false);
    }

    // Polling interval fallback every 10s to guarantee sync
    const interval = setInterval(fetchRSVPData, 10000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove RSVP for "${name}"?`)) return;
    setDeletingId(id);

    // Optimistically remove from state & update summary
    setRsvps((prev) => {
      const updated = prev.filter((r) => r.id !== id && r.name !== name);
      setSummary({
        total: updated.length,
        attending: updated.filter((r) => r.status === 'attending').length,
        declined: updated.filter((r) => r.status === 'declined').length,
      });
      return updated;
    });

    // Also remove from local storage caches
    try {
      const rawAll = localStorage.getItem('zia_all_rsvps');
      if (rawAll) {
        const parsed = JSON.parse(rawAll);
        if (Array.isArray(parsed)) {
          localStorage.setItem(
            'zia_all_rsvps',
            JSON.stringify(parsed.filter((r: RSVPResponse) => r.id !== id && r.name !== name))
          );
        }
      }
      const rawOffline = localStorage.getItem('zia_guest_rsvp_offline');
      if (rawOffline) {
        const parsed = JSON.parse(rawOffline);
        if (Array.isArray(parsed)) {
          localStorage.setItem(
            'zia_guest_rsvp_offline',
            JSON.stringify(parsed.filter((r: RSVPResponse) => r.id !== id && r.name !== name))
          );
        }
      }
    } catch {
      // ignore
    }

    try {
      await fetch(`/api/rsvp/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-username': 'Zia',
          'x-admin-password': 'Zia@07',
        },
      });
    } catch (err) {
      console.error('Delete notice:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered entries
  const filteredList = rsvps.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Render Login Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/95 border border-[#F8DDE8] shadow-2xl p-8 relative">
          <button
            onClick={onBackToInvitation}
            className="absolute top-6 left-6 text-xs text-[#6C567B] hover:text-[#9E4D6E] flex items-center gap-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Invitation
          </button>

          <div className="text-center mt-6 mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F8DDE8] text-[#9E4D6E] mb-3">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-[#9E4D6E]">
              RSVP Tracking Portal
            </h1>
            <p className="text-xs text-[#6C567B] mt-1 font-poppins">
              Please enter your administrator credentials to access the real-time RSVP dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-poppins">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C567B] mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F3] border border-[#F8DDE8] text-[#6C567B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E4D6E]/30 focus:border-[#9E4D6E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C567B] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F3] border border-[#F8DDE8] text-[#6C567B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E4D6E]/30 focus:border-[#9E4D6E]"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#9E4D6E] text-white text-sm font-semibold shadow-md hover:bg-[#853C5A] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Authenticated View
  return (
    <div className="min-h-screen bg-[#FFF9F3] font-poppins text-[#6C567B] pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F8DDE8] px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToInvitation}
              className="flex items-center gap-1.5 text-xs text-[#6C567B] hover:text-[#9E4D6E] font-medium px-2.5 py-1.5 rounded-lg border border-[#F8DDE8] bg-[#FFF9F3] hover:bg-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Invitation</span>
            </button>

            <div>
              <h1 className="font-playfair text-lg sm:text-xl font-bold text-[#9E4D6E] leading-tight">
                Zia’s 7th Birthday · RSVP Tracking
              </h1>
              <p className="text-[11px] text-[#6C567B]/70 hidden sm:block">
                Real-time Headcount & Reservation Status (Permanent & Non-editable guest responses)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Indicator */}
            <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isLiveConnected 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <Radio className={`h-3 w-3 ${isLiveConnected ? 'animate-pulse text-emerald-600' : 'text-amber-600'}`} />
              <span>{isLiveConnected ? 'Live Real-time' : 'Syncing'}</span>
            </div>

            <button
              onClick={fetchRSVPData}
              disabled={isLoading}
              title="Refresh Data"
              className="p-2 rounded-xl border border-[#F8DDE8] bg-[#FFF9F3] hover:bg-white text-[#6C567B] hover:text-[#9E4D6E] transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Real-time Indicator banner on mobile */}
        <div className="sm:hidden flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-800 font-medium">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            Real-Time Live Active
          </span>
          <span>{rsvps.length} Submissions</span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Responses */}
          <div className="rounded-3xl bg-white border border-[#F8DDE8] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6C567B]">
                Total Responses
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 font-playfair text-3xl sm:text-4xl font-bold text-[#6C567B]">
              {summary.total}
            </div>
            <p className="mt-1 text-xs text-[#6C567B]/70">All confirmed guest entries</p>
          </div>

          {/* Attending (Green) */}
          <div className="rounded-3xl bg-white border border-emerald-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Attending (Reserved Slots)
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 font-playfair text-3xl sm:text-4xl font-bold text-emerald-600">
              {summary.attending}
            </div>
            <p className="mt-1 text-xs text-emerald-700/80">
              {summary.total > 0 ? `${Math.round((summary.attending / summary.total) * 100)}% attendance rate` : 'Awaiting guest responses'}
            </p>
          </div>

          {/* Declined (Red/Pink) */}
          <div className="rounded-3xl bg-white border border-rose-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
                Cannot Attend
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 font-playfair text-3xl sm:text-4xl font-bold text-rose-600">
              {summary.declined}
            </div>
            <p className="mt-1 text-xs text-rose-700/80">Sent apologies & warm wishes</p>
          </div>
        </div>

        {/* Table & Control Center Card */}
        <div className="rounded-3xl bg-white border border-[#F8DDE8] shadow-sm overflow-hidden">
          {/* Controls Header */}
          <div className="p-5 border-b border-[#F8DDE8] flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6C567B]/40" />
              <input
                type="text"
                placeholder="Search guest name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F3] border border-[#F8DDE8] text-xs text-[#6C567B] placeholder-[#6C567B]/40 focus:outline-hidden focus:ring-2 focus:ring-[#9E4D6E]/30"
              />
            </div>

            {/* Filter Buttons (Export CSV removed as requested) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl bg-[#FFF9F3] p-1 border border-[#F8DDE8] text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-white text-[#9E4D6E] shadow-xs font-semibold'
                      : 'text-[#6C567B] hover:text-[#9E4D6E]'
                  }`}
                >
                  All ({summary.total})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('attending')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'attending'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs font-semibold'
                      : 'text-[#6C567B] hover:text-emerald-700'
                  }`}
                >
                  Attending ({summary.attending})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('declined')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'declined'
                      ? 'bg-rose-50 text-rose-800 shadow-xs font-semibold'
                      : 'text-[#6C567B] hover:text-rose-700'
                  }`}
                >
                  Declined ({summary.declined})
                </button>
              </div>
            </div>
          </div>

          {/* Guest List Table */}
          {filteredList.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ShieldCheck className="mx-auto h-12 w-12 text-[#6C567B]/20 mb-3" />
              <h3 className="font-playfair text-lg font-semibold text-[#6C567B]">
                {searchTerm || filterStatus !== 'all' ? 'No matching RSVPs found' : 'No RSVPs submitted yet'}
              </h3>
              <p className="text-xs text-[#6C567B]/60 mt-1 max-w-sm mx-auto">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search keywords or filter tab.'
                  : 'Responses submitted by guests on the RSVP form will appear here instantly in real-time.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF9F3] text-[#6C567B] uppercase tracking-wider text-[11px] font-semibold border-b border-[#F8DDE8]">
                  <tr>
                    <th className="py-3 px-6">Guest Name</th>
                    <th className="py-3 px-6">Attendance Status</th>
                    <th className="py-3 px-6">Submitted Time</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8DDE8]/60">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[#6C567B] text-sm">
                        {item.name}
                      </td>
                      <td className="py-4 px-6">
                        {item.status === 'attending' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Attending (Slot Reserved)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="h-3.5 w-3.5 text-rose-600" />
                            Declined
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[#6C567B]/70 flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-[#6C567B]/40 shrink-0" />
                        <span>{new Date(item.submittedAt).toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={deletingId === item.id}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove RSVP entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
