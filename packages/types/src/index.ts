// Shared TypeScript types used by both apps/api and apps/mobile.
// Import in either app: import type { ApiResponse } from '@template/types'

export interface ApiResponse<T = unknown> {
  status: 'Success' | 'Error';
  result: T;
}
