import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api';

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const [tab, setTab] = useState('overview');
  const [editName, setEditName] = useState(user?.name || '');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await userApi.updateProfile({ name: editName });
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwMsg({ type: 'error', text: 'Passwords do not match.' });
    }
    setSaving(true);
    setPwMsg({ type: '', text: '' });
    try {
      await userApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed.' });
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <nav className="border-b border-white/8 bg-surface-1/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-display font-bold text-white">MyApp</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-display font-bold text-sm">
                {initials}
              </div>
              <span className="text-white/60 text-sm font-body hidden sm:block">{user?.name}</span>
            </div>
            <button onClick={logout} className="text-white/40 hover:text-white/80 text-sm font-body transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-white/40 font-body">Manage your account and preferences.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Account Status', value: 'Active', icon: '🟢' },
            { label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User', icon: '🏷️' },
            { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—', icon: '📅' }
          ].map(stat => (
            <div key={stat.label} className="card p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display font-semibold text-white text-lg">{stat.value}</div>
              <div className="text-white/40 text-sm font-body">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card overflow-hidden">
          <div className="flex border-b border-white/8">
            {['overview', 'profile', 'security'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-display font-semibold capitalize transition-all duration-200 ${
                  tab === t
                    ? 'text-brand-400 border-b-2 border-brand-400 bg-brand-500/5'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'overview' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display font-semibold text-white text-lg">Account Information</h2>
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'User ID', value: user?.id, mono: true },
                  { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'First session' }
                ].map(row => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-white/5 last:border-0">
                    <span className="text-white/40 text-sm font-body sm:w-36 shrink-0">{row.label}</span>
                    <span className={`text-white text-sm ${row.mono ? 'font-mono text-brand-400' : 'font-body'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'profile' && (
              <div className="max-w-md animate-fade-in">
                <h2 className="font-display font-semibold text-white text-lg mb-5">Edit Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {profileMsg.text && (
                    <div className={`px-4 py-3 rounded-xl text-sm font-body border ${
                      profileMsg.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>{profileMsg.text}</div>
                  )}
                  <div>
                    <label className="label">Full name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="input-field" required />
                  </div>
                  <div>
                    <label className="label">Email address</label>
                    <input type="email" value={user?.email} className="input-field opacity-50 cursor-not-allowed" disabled />
                    <p className="text-white/30 text-xs font-body mt-1">Email cannot be changed.</p>
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : 'Save changes'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'security' && (
              <div className="max-w-md animate-fade-in">
                <h2 className="font-display font-semibold text-white text-lg mb-5">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {pwMsg.text && (
                    <div className={`px-4 py-3 rounded-xl text-sm font-body border ${
                      pwMsg.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>{pwMsg.text}</div>
                  )}
                  {[
                    { name: 'currentPassword', label: 'Current password' },
                    { name: 'newPassword', label: 'New password' },
                    { name: 'confirmPassword', label: 'Confirm new password' }
                  ].map(f => (
                    <div key={f.name}>
                      <label className="label">{f.label}</label>
                      <input
                        type="password"
                        value={pwForm[f.name]}
                        onChange={e => setPwForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                        className="input-field"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  ))}
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : 'Update password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
