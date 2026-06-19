import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function HomeScreen() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const ping = useCallback(async () => {
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessage(data.result || data.status);
      setStatus('success');
    } catch {
      setMessage('Could not reach the API. Is it running on ' + API_URL + '?');
      setStatus('error');
    }
  }, []);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center px-6 pt-16 pb-10">
        <Text className="text-3xl font-bold text-gray-900 mb-2">API Health</Text>
        <Text className="text-gray-500 text-center mb-10">
          Tap the button to ping your Fastify backend.
        </Text>

        <Pressable
          onPress={ping}
          disabled={status === 'loading'}
          className="bg-blue-600 px-8 py-4 rounded-2xl active:opacity-70 disabled:opacity-50"
        >
          <Text className="text-white font-semibold text-base">Ping API</Text>
        </Pressable>

        {status === 'loading' && <ActivityIndicator className="mt-8" size="large" />}

        {status === 'success' && (
          <View className="mt-8 w-full bg-green-50 border border-green-200 rounded-2xl p-5">
            <Text className="text-green-700 font-semibold text-base mb-1">✓ Connected</Text>
            <Text className="text-green-600">{message}</Text>
          </View>
        )}

        {status === 'error' && (
          <View className="mt-8 w-full bg-red-50 border border-red-200 rounded-2xl p-5">
            <Text className="text-red-700 font-semibold text-base mb-1">✗ Error</Text>
            <Text className="text-red-600">{message}</Text>
          </View>
        )}

        <View className="mt-10 w-full bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <Text className="text-xs text-gray-400 font-mono">API_URL</Text>
          <Text className="text-sm text-gray-600 font-mono mt-1">{API_URL}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
