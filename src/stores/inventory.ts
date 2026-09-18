import { defineStore } from 'pinia';
import { supabase } from 'boot/supabase';
import { getAdminBusinessId } from 'src/config/business';
import type { InventoryProduct, StockMove, StockMoveType, StockMoveResult } from './types';

interface InventoryState {
  products: InventoryProduct[];
  moves: StockMove[];
  loading: boolean;
  movesLoading: boolean;
}

export const useInventoryStore = defineStore('inventory', {
  state: (): InventoryState => ({
    products: [],
    moves: [],
    loading: false,
    movesLoading: false,
  }),

  getters: {
    totalProducts: (state): number => state.products.length,

    lowStockCount: (state): number =>
      state.products.filter(
        (p) => p.stock && p.stock.qty_available <= 5 && p.stock.qty_available > 0,
      ).length,

    damagedCount: (state): number =>
      state.products.filter((p) => p.stock && p.stock.qty_damaged > 0).length,

    outOfStockCount: (state): number =>
      state.products.filter((p) => p.stock && p.stock.qty_available === 0).length,
  },

  actions: {
    async fetchInventory() {
      const negocioId = getAdminBusinessId();
      if (!negocioId) return;

      this.loading = true;
      try {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('negocio_id', negocioId)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (productsError) throw productsError;

        const productIds = (products || []).map((p) => p.id);

        const stockMap: Record<string, { qty_available: number; qty_damaged: number }> = {};

        if (productIds.length) {
          const { data: stockData, error: stockError } = await supabase
            .from('stock')
            .select('product_id, qty_available, qty_damaged')
            .in('product_id', productIds);

          if (stockError) throw stockError;

          (stockData || []).forEach((s) => {
            stockMap[s.product_id] = {
              qty_available: s.qty_available,
              qty_damaged: s.qty_damaged,
            };
          });
        }

        this.products = (products || []).map((p) => {
          const s = stockMap[p.id];
          return {
            ...p,
            stock: s
              ? {
                  id: '',
                  product_id: p.id,
                  qty_available: s.qty_available,
                  qty_damaged: s.qty_damaged,
                  created_at: '',
                  updated_at: '',
                }
              : null,
          };
        });
      } catch (e) {
        console.error('Error fetchInventory:', e);
      } finally {
        this.loading = false;
      }
    },

    async fetchMoves(limit = 50) {
      this.movesLoading = true;
      try {
        const { data, error } = await supabase
          .from('stock_moves')
          .select('*, products(name)')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        this.moves = (data || []) as StockMove[];
      } catch (e) {
        console.error('Error fetchMoves:', e);
      } finally {
        this.movesLoading = false;
      }
    },

    async processMove(
      productId: string,
      type: StockMoveType,
      qty: number,
      note?: string,
    ): Promise<StockMoveResult> {
      try {
        const { data, error } = await supabase.rpc('process_stock_move', {
          p_product_id: productId,
          p_type: type,
          p_qty: qty,
          p_note: note || null,
        });

        if (error) throw error;

        const result = data as StockMoveResult;

        if (result.success) {
          const product = this.products.find((p) => p.id === productId);
          if (product && product.stock) {
            product.stock.qty_available = result.qty_available ?? product.stock.qty_available;
            product.stock.qty_damaged = result.qty_damaged ?? product.stock.qty_damaged;
          }

          await this.fetchMoves(50);
        }

        return result;
      } catch (e) {
        console.error('Error processMove:', e);
        return {
          success: false,
          error: e instanceof Error ? e.message : 'Error procesando movimiento',
        };
      }
    },

    updateLocalStock(productId: string, qtyAvailable: number, qtyDamaged: number) {
      const product = this.products.find((p) => p.id === productId);
      if (product && product.stock) {
        product.stock.qty_available = qtyAvailable;
        product.stock.qty_damaged = qtyDamaged;
      }
    },
  },
});
