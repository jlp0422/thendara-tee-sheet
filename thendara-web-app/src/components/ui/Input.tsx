'use client';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
};

export function Input({ label, value, onChange, type = 'text', placeholder, error, autoComplete }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-white/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3.5 rounded-xl bg-white text-forest-900 placeholder:text-stone-400 text-base outline-none focus:ring-2 focus:ring-forest-600 ${error ? 'ring-2 ring-red-400' : ''}`}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
