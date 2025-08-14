'use client';

import { useState, useEffect } from 'react';
import { getDisplayPrice, getCurrencySymbol } from '@/lib/pricing';

interface Promotion {
  id: string;
  type: 'PREMIUM_SUBSCRIPTION' | 'NEW_COURSE' | 'SPECIAL_OFFER';
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
}

interface CountdownPromotionBannerProps {
  promotion: Promotion;
  onClose?: () => void;
  onTrack?: (action: 'impression' | 'click' | 'close' | 'conversion') => void;
  skipDelay?: boolean;
  endDate?: Date;
}

export default function CountdownPromotionBanner({ 
  promotion, 
  onClose, 
  onTrack, 
  skipDelay = false,
  endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}: CountdownPromotionBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currency, setCurrency] = useState<'usd' | 'eur' | 'mxn' | 'ars'>('usd');

  useEffect(() => {
    if (skipDelay) {
      setIsVisible(true);
      onTrack?.('impression');
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
        onTrack?.('impression');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onTrack, skipDelay]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +endDate - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endDate]);

  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|; )currency=([^;]+)/);
      const cur = match ? decodeURIComponent(match[1]) : 'usd';
      if (cur === 'usd' || cur === 'eur' || cur === 'mxn' || cur === 'ars') {
        setCurrency(cur as any);
      }
    } catch {}
  }, []);

  const handleClick = () => {
    onTrack?.('click');
  };

  if (!isVisible) return null;

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="promo-banner">
      <div className="promo-banner-content" onClick={handleClick}>
        <div className="promo-banner-text">
          <span className="promo-banner-emoji">🚀</span>
          <span className="promo-banner-message">
            {(() => {
              const price = getDisplayPrice('monthly', currency);
              return `Accede a todos nuestros cursos con Suscripción Plus por solo ${getCurrencySymbol(currency)}${price} ${currency.toUpperCase()}/mes – ¡Oferta por tiempo limitado!`;
            })()}
            <span className="promo-banner-countdown">
              {' '}({formatNumber(timeLeft.days)}d {formatNumber(timeLeft.hours)}h {formatNumber(timeLeft.minutes)}m {formatNumber(timeLeft.seconds)}s)
            </span>
          </span>
        </div>
        <div className="promo-banner-cta">
          {promotion.ctaText}
        </div>
      </div>
    </div>
  );
}