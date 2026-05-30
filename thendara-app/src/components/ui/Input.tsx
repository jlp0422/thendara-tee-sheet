import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-forest-900">{label}</Text>
      )}
      <TextInput
        {...rest}
        className={`bg-white border rounded-xl px-4 py-3.5 text-base text-forest-900 ${
          error ? 'border-red-600' : 'border-stone-200'
        }`}
        placeholderTextColor="#9AA59D"
      />
      {error && <Text className="text-xs text-red-600">{error}</Text>}
    </View>
  );
}
