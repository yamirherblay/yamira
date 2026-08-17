import { defineStore } from 'pinia';
import { supabase } from 'boot/supabase';

interface AuthState {
  isAuthenticated: boolean;
  negocio_id: string | null;
  user: {
    id: string;
    email: string;
  } | null;
}

const STORAGE_KEY = 'y4y_auth';

function loadState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {
    console.error('Error loading auth state from localStorage.');
  }
  return { isAuthenticated: false, negocio_id: null, user: null };
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => loadState(),
  getters: {
    isAdmin: () => true,
    userEmail: (state) => state.user?.email || null,
  },
  actions: {
    async fetchNegocioId(userId: string) {
      const { data } = await supabase
        .from('negocios')
        .select('id')
        .eq('user_uuid', userId)
        .maybeSingle();
      this.negocio_id = data?.id || null;
    },

    async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          this.isAuthenticated = true;
          this.user = {
            id: data.user.id,
            email: data.user.email || '',
          };
          await this.fetchNegocioId(data.user.id);
          this.persist();
          return { success: true };
        }

        return { success: false, error: 'Error desconocido' };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error de conexión';
        return { success: false, error: message };
      }
    },

    async logout() {
      await supabase.auth.signOut();
      this.isAuthenticated = false;
      this.negocio_id = null;
      this.user = null;
      this.persist();
    },

    async initializeAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        this.isAuthenticated = true;
        this.user = {
          id: session.user.id,
          email: session.user.email || '',
        };
        await this.fetchNegocioId(session.user.id);
        this.persist();
      }

      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          this.isAuthenticated = true;
          this.user = {
            id: session.user.id,
            email: session.user.email || '',
          };
         void this.fetchNegocioId(session.user.id).then(() => this.persist());
        } else {
          this.isAuthenticated = false;
          this.negocio_id = null;
          this.user = null;
          this.persist();
        }
      });
    },

    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            isAuthenticated: this.isAuthenticated,
            negocio_id: this.negocio_id,
            user: this.user,
          }),
        );
      } catch {
        console.error('Error saving auth state to localStorage.');
      }
    },
  },
});
