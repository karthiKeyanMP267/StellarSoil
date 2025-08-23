import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-full sm:m-4'
};

const variantClasses = {
  default: 'bg-white/95 backdrop-blur-2xl border-yellow-200/50 shadow-3xl',
  solid: 'bg-white border-gray-200 shadow-2xl',
  warning: 'bg-yellow-50/95 backdrop-blur-xl border-yellow-300/50 shadow-3xl',
  danger: 'bg-red-50/95 backdrop-blur-xl border-red-300/50 shadow-3xl',
  success: 'bg-green-50/95 backdrop-blur-xl border-green-300/50 shadow-3xl'
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  variant = 'default',
  hideCloseButton = false,
  disableClose = false,
  description
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={disableClose ? () => {} : onClose}
        static={disableClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-lg transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel 
                className={`relative transform overflow-hidden rounded-3xl px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:p-6 border ${sizeClasses[size]} ${variantClasses[variant]}`}
              >
                <div className="sm:flex sm:items-start">
                  {title && (
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title className="text-2xl font-black leading-tight text-amber-900 tracking-wide drop-shadow-lg">
                        {title}
                      </Dialog.Title>
                      {description && (
                        <Dialog.Description className="mt-3 text-amber-700 font-medium tracking-wide">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                  )}
                </div>
                
                {!hideCloseButton && (
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className={`rounded-full backdrop-blur-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 p-2 hover:scale-110 transition-all
                        ${variant === 'default' ? 'bg-white/50 focus:ring-green-500' :
                          variant === 'warning' ? 'bg-yellow-100 focus:ring-yellow-500' :
                          variant === 'danger' ? 'bg-red-100 focus:ring-red-500' :
                          variant === 'success' ? 'bg-green-100 focus:ring-green-500' :
                          'bg-gray-100 focus:ring-gray-500'
                        }`}
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                )}
                
                <div className={`${title ? 'mt-4' : ''} ${description ? 'mt-6' : ''}`}>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
