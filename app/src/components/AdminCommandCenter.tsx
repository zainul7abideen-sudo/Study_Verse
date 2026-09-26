import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Users, Activity, Package, 
  Settings, UserPlus, Trash2, Ban, CheckCircle2, AlertTriangle, 
  Key, RefreshCw, Sparkles, Filter, Search, Edit3 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, AuditActionType } from '../types';

export const AdminCommandCenter: React.FC = () => {
  const { 
    currentUser, switchUser, users, createUser, updateUserRole, toggleBanUser, deleteUser,
    maintenanceState, toggleMaintenanceMode, orders, retryAutoOrder, 
    updateOrderStatus, auditLogs, usedBooks 
  } = useApp();

  const [adminTab, setAdminTab] = useState<'maintenance' | 'users' | 'dropship' | 'logs'>('maintenance');

  // Maintenance Form State
  const [maintMessage, setMaintMessage] = useState(maintenanceState.message);
  const [maintUptime, setMaintUptime] = useState(maintenanceState.estimatedUptime);

  // User Management Form State
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserUniversity, setNewUserUniversity] = useState('AKTU');
  const [newUserCollege, setNewUserCollege] = useState('Institute of Engineering and Technology');
  const [newUserCampus, setNewUserCampus] = useState('Lucknow, UP');

  // Audit Filter
  const [auditFilter, setAuditFilter] = useState<string>('all');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.collegeName.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(log => {
    if (auditFilter === 'all') return true;
    return log.actionType === auditFilter;
  });

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    createUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      university: newUserUniversity,
      collegeName: newUserCollege,
      campusLocation: newUserCampus,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 99887 76655'
    });

    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalSaved = orders.reduce((acc, o) => acc + o.totalSaved, 0);

  // STRICT ACCESS CONTROL GUARD:
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold theme-text-heading">Admin Authorization Required</h2>
        <p className="text-xs theme-text-muted leading-relaxed max-w-sm mx-auto">
          The Admin Command Center is strictly restricted to authorized system administrators. Please sign in with administrator credentials to access these governance features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Admin Header */}
      <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Executive Governance & Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black theme-text-heading">
            System Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm theme-text-muted max-w-xl leading-relaxed">
            Manage site maintenance status, user authorization roles, dropship auto-order queues, and review immutable audit security logs.
          </p>
        </div>

        {/* Global Stats Counter */}
        <div className="grid grid-cols-2 gap-3 theme-card-sub border theme-border p-3.5 rounded-2xl text-center text-xs flex-shrink-0">
          <div>
            <div className="text-[10px] theme-text-muted uppercase font-bold">Total Gross Sales</div>
            <div className="text-lg font-black text-blue-500 dark:text-cyan-300">₹{totalRevenue}</div>
          </div>
          <div>
            <div className="text-[10px] theme-text-muted uppercase font-bold">Student Savings</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{totalSaved}</div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b theme-border pb-3 overflow-x-auto">
        {[
          { id: 'maintenance', label: 'Site Maintenance Guard', icon: ShieldAlert, alert: maintenanceState.isMaintenanceMode },
          { id: 'users', label: `User & Authority RBAC (${users.length})`, icon: Users },
          { id: 'dropship', label: `Auto-Order Dropship Monitor (${orders.length})`, icon: Package },
          { id: 'logs', label: `System Audit Logs (${auditLogs.length})`, icon: Activity },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                adminTab === t.id
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 font-bold'
                  : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.alert && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SITE MAINTENANCE GUARD */}
      {adminTab === 'maintenance' && (
        <div className="space-y-6">
          
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b theme-border">
              <div>
                <h3 className="text-lg font-bold theme-text-heading flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  System Availability & Hold Controller
                </h3>
                <p className="text-xs theme-text-muted mt-0.5">
                  Putting the site on hold blocks public traffic and displays the maintenance splash page.
                </p>
              </div>

              {/* Master Maintenance Switch */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold theme-text-muted">
                  Status: {maintenanceState.isMaintenanceMode ? (
                    <span className="text-amber-500 font-bold uppercase">ON HOLD (MAINTENANCE ACTIVE)</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">OPERATIONAL (LIVE)</span>
                  )}
                </span>
                <button
                  onClick={() => toggleMaintenanceMode(!maintenanceState.isMaintenanceMode, maintMessage, maintUptime)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
                    maintenanceState.isMaintenanceMode
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                  }`}
                >
                  {maintenanceState.isMaintenanceMode ? 'Resume Live Operations' : 'Put Website on Hold'}
                </button>
              </div>
            </div>

            {/* Custom Maintenance Message & ETA Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">
                  Public Announcement Message:
                </label>
                <textarea
                  rows={2}
                  value={maintMessage}
                  onChange={(e) => setMaintMessage(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  placeholder="e.g. Study Student Shop is undergoing scheduled semester database upgrades..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">
                    Estimated Availability Uptime:
                  </label>
                  <input
                    type="text"
                    value={maintUptime}
                    onChange={(e) => setMaintUptime(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none font-mono"
                    placeholder="2026-09-27T04:00:00Z"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">
                    Admin / Developer Bypass Security Key:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={maintenanceState.bypassCode}
                      className="w-full theme-input border theme-border rounded-xl px-3 py-2 text-xs text-blue-500 dark:text-cyan-300 font-mono font-bold"
                    />
                    <span className="text-[10px] theme-text-muted whitespace-nowrap">Immutable Key</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => toggleMaintenanceMode(maintenanceState.isMaintenanceMode, maintMessage, maintUptime)}
                  className="px-4 py-2 theme-card-sub hover:opacity-80 theme-text-heading text-xs font-bold rounded-xl border theme-border cursor-pointer"
                >
                  Update Announcement Details
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: USER & ROLE RBAC */}
      {adminTab === 'users' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Users Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 theme-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full theme-input theme-text-heading border theme-border rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New User Account</span>
            </button>
          </div>

          {/* User Table */}
          <div className="theme-card border theme-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="theme-card-sub theme-text-muted border-b theme-border">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Campus / Institute</th>
                    <th className="py-3.5 px-4">Authority Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions & Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:opacity-90 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold theme-text-heading">{u.name}</div>
                            <div className="text-[11px] theme-text-muted">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 theme-text-heading">
                        <div className="truncate max-w-xs">{u.collegeName}</div>
                        <div className="text-[10px] theme-text-muted font-mono">{u.university} • {u.campusLocation}</div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          id={`user-role-select-${u.id}`}
                          name={`user-role-${u.id}`}
                          aria-label={`Change role for ${u.name}`}
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                          className="theme-input border theme-border text-xs font-bold rounded-lg px-2 py-1 text-blue-500 dark:text-cyan-300 outline-none cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="verified_seller">Verified Seller</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        {u.isBanned ? (
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded text-[10px] font-bold uppercase">
                            Banned
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleBanUser(u.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              u.isBanned 
                                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30' 
                                : 'bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30'
                            }`}
                            title={u.isBanned ? 'Reinstate User' : 'Ban User'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 rounded-lg theme-card-sub border theme-border theme-text-muted hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete User Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: DROPSHIP AUTO-ORDER MONITOR */}
      {adminTab === 'dropship' && (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="theme-card border theme-border rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b theme-border pb-3">
                <div>
                  <div className="font-bold theme-text-heading text-sm">
                    {order.id} — Customer: {order.userName} ({order.userEmail})
                  </div>
                  <div className="text-xs theme-text-muted">
                    Campus: {order.collegeCampus} • Items: {order.items.length}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-600 dark:text-cyan-300 font-bold text-xs rounded-xl border border-blue-500/30">
                    {order.status}
                  </span>
                  <button
                    onClick={() => retryAutoOrder(order.id)}
                    className="px-3 py-1 theme-card-sub hover:opacity-80 theme-text-heading text-xs font-semibold rounded-xl border theme-border flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry Fulfillment
                  </button>
                </div>
              </div>

              {order.dropshipVendor && (
                <div className="theme-card-sub border theme-border p-3 rounded-xl text-xs space-y-1 font-mono">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">Auto-Order Target: {order.dropshipVendor}</div>
                  <div className="theme-text-muted">External Order Ref: {order.externalOrderId || 'FK-99382109'}</div>
                  <div className="theme-text-muted">Tracking Code: {order.externalTrackingId || 'TRK-99210'}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SYSTEM AUDIT LOGS */}
      {adminTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs theme-text-muted">Immutable timestamped logs of all administrative & worker operations</div>
            <select
              id="admin-audit-filter-select"
              name="auditFilter"
              aria-label="Filter audit logs by event type"
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="theme-input theme-text-heading text-xs border theme-border rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">All Event Types</option>
              <option value="MAINTENANCE_TOGGLE">Maintenance Toggles</option>
              <option value="USER_ROLE_CHANGE">Role Changes</option>
              <option value="AUTO_ORDER_DISPATCH">Auto-Order Dispatches</option>
              <option value="PRICE_SCRAPER_SYNC">Price Scraper Syncs</option>
            </select>
          </div>

          <div className="theme-card border theme-border rounded-2xl p-4 divide-y theme-border font-mono text-xs space-y-2 shadow-lg">
            {filteredLogs.map(log => (
              <div key={log.id} className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 theme-card-sub border theme-border text-blue-500 font-bold rounded text-[10px]">
                    {log.actionType}
                  </span>
                  <span className="theme-text-heading">{log.details}</span>
                </div>
                <div className="theme-text-muted text-[10px] whitespace-nowrap">
                  By {log.actorName} ({log.ipAddress}) • {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-5 right-5 theme-text-muted hover:theme-text-heading p-2 rounded-full theme-card-sub border theme-border"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold theme-text-heading flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5 text-rose-500" />
              Create New User Account
            </h2>
            <p className="text-xs theme-text-muted mb-4">Provision student, seller, or moderator credentials.</p>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Joshi"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. siddharth@university.ac.in"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="admin-new-user-role-select" className="block text-xs font-semibold theme-text-heading mb-1">Role / Authority</label>
                  <select
                    id="admin-new-user-role-select"
                    name="newUserRole"
                    aria-label="New User Role"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="verified_seller">Verified Seller</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="admin-new-user-university-select" className="block text-xs font-semibold theme-text-heading mb-1">University</label>
                  <select
                    id="admin-new-user-university-select"
                    name="newUserUniversity"
                    aria-label="New User University"
                    value={newUserUniversity}
                    onChange={(e) => setNewUserUniversity(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="AKTU">AKTU</option>
                    <option value="VTU">VTU</option>
                    <option value="DU">DU</option>
                    <option value="SPPU">SPPU</option>
                    <option value="MU">Mumbai Univ</option>
                    <option value="ANNA">Anna Univ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">College Campus Name</label>
                <input
                  type="text"
                  value={newUserCollege}
                  onChange={(e) => setNewUserCollege(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 theme-card-sub theme-text-heading rounded-xl text-xs font-semibold hover:opacity-80 border theme-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 cursor-pointer"
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
