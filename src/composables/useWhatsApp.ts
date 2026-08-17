import { whatsappConfig, formatWhatsAppUrl } from 'src/config/whatsapp';
import type { Product, CartItem, CartDelivery } from 'src/stores/types';
import { formatPrice } from 'src/utils/format';

export function useWhatsApp() {
  function sendProductRequest(product: Product) {
    const price = formatProductPrice(product);
    const message = whatsappConfig.messageTemplates.product(product.name, price);
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  function sendCartProposal(items: CartItem[], totals: Record<string, number>, delivery?: CartDelivery) {
    const itemsList = items
      .map((item) => `${item.product.name} x${item.quantity} - ${formatProductPrice(item.product)}`)
      .join('\n');

    const totalsBlock = Object.entries(totals)
      .map(([currency, total]) => `Total ${currency}: ${formatPrice(total, currency)}`)
      .join('\n');

    const message = whatsappConfig.messageTemplates.cart(itemsList, totalsBlock, delivery);
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  function sendContactMessage() {
    const message = whatsappConfig.messageTemplates.contact();
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  return {
    sendProductRequest,
    sendCartProposal,
    sendContactMessage,
  };
}

function formatProductPrice(product: Product): string {
  const price = product.oferta && product.descuento ? product.descuento : product.price;
  const label = formatPrice(price, product.currency);
  const suffix = product.currency && product.currency !== 'CUP' ? product.currency : '';
  return product.oferta ? `${label}${suffix} (Oferta)` : `${label}${suffix}`;
}