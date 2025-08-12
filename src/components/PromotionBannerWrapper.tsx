'use client';

import { usePromotions } from '@/hooks/usePromotions';
import ElegantPromotionBanner from './ElegantPromotionBanner';
import CountdownPromotionBanner from './CountdownPromotionBanner';

export default function PromotionBannerWrapper({ skipDelay = false, useCountdown = false }: { skipDelay?: boolean; useCountdown?: boolean }) {
  const { 
    activePromotion, 
    isLoading, 
    handleBannerClose, 
    handleBannerClick, 
    handleBannerImpression 
  } = usePromotions();

  if (isLoading || !activePromotion) {
    return null;
  }

  const BannerComponent = useCountdown ? CountdownPromotionBanner : ElegantPromotionBanner;

  return (
    <BannerComponent
      promotion={activePromotion}
      skipDelay={skipDelay}
      onClose={handleBannerClose}
      onTrack={(action) => {
        if (action === 'impression') {
          handleBannerImpression();
        } else if (action === 'click') {
          handleBannerClick();
        } else if (action === 'close') {
          handleBannerClose();
        }
      }}
      {...(useCountdown ? { endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } : {})}
    />
  );
} 