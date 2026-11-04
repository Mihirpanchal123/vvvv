"use client";

import Link from "next/link";
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink hover:bg-brand-hover",
  secondary: "bg-surface text-fg border border-line hover:bg-surface-2",
  ghost: "text-fg hover:bg-surface-2",
  danger: "bg-danger text-white hover:opacity-90",
};
const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
// `sm` stays 40px tall on touch-sized screens so it remains an easy tap target.
const SIZES = { sm: "h-10 px-3 text-sm sm:h-8", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof SIZES }) {
  return <button type="button" className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof SIZES }) {
  return <Link className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props} />;
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-xl border border-line bg-surface ${className}`} {...props} />;
}

type Tone = "neutral" | "brand" | "ok" | "warn" | "danger";
const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted",
  brand: "bg-brand-soft text-brand",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
};

export function Badge({ tone = "neutral", className = "", ...props }: ComponentProps<"span"> & { tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`} {...props} />;
}

export function Notice({ tone = "warn", title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  return (
    <div className={`rounded-lg px-4 py-3 text-sm ${TONES[tone]}`} role={tone === "danger" ? "alert" : undefined}>
      {title && <p className="font-semibold">{title}</p>}
      <div className="text-fg/90">{children}</div>
    </div>
  );
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

// 16px text below `sm` stops iOS Safari from zooming the page when a field is focused.
const inputCls =
  "h-11 rounded-lg border border-line bg-surface px-3 text-base text-fg placeholder:text-muted user-invalid:border-danger sm:h-10 sm:text-sm";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${inputCls} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return <select className={`${inputCls} ${className}`} {...props} />;
}

/** A checkbox styled as a selectable card/chip. */
export function ChoiceChip({
  checked,
  onChange,
  label,
  description,
  type = "checkbox",
  name,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  type?: "checkbox" | "radio";
  name?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm transition-colors ${
        checked ? "border-brand bg-brand-soft" : "border-line bg-surface hover:bg-surface-2"
      }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-[var(--brand)]"
      />
      <span>
        <span className="font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-muted">{description}</span>}
      </span>
    </label>
  );
}

export interface ModalHandle {
  open: () => void;
  close: () => void;
}

/**
 * Native modal <dialog>: the browser handles focus containment, Esc, inert background and focus return.
 * Light dismiss uses `closedby="any"`, with a pointer-position fallback where it isn't supported (Safari).
 */
export const Modal = forwardRef<ModalHandle, { title: string; children: ReactNode; onClose?: () => void; wide?: boolean }>(
  function Modal({ title, children, onClose, wide }, ref) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;
      const outside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressedOutside = false;
      const down = (e: PointerEvent) => (pressedOutside = outside(e));
      const up = (e: PointerEvent) => {
        if (pressedOutside && outside(e)) dialog.close();
      };
      dialog.addEventListener("pointerdown", down);
      dialog.addEventListener("pointerup", up);
      return () => {
        dialog.removeEventListener("pointerdown", down);
        dialog.removeEventListener("pointerup", up);
      };
    }, []);

    return (
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        closedby="any"
        onClose={onClose}
        // Phones: full-width bottom sheet. sm and up: centred card.
        className={`mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-b-0 border-line bg-surface p-0 text-fg shadow-xl sm:m-auto sm:max-h-[90dvh] sm:w-[calc(100%-2rem)] ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"} sm:rounded-2xl sm:border-b`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-surface py-2 pr-2 pl-4 sm:py-3 sm:pl-5">
          <h2 id={titleId} className="text-base font-semibold sm:text-lg">
            {title}
          </h2>
          <form method="dialog">
            <button className="grid size-10 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Close">
              ✕
            </button>
          </form>
        </div>
        <div className="px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">{children}</div>
      </dialog>
    );
  },
);

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <div className="mt-1 text-muted">{subtitle}</div>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="size-4 animate-spin rounded-full border-2 border-line border-t-brand" aria-hidden />
      {label}
    </span>
  );
}
