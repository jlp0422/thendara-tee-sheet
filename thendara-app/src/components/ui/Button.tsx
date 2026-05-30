import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

const base = 'flex-row items-center justify-center rounded-xl px-6 py-4';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-forest-900',
  secondary: 'bg-cream border border-forest-900',
  ghost: 'bg-transparent',
  danger: 'bg-red-700',
};

const labelStyles: Record<Variant, string> = {
  primary: 'text-white font-semibold text-base',
  secondary: 'text-forest-900 font-semibold text-base',
  ghost: 'text-forest-900 font-medium text-base',
  danger: 'text-white font-semibold text-base',
};

export function Button({ label, variant = 'primary', loading, disabled, ...rest }: ButtonProps) {
  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      className={`${base} ${variantStyles[variant]} ${disabled || loading ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1B3A2D'} />
      ) : (
        <Text className={labelStyles[variant]}>{label}</Text>
      )}
    </Pressable>
  );
}
