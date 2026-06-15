"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-6 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-badge-verified flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-primary flex-shrink-0" />,
  };

  const bgColors = {
    success: "bg-emerald-50/95 border-emerald-200/50",
    error: "bg-red-50/95 border-red-200/50",
    info: "bg-secondary border-border/40",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl animate-slide-up",
        bgColors[toast.type]
      )}
      role="alert"
    >
      {icons[toast.type]}
      <p className="text-sm text-foreground flex-1">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
