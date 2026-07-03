import { Wallet, ShieldCheck, TrendingUp, Zap } from "lucide-react";

const features = [
  { icon: ShieldCheck, text: "Bank-grade encryption on every transaction" },
  { icon: TrendingUp, text: "Real-time insights into where your money goes" },
  { icon: Zap, text: "Automated categorization, zero manual entry" },
];

export default function BrandPanel() {
  return (
    <div className="relative hidden lg:flex w-[46%] shrink-0 flex-col justify-between overflow-hidden bg-(--sidebar-bg) p-12 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand/30 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-brand/20 blur-3xl animate-blob animation-delay-4000" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
          <Wallet size={17} className="text-white" />
        </div>
        <span className="font-semibold tracking-tight text-lg">Xpense</span>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl xl:text-4xl font-semibold tracking-tight leading-tight mb-4">
          Every rupee,
          <br />
          accounted for.
        </h1>
        <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
          Xpense gives you a single, elegant place to track income, spending and
          savings — built for people who take their money seriously.
        </p>

        <div className="space-y-3 mb-10">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-white/80">
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-brand-soft" />
              </span>
              {text}
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 animate-float">
          <p className="text-xs text-white/50 mb-1">Total balance</p>
          <p className="font-tabular text-2xl font-semibold mb-3">₹42,384.20</p>
          <div className="flex items-end gap-1.5 h-10">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-linear-to-t from-brand to-brand/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="relative z-10 text-xs text-white/40">
        © {new Date().getFullYear()} Xpense. All rights reserved.
      </p>
    </div>
  );
}