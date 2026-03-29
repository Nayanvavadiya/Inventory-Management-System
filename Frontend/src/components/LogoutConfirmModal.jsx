import React from 'react';
import ReactDOM from 'react-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-[#1E293B] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <LogoutIcon className="text-red-500" fontSize="small" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Confirm Logout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 text-center text-white">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500">
            <LogoutIcon style={{ fontSize: 32 }} />
          </div>
          <p className="text-slate-300 text-base leading-relaxed">
            Are you sure you want to log out? <br />
            You will need to sign in again to access your account.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/50 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5 hover:text-white transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 order-1 sm:order-2"
          >
            Yes, Log Me Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutConfirmModal;
