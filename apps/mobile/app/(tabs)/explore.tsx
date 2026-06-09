import { ScrollView, Text, View } from 'react-native';

const STACK = [
  {
    layer: 'Mobile',
    tech: 'Expo SDK 54 · Expo Router · NativeWind v4',
    detail: 'File-based routing, Tailwind className styling, React Native 0.81',
    color: 'border-blue-200 bg-blue-50',
    label: 'text-blue-600',
  },
  {
    layer: 'API',
    tech: 'Fastify 5 · TypeScript · Postgres',
    detail: 'Runs on ECS Fargate in production, local dev on port 8080',
    color: 'border-violet-200 bg-violet-50',
    label: 'text-violet-600',
  },
  {
    layer: 'Shared Types',
    tech: 'packages/types',
    detail: 'TypeScript interfaces shared between mobile and API — no duplicated types',
    color: 'border-indigo-200 bg-indigo-50',
    label: 'text-indigo-600',
  },
  {
    layer: 'Infrastructure',
    tech: 'AWS · Terraform · ECS Fargate · RDS',
    detail: 'VPC, ALB, ECR, API Gateway v2, CloudFront, RDS Postgres — ~$45/mo demo env',
    color: 'border-orange-200 bg-orange-50',
    label: 'text-orange-600',
  },
  {
    layer: 'CI / CD',
    tech: 'GitHub Actions · Husky',
    detail: 'Path-filtered jobs for api, mobile, and terraform validate on every PR',
    color: 'border-gray-200 bg-gray-50',
    label: 'text-gray-600',
  },
] as const;

export default function ExploreScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-10">
        <Text className="text-3xl font-bold text-gray-900 mb-1">The Stack</Text>
        <Text className="text-gray-500 mb-8">What&#39;s under the hood of this template.</Text>

        {STACK.map((item) => (
          <View key={item.layer} className={`mb-4 border rounded-2xl p-5 ${item.color}`}>
            <Text className={`text-xs font-bold uppercase tracking-widest mb-1 ${item.label}`}>
              {item.layer}
            </Text>
            <Text className="text-base font-semibold text-gray-900 mb-1">{item.tech}</Text>
            <Text className="text-sm text-gray-500 leading-5">{item.detail}</Text>
          </View>
        ))}

        <View className="mt-2 border border-gray-200 rounded-2xl p-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Getting started
          </Text>
          <Text className="text-sm text-gray-600 leading-6">
            Run <Text className="font-mono bg-gray-100 px-1 rounded">npm run reset-project</Text> to
            clear these example screens and start with a blank canvas.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
