/**
 * AdminPage View
 * Admin panel for managing plant requests and users
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, RefreshCw, AlertCircle, Users, Leaf, Trash2, Shield, Bug, RotateCcw } from 'lucide-react';
import { requestsAPI } from '../models/api/requestsApi';
import { authAPI } from '../models/api/authApi';
import { getAvatarUrl } from '../constants/avatars';

const AdminPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('requests');

  // Plant requests state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Shared state
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Debug state
  const [debugMessage, setDebugMessage] = useState(null);

  const fetchPendingRequests = async () => {
    setRequestsLoading(true);
    setError(null);
    try {
      const data = await requestsAPI.getPending();
      setRequests(data);
    } catch (err) {
      setError(err.userMessage || 'Failed to load pending requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    setError(null);
    try {
      const data = await authAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.userMessage || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchUsers();
  }, []);

  const handleApprove = async (id, plantName, suggestedEmoji) => {
    setActionLoading(id);
    try {
      await requestsAPI.approve(id, { emoji: suggestedEmoji });
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      setError(err.userMessage || `Failed to approve ${plantName}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, plantName) => {
    setActionLoading(id);
    try {
      await requestsAPI.reject(id, 'Rejected by admin');
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      setError(err.userMessage || `Failed to reject ${plantName}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setActionLoading(userId);
    try {
      await authAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.userMessage || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'requests') {
      fetchPendingRequests();
    } else {
      fetchUsers();
    }
  };

  const isLoading = activeTab === 'requests' ? requestsLoading : activeTab === 'users' ? usersLoading : false;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Delete User?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete <span className="font-semibold">{deleteConfirm.username}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm.id)}
                disabled={actionLoading === deleteConfirm.id}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-red-300 transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading === deleteConfirm.id ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Admin Panel</h1>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={20} className={`text-gray-600 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 bg-white/50 dark:bg-gray-800/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Leaf size={18} />
            Requests
            {requests.length > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Users size={18} />
            Users
            <span className="bg-gray-400 dark:bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'debug'
                ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Bug size={18} />
            Debug
          </button>
        </div>
      </div>

      <div className="p-4 pb-32">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Plant Requests Tab */}
        {activeTab === 'requests' && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pending Plant Requests</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {requests.length} request{requests.length !== 1 ? 's' : ''} awaiting review
              </p>
            </div>

            {requestsLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw size={32} className="text-green-500 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Loading requests...</p>
                </div>
              </div>
            )}

            {!requestsLoading && requests.length === 0 && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No Pending Requests</h3>
                <p className="text-gray-500 dark:text-gray-400">All plant requests have been reviewed.</p>
              </div>
            )}

            {!requestsLoading && requests.length > 0 && (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">{request.suggested_emoji || '🌱'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg">{request.plant_name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Requested by <span className="font-medium text-gray-700 dark:text-gray-300">{request.requested_by}</span>
                        </p>
                        {request.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            {request.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleApprove(request.id, request.plant_name, request.suggested_emoji)}
                        disabled={actionLoading === request.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                      >
                        {actionLoading === request.id ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id, request.plant_name)}
                        disabled={actionLoading === request.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                      >
                        {actionLoading === request.id ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <X size={18} />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Management</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {users.length} registered user{users.length !== 1 ? 's' : ''}
              </p>
            </div>

            {usersLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw size={32} className="text-green-500 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
                </div>
              </div>
            )}

            {!usersLoading && users.length === 0 && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No Users</h3>
                <p className="text-gray-500 dark:text-gray-400">No users have registered yet.</p>
              </div>
            )}

            {!usersLoading && users.length > 0 && (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 flex-shrink-0">
                        <img
                          src={getAvatarUrl(user.avatarSeed)}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800 dark:text-white truncate">{user.username}</h3>
                          {user.isAdmin && (
                            <span className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-0.5 rounded-full">
                              <Shield size={12} />
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {user.totalPoints} pts
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {user.uniquePlants} plants
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button (not for admins) */}
                      {!user.isAdmin && (
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Debug Tab */}
        {activeTab === 'debug' && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Debug Tools</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Testing and debugging utilities
              </p>
            </div>

            {/* Success/Info Message */}
            {debugMessage && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-2xl flex items-center gap-3">
                <Check size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 text-sm flex-1">{debugMessage}</p>
                <button
                  onClick={() => setDebugMessage(null)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="space-y-4">
              {/* First Plant Tip Reset */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center flex-shrink-0">
                    <RotateCcw size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white">Reset First Plant Tip</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Clears the "hasSeenFirstPlantTip" flag from localStorage. The tip will show again after the next plant is added (if the user has no plant history).
                    </p>
                    <button
                      onClick={() => {
                        localStorage.removeItem('hasSeenFirstPlantTip');
                        setDebugMessage('First Plant Tip has been reset. Add a plant to see the tip (requires no plant history).');
                      }}
                      className="mt-3 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                    >
                      <RotateCcw size={16} />
                      Reset Tip
                    </button>
                  </div>
                </div>
              </div>

              {/* Current localStorage State */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center flex-shrink-0">
                    <Bug size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white">LocalStorage State</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                      Current values of app-related localStorage keys:
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 font-mono text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">hasSeenFirstPlantTip:</span>
                        <span className="text-gray-800 dark:text-gray-200">{localStorage.getItem('hasSeenFirstPlantTip') || 'null'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">onboardingComplete:</span>
                        <span className="text-gray-800 dark:text-gray-200">{localStorage.getItem('onboardingComplete') || 'null'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">animationsEnabled:</span>
                        <span className="text-gray-800 dark:text-gray-200">{localStorage.getItem('animationsEnabled') || 'null'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
