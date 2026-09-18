import { supabase } from 'boot/supabase';
import type { SalePaymentInput, SaleProductInput, SaleResult } from 'src/stores/types';

interface CreateSalePayload {
  p_negocio_id: string;
  p_items: SaleProductInput[];
  p_payments: SalePaymentInput[];
  p_note?: string;
}

interface RpcSaleResponse {
  ok?: boolean;
  sale_id?: number;
  token?: string | null;
  total_cup?: number;
  total_usd?: number;
  error?: string;
}

function toSaleResult(d: RpcSaleResponse | null | undefined): SaleResult {
  if (!d || d.ok === false) {
    return { success: false, error: d?.error || 'Operación no procesada' };
  }
  const r: SaleResult = { success: true };
  if (d.sale_id !== undefined) r.sale_id = d.sale_id;
  if (d.token != null) r.token = d.token;
  if (d.total_cup !== undefined) r.total_cup = d.total_cup;
  if (d.total_usd !== undefined) r.total_usd = d.total_usd;
  return r;
}

export function useSales() {
  async function createSale(payload: CreateSalePayload): Promise<SaleResult> {
    try {
      const { data, error } = await supabase.rpc('create_sale', payload);
      if (error) return { success: false, error: error.message };
      return toSaleResult(data as RpcSaleResponse | null);
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Error al crear la venta',
      };
    }
  }

  async function createSaleFromOrder(p_order_id: number, p_payments: SalePaymentInput[], p_note?: string): Promise<SaleResult> {
    try {
      const { data, error } = await supabase.rpc('create_sale_from_order', {
        p_order_id,
        p_payments,
        p_note,
      });
      if (error) return { success: false, error: error.message };
      return toSaleResult(data as RpcSaleResponse | null);
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Error al entregar la orden',
      };
    }
  }

  async function anularVenta(p_sale_id: number, p_note: string): Promise<SaleResult> {
    try {
      const { data, error } = await supabase.rpc('anular_venta', { p_sale_id, p_note });
      if (error) return { success: false, error: error.message };
      return toSaleResult(data as RpcSaleResponse | null);
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Error al anular la venta',
      };
    }
  }

  return { createSale, createSaleFromOrder, anularVenta };
}