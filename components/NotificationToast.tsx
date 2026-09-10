'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function NotificationToast() {
  const { notification } = useApp();

  if (!notification) return null;

  const bgStyles = {
    success: 'bg-primary text-white border-primary-fixed',
    info: 'bg-surface-container-highest text-on-surface border-secondary',
    error: 'bg-error text-white border-error-container'
  };

  const icons = {
    success: 'check_circle',
    info: 'info',
    error: 'error'
  };

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${
          bgStyles[notification.type]
        }`}
      >
        <Icon name={icons[notification.type]} className="w-5 h-5 shrink-0" />
        <p className="text-xs font-medium">{notification.message}</p>
      </div>
    </div>
  );
}
