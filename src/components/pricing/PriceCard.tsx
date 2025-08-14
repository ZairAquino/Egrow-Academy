import React from 'react';
import { useCurrencyPricing } from '@/hooks/useCurrencyPricing';

interface PriceCardProps {
  type: 'monthly' | 'yearly' | 'course';
  title?: string;
  description?: string;
  className?: string;
  showRadio?: boolean;
  radioName?: string;
  radioId?: string;
  defaultChecked?: boolean;
  children?: React.ReactNode;
}

/**
 * Componente reutilizable para mostrar cards de precios
 * que se actualizan automáticamente según la moneda detectada
 */
export default function PriceCard({
  type,
  title,
  description,
  className = "price-display",
  showRadio = false,
  radioName = "pricing",
  radioId,
  defaultChecked = false,
  children
}: PriceCardProps) {
  const { getFormattedPrice, currency } = useCurrencyPricing();
  const price = getFormattedPrice(type);
  const period = type === 'monthly' ? '/mes' : type === 'yearly' ? '/año' : '';

  return (
    <div className={className}>
      {showRadio && (
        <div className="price-radio">
          <input 
            type="radio" 
            name={radioName} 
            id={radioId || `${type}-option`} 
            defaultChecked={defaultChecked} 
          />
          <label htmlFor={radioId || `${type}-option`}></label>
        </div>
      )}
      
      <div className="price-main">
        <span className="price-currency">{price.currency}</span>
        <span className="price-amount">{price.amount}</span>
        {price.cents && <span className="price-cents">{price.cents}</span>}
        {period && <span className="price-period">{currency.toUpperCase()}{period}</span>}
      </div>

      {title && (
        <div className="price-title">
          <span className="title-text">{title}</span>
        </div>
      )}

      {description && (
        <div className="price-description">
          <span className="description-text">{description}</span>
        </div>
      )}

      {children}
    </div>
  );
}