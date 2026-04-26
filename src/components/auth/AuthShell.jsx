import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1626] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.16),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.12),transparent_22%),radial-gradient(circle_at_bottom,rgba(45,212,191,0.09),transparent_28%),linear-gradient(180deg,#0e1727_0%,#101a2c_55%,#111d31_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute left-1/2 top-[-4rem] h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-200/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.07] px-5 py-3 shadow-[0_10px_30px_rgba(2,6,23,0.2)] backdrop-blur-xl transition hover:bg-white/[0.1]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.16),rgba(45,212,191,0.12))] text-cyan-100 shadow-[0_0_24px_rgba(103,232,249,0.1)]">
              <Shield size={19} />
            </div>
            <div>
              <div className="font-space text-2xl font-bold tracking-tight text-white">Crozora</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Trust Infrastructure</div>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <section className="relative w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(24,34,56,0.92),rgba(18,27,45,0.97))] p-6 shadow-[0_28px_100px_rgba(2,6,23,0.48)] backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
            <div className="absolute right-0 top-0 h-40 w-40 bg-cyan-200/5 blur-3xl" />

            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.75)]" />
                {eyebrow}
              </div>
              <h1 className="mt-5 font-space text-[2.65rem] font-bold tracking-tight text-white sm:text-[3.15rem] sm:leading-[1.02]">
                {title}
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-7 text-slate-300 sm:text-base">
                {description}
              </p>
            </div>

            {children}

            {footer ? (
              <div className="mt-8 border-t border-white/10 pt-6">
                {footer}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

export function AuthNotice({ tone = 'neutral', title, children }) {
  const styles = {
    neutral: 'border-white/10 bg-white/[0.045] text-slate-200',
    error: 'border-red-400/20 bg-red-400/[0.09] text-red-100',
    success: 'border-emerald-400/20 bg-emerald-400/[0.09] text-emerald-100',
    info: 'border-cyan-300/20 bg-cyan-300/[0.09] text-cyan-100',
    warning: 'border-amber-300/20 bg-amber-300/[0.09] text-amber-100',
  };

  return (
    <div className={`rounded-2xl border px-4 py-4 ${styles[tone]}`}>
      {title ? <div className="text-sm font-semibold">{title}</div> : null}
      <div className={`text-sm leading-6 ${title ? 'mt-1.5' : ''}`}>{children}</div>
    </div>
  );
}

export function AuthInput({
  label,
  hint = null,
  trailing = null,
  className = '',
  ...props
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      <div className="relative">
        <input
          {...props}
          className={`w-full rounded-2xl border border-white/10 bg-white/[0.065] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/[0.09] focus:ring-4 focus:ring-cyan-300/10 ${trailing ? 'pr-12' : ''} ${className}`}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {trailing}
          </div>
        ) : null}
      </div>
    </label>
  );
}

export function AuthButton({
  children,
  secondary = false,
  className = '',
  ...props
}) {
  const baseClass = secondary
    ? 'border border-white/10 bg-white/[0.05] text-slate-100 hover:bg-white/[0.08]'
    : 'bg-[linear-gradient(135deg,#4cc9ff_0%,#2d7df6_45%,#1ca39a_100%)] text-white shadow-[0_18px_40px_rgba(37,99,235,0.26)] hover:translate-y-[-1px] hover:shadow-[0_22px_44px_rgba(37,99,235,0.32)]';

  return (
    <button
      {...props}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition duration-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${baseClass} ${className}`}
    >
      {children}
    </button>
  );
}
