import { useState, useEffect } from 'react';
import { getCurrencySymbol, getDisplayPrice, getCourseMinorAmount } from '@/lib/pricing';
import type { CurrencyCode } from '@/lib/pricing';

/**
 * Hook personalizado para manejar precios multi-moneda
 * Detecta automáticamente la moneda desde las cookies y proporciona
 * funciones de utilidad para mostrar precios correctamente
 */
export function useCurrencyPricing() {
  const [currency, setCurrency] = useState<CurrencyCode>('usd');

  useEffect(() => {
    // Leer cookie de moneda establecida por middleware
    try {
      const match = document.cookie.match(/(?:^|; )currency=([^;]+)/);
      const cur = match ? decodeURIComponent(match[1]) : 'usd';
      if (cur === 'usd' || cur === 'eur' || cur === 'mxn' || cur === 'ars') {
        setCurrency(cur);
      }
    } catch {
      // Fallback to USD if there's any error
      setCurrency('usd');
    }
  }, []);

  /**
   * Obtiene el precio formateado para mostrar
   * @param type - Tipo de precio ('monthly', 'yearly', 'course')
   * @returns Objeto con el precio formateado
   */
  const getFormattedPrice = (type: 'monthly' | 'yearly' | 'course') => {
    const price = getDisplayPrice(type, currency);
    const currencySymbol = getCurrencySymbol(currency);
    const amount = Math.floor(price);
    const cents = Math.round((price % 1) * 100);
    
    return {
      currency: currencySymbol,
      amount: String(amount),
      cents: cents > 0 ? `.${String(cents).padStart(2, '0')}` : '',
      full: `${currencySymbol}${price}`,
      code: currency.toUpperCase()
    };
  };

  /**
   * Obtiene el precio en unidades menores para Stripe (centavos)
   * @param type - Tipo de precio ('monthly', 'yearly', 'course')
   * @returns Precio en centavos
   */
  const getMinorAmount = (type: 'monthly' | 'yearly' | 'course') => {
    if (type === 'course') {
      return getCourseMinorAmount(currency);
    }
    // Para suscripciones, calculamos basado en el precio mostrado
    const price = getDisplayPrice(type, currency);
    return Math.round(price * 100);
  };

  /**
   * Componente React para mostrar precios de manera consistente
   */
  const PriceDisplay = ({ 
    type, 
    showPeriod = true, 
    className = "price-main" 
  }: {
    type: 'monthly' | 'yearly' | 'course';
    showPeriod?: boolean;
    className?: string;
  }) => {
    const price = getFormattedPrice(type);
    const period = type === 'monthly' ? '/mes' : type === 'yearly' ? '/año' : '';
    
    return (
      <div className={className}>
        <span className="price-currency">{price.currency}</span>
        <span className="price-amount">{price.amount}</span>
        {price.cents && <span className="price-cents">{price.cents}</span>}
        {showPeriod && period && <span className="price-period">{price.code}{period}</span>}
      </div>
    );
  };

  return {
    currency,
    setCurrency,
    getCurrencySymbol: () => getCurrencySymbol(currency),
    getFormattedPrice,
    getMinorAmount,
    PriceDisplay
  };
}