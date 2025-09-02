// Utility function to conditionally join classNames
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default classNames;
