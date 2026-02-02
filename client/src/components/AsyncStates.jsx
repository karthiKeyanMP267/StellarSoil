import React from 'react';
import { useTranslation } from 'react-i18next';

// Reusable async state components for consistency & a11y
export function LoadingState({ messageKey = 'common.loading', inline = false, className = '' }) {
  const { t } = useTranslation();
  const content = (
    <div role="status" aria-live="polite" className={`flex items-center gap-2 text-sm text-gray-600 ${inline ? '' : 'p-4'} ${className}`}>
      <span className="inline-block h-3 w-3 animate-ping rounded-full bg-emerald-500" aria-hidden="true" />
      <span>{t(messageKey)}</span>
    </div>
  );
  return inline ? content : <div className="rounded-lg bg-white/60">{content}</div>;
}

export function ErrorState({ title = 'common.error', description, onRetry, retryLabel = 'common.retry', className = '' }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className={`border border-red-200 bg-red-50 text-red-700 p-4 rounded-lg space-y-2 ${className}`}>
      <p className="font-semibold">{t(title)}</p>
      {description && <p className="text-sm">{description}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {t(retryLabel)}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = '🌱', title = 'Nothing here yet', description = 'Check back later or adjust filters.', className = '' }) {
  return (
    <div className={`text-center p-6 border border-dashed border-gray-300 rounded-xl text-gray-500 bg-white/40 ${className}`}>      
      <div className="text-3xl mb-2" aria-hidden="true">{icon}</div>
      <p className="font-medium">{title}</p>
      <p className="text-xs mt-1 opacity-70 max-w-xs mx-auto">{description}</p>
    </div>
  );
}

export default { LoadingState, ErrorState, EmptyState };
