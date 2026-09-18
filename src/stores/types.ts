export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  currency?: string;
  estado: 'Disponible' | 'Agotado';
  oferta?: boolean;
  descuento: number;
  descripcion?: string;
  new?: boolean;
  negocio_id?: string;
  created_at?: string;
  cost_price?: number | null;
}

export interface ProductFormData {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  currency: string;
  estado: 'Disponible' | 'Agotado';
  oferta: boolean;
  descuento: number;
  descripcion: string;
  new: boolean;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartDelivery {
  method: 'domicilio' | 'retiro';
  name?: string;
  address?: string;
  refs?: string;
}

export interface OrderContact {
  fullName: string;
  phone: string;
  address: string;
  refs?: string;
}

export interface OrderRecord {
  id: string;
  items: CartItem[];
  total: number;
  contact: OrderContact;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  isAdmin?: boolean;
}

export type OrderStatus = 'Pendiente' | 'Confirmado' | 'Entregado' | 'Cancelado' | 'Rechazado';

export interface Order {
  id: number;
  token: string;
  total_cup: number | null;
  total_usd: number | null;
  type_delivery: 'domicilio' | 'retiro';
  status: OrderStatus;
  client_name?: string | null;
  address_client?: string | null;
  negocio_id: string;
  created_at: string;
}

export interface OrderProductRow {
  id: number;
  id_order: number;
  id_product: string;
  qty: number;
  price_at_order: number | null;
  products?: { name: string; image?: string; currency?: string } | null;
}

export type StockMoveType = 'entrada' | 'salida' | 'devolucion' | 'ajuste' | 'dano';

export interface Stock {
  id: string;
  product_id: string;
  qty_available: number;
  qty_damaged: number;
  created_at: string;
  updated_at: string;
}

export interface StockMove {
  id: string;
  product_id: string;
  type: StockMoveType;
  qty: number;
  order_id: string | null;
  user_id: string;
  note: string | null;
  created_at: string;
  user_name?: string | null;
  products?: { name: string; image?: string } | null;
}

export interface InventoryProduct extends Product {
  stock: Stock | null;
}

export interface StockMoveResult {
  success: boolean;
  error?: string;
  qty_available?: number;
  qty_damaged?: number;
}

export interface Sale {
  id: number;
  negocio_id: string;
  token?: string | null;
  order_id?: number | null;
  total_cup: number | null;
  total_usd?: number | null;
  note?: string | null;
  created_at: string;
}

export interface SaleProductRow {
  id: number;
  sale_id: number;
  id_product: string;
  qty: number;
  price_at_sale: number | null;
  products?: { name: string; image?: string; currency?: string } | null;
}

export interface SalePaymentRow {
  id: number;
  sale_id: number;
  method: string;
  amount: number;
  currency?: string | null;
}

export interface SaleProductInput {
  product_id: string;
  qty: number;
  price_at_sale: number;
  currency: string;
  name?: string;
}

export interface SalePaymentInput {
  method: string;
  amount: number;
  currency: string;
}

export interface SaleResult {
  success: boolean;
  sale_id?: number;
  token?: string | null;
  total_cup?: number;
  total_usd?: number;
  error?: string;
}

export interface PosCartItem {
  product_id: string;
  name: string;
  currency: string;
  price_at_sale: number;
  qty: number;
  stock_max: number;
}
