import { defineStore } from 'pinia';

export type ChangeType = 'add' | 'update' | 'delete';

export interface ChangeItem {
  id?: string;
  type: ChangeType;
  productName: string;
  at: number;
}

interface AdminChangesState {
  items: ChangeItem[];
}

export const useAdminChangesStore = defineStore('adminChanges', {
  state: (): AdminChangesState => ({
    items: [],
  }),
  getters: {
    count: (state): number => state.items.length,
    list: (state): ChangeItem[] => state.items,
  },
  actions: {
    addAdded(payload: { id: string; name: string }) {
      this.items.unshift({
        id: payload.id,
        type: 'add',
        productName: payload.name,
        at: Date.now(),
      });
    },
    addUpdated(payload: { id: string; name: string }) {
      this.items.unshift({
        id: payload.id,
        type: 'update',
        productName: payload.name,
        at: Date.now(),
      });
    },
    addDeleted(payload: { id: string; name: string }) {
      this.items.unshift({
        id: payload.id,
        type: 'delete',
        productName: payload.name,
        at: Date.now(),
      });
    },
    clear() {
      this.items = [];
    },
  },
});
