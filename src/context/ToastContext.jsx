import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: "bg-emerald-500 text-black",
  error: "bg-rose-500 text-white",
  info: "bg-slate-900 text-white",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    const nextToast = {
      id,
      type: toast.type ?? "info",
      title: toast.title,
      message: toast.message,
    };

    setToasts((prev) => [...prev, nextToast]);

    const timeout = toast.timeout ?? 4000;
    if (timeout > 0) {
      window.setTimeout(() => removeToast(id), timeout);
    }

    return id;
  }, [removeToast]);

  const value = useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[92vw] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-4 py-3 shadow-lg backdrop-blur ${TOAST_STYLES[toast.type] ?? TOAST_STYLES.info}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {toast.title && (
                  <p className="text-sm font-conthrax">{toast.title}</p>
                )}
                {toast.message && (
                  <p className="text-xs opacity-90">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-xs opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};
