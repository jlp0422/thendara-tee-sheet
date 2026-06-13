'use client';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
};

const styles: Record<Variant, string> = {
  primary: 'bg-forest-900 text-white active:opacity-80',
  secondary: 'bg-white border border-forest-900 text-forest-900 active:opacity-80',
  ghost: 'text-forest-900 active:opacity-60',
  danger: 'bg-red-50 border border-red-200 text-red-700 active:opacity-80',
};

export function Button({ label, onPress, loading = false, variant = 'primary', disabled = false, fullWidth = true }: Props) {
  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      className={`${fullWidth ? 'w-full' : ''} py-4 px-6 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 ${styles[variant]}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {label}
    </button>
  );
}
