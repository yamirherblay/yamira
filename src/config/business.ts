import { useAuthStore } from 'src/stores/auth';

export const businessConfig = {
  id: import.meta.env.VITE_NEGOCIO_ID || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export function getBusinessId(): string {
  return businessConfig.id;
}

export function getAdminBusinessId(): string | null {
  const auth = useAuthStore();
  return auth.negocio_id || null;
}
