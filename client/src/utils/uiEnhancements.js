// Shared UI enhancement helpers: formatting, hooks, accessibility utilities
import { useRef, useEffect, useCallback, useState } from 'react';

export const useMountedRef = () => {
  const ref = useRef(false);
  useEffect(() => { ref.current = true; return () => { ref.current = false; }; }, []);
  return ref;
};

export const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

export const useAsyncTask = (asyncFn, deps = [], { immediate = false } = {}) => {
  const [state, setState] = useState({ loading: false, error: null, data: null });
  const mounted = useMountedRef();
  const run = useCallback(async (...args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await asyncFn(...args);
      if (mounted.current) setState({ loading: false, error: null, data });
      return data;
    } catch (e) {
      if (mounted.current) setState({ loading: false, error: e, data: null });
      throw e;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (immediate) run(); }, [immediate, run]);
  return { ...state, run };
};

export const formatDateShort = (d) => {
  try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(d)); } catch { return d; }
};

export const formatRelativeTime = (date) => {
  try {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    const diff = (new Date(date).getTime() - Date.now()) / 1000; // seconds
    const abs = Math.abs(diff);
    if (abs < 60) return rtf.format(Math.round(diff), 'seconds');
    if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minutes');
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hours');
    return rtf.format(Math.round(diff / 86400), 'days');
  } catch { return date; }
};

export const a11yButtonProps = (label, { onActivate } = {}) => ({
  role: 'button', tabIndex: 0, 'aria-label': label,
  onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate && onActivate(e); } }
});

export const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

export const mergeRefs = (...refs) => (el) => refs.forEach(r => { if (typeof r === 'function') r(el); else if (r && 'current' in r) r.current = el; });

export const noop = () => {};

export default {
  useMountedRef,
  useDebouncedValue,
  useAsyncTask,
  formatDateShort,
  formatRelativeTime,
  a11yButtonProps,
  clamp,
  mergeRefs,
  noop
};
