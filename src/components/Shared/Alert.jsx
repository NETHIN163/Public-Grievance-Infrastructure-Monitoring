import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose }) {
  const configs = {
    success: {
      bg: 'bg-emerald-50/70 border-emerald-200/50 text-emerald-800',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
    },
    error: {
      bg: 'bg-red-50/70 border-red-200/50 text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-amber-50/70 border-amber-200/50 text-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-blue-50/70 border-blue-200/50 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const current = configs[type] || configs.info;
  const Icon = current.icon;

  return (
    <div className={`flex items-start space-x-3 p-3.5 rounded-xl border ${current.bg} animate-fade-in`}>
      <Icon className={`w-4 h-4 flex-shrink-0 ${current.iconColor} mt-0.5`} />
      <div className="flex-1 text-xs font-semibold leading-relaxed">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-govMatte-muted hover:text-govMatte-text matte-transition ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
