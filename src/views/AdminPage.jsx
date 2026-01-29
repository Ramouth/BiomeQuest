/**
 * AdminPage View
 * Admin panel for managing plant requests and users
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, RefreshCw, AlertCircle, Users, Leaf, Trash2, Shield, Bug, RotateCcw, MessageSquare, Star } from 'lucide-react';
import { requestsAPI } from '../models/api/requestsApi';
import { authAPI } from '../models/api/authApi';
import { feedbackAPI } from '../models/api/feedbackApi';
import { getAvatarUrl } from '../constants/avatars';

const AdminPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('requests');

  // Plant requests state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Feedback state
  const [feedback, setFeedback] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

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

  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    setError(null);
    try {
      const data = await feedbackAPI.getAll();
      setFeedback(data.feedback);
      setFeedbackStats(data.stats);
    } catch (err) {
      setError(err.userMessage || 'Failed to load feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchUsers();
    fetchFeedback();
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
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'feedback') {
      fetchFeedback();
    }
  };

  const isLoading = activeTab === 'requests' ? requestsLoading : activeTab === 'users' ? usersLoading : activeTab === 'feedback' ? feedbackLoading : false;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 max-w-xs w-full shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">Delete User?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete <span className="font-medium text-gray-700 dark:text-gray-300">{deleteConfirm.username}</span>? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-150 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm.id)}
                disabled={actionLoading === deleteConfirm.id}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:bg-red-300 transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                {actionLoading === deleteConfirm.id ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
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
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'feedback'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageSquare size={18} />
            Feedback
            {feedback.length > 0 && (
              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                {feedback.length}
              </span>
            )}
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
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Pending Requests</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {requests.length} awaiting review
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
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-3">🌱</div>
                <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">No Pending Requests</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">All plant requests have been reviewed.</p>
              </div>
            )}

            {!requestsLoading && requests.length > 0 && (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-100/80 dark:border-gray-700/60 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{request.suggested_emoji || '🌱'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800 dark:text-white truncate">{request.plant_name}</h3>
                          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          by <span className="font-medium text-gray-600 dark:text-gray-300">{request.requested_by}</span>
                        </p>
                      </div>
                    </div>
                    {request.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg px-3 py-2 leading-relaxed">
                        {request.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleApprove(request.id, request.plant_name, request.suggested_emoji)}
                        disabled={actionLoading === request.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-[0.98] disabled:bg-green-300 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-150"
                      >
                        {actionLoading === request.id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id, request.plant_name)}
                        disabled={actionLoading === request.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-red-50 dark:bg-gray-700 dark:hover:bg-red-900/30 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 font-medium py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-[0.98]"
                      >
                        {actionLoading === request.id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <X size={16} />
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
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Users</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {users.length} registered
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
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-3">👤</div>
                <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">No Users</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">No users have registered yet.</p>
              </div>
            )}

            {!usersLoading && users.length > 0 && (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-md border border-gray-100/80 dark:border-gray-700/60 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-green-800/30 flex-shrink-0 ring-2 ring-white dark:ring-gray-700">
                        <img
                          src={getAvatarUrl(user.avatarSeed)}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">{user.username}</h3>
                          {user.isAdmin && (
                            <span className="flex items-center gap-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                              <Shield size={10} />
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{user.totalPoints} pts</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{user.uniquePlants} plants</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {!user.isAdmin && (
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Feedback</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {feedback.length} response{feedback.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Stats Summary */}
            {feedbackStats && feedbackStats.totalResponses > 0 && (
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100/80 dark:border-gray-700/60">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {feedbackStats.avgRating}<span className="text-sm font-normal text-gray-400">/5</span>
                  </p>
                </div>
                <div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100/80 dark:border-gray-700/60">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Sentiment</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500 font-semibold text-sm">{feedbackStats.positiveCount} pos</span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span className="text-red-400 font-semibold text-sm">{feedbackStats.negativeCount} neg</span>
                  </div>
                </div>
              </div>
            )}

            {feedbackLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw size={32} className="text-purple-500 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Loading feedback...</p>
                </div>
              </div>
            )}

            {!feedbackLoading && feedback.length === 0 && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-3">📝</div>
                <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">No Feedback Yet</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">Feedback from beta testers will appear here.</p>
              </div>
            )}

            {!feedbackLoading && feedback.length > 0 && (
              <div className="space-y-3">
                {feedback.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-100/80 dark:border-gray-700/60 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.username}</p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{item.plants_logged} plants, {item.total_points} pts</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            className={star <= item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-600'}
                          />
                        ))}
                      </div>
                    </div>

                    {item.feedback_text && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg px-3 py-2 leading-relaxed italic">
                        "{item.feedback_text}"
                      </p>
                    )}

                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Debug Tab */}
        {activeTab === 'debug' && (
          <>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Debug Tools</h2>
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

            <div className="space-y-3">
              {/* First Plant Tip Reset */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-gray-700/60 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center flex-shrink-0">
                    <RotateCcw size={18} className="text-orange-500 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Reset First Plant Tip</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Clear hasSeenFirstPlantTip flag</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('hasSeenFirstPlantTip');
                    setDebugMessage('First Plant Tip has been reset. Add a plant to see the tip (requires no plant history).');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-medium py-2 px-4 rounded-xl transition-all duration-150 text-sm"
                >
                  <RotateCcw size={14} />
                  Reset Tip
                </button>
              </div>

              {/* Current localStorage State */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100/80 dark:border-gray-700/60 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center flex-shrink-0">
                    <Bug size={18} className="text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">LocalStorage State</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">App-related localStorage keys</p>
                  </div>
                </div>
                <div className="bg-gray-50/80 dark:bg-gray-700/30 rounded-lg p-2.5 font-mono text-[11px] space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">hasSeenFirstPlantTip</span>
                    <span className="text-gray-700 dark:text-gray-300">{localStorage.getItem('hasSeenFirstPlantTip') || 'null'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">onboardingComplete</span>
                    <span className="text-gray-700 dark:text-gray-300">{localStorage.getItem('onboardingComplete') || 'null'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">animationsEnabled</span>
                    <span className="text-gray-700 dark:text-gray-300">{localStorage.getItem('animationsEnabled') || 'null'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">feedbackStatus</span>
                    <span className="text-gray-700 dark:text-gray-300">{localStorage.getItem('feedbackStatus') || 'null'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">sessionCount</span>
                    <span className="text-gray-700 dark:text-gray-300">{localStorage.getItem('sessionCount') || 'null'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      localStorage.removeItem('feedbackStatus');
                      localStorage.removeItem('feedbackRemindLater');
                      localStorage.removeItem('sessionCount');
                      localStorage.removeItem('firstUseDate');
                      setDebugMessage('Feedback triggers reset. Refresh the page to test.');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-purple-500 hover:bg-purple-600 active:scale-[0.98] text-white font-medium py-2 px-3 rounded-xl transition-all duration-150 text-sm"
                  >
                    <RotateCcw size={14} />
                    Reset Feedback
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('lastWeeklySummaryShown');
                      setDebugMessage('Weekly summary reset. Refresh the page to see it.');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-white font-medium py-2 px-3 rounded-xl transition-all duration-150 text-sm"
                  >
                    <RotateCcw size={14} />
                    Reset Weekly
                  </button>
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
