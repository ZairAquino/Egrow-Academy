'use client';

import { usePromotions } from '@/hooks/usePromotions';
import ElegantPromotionBanner from './ElegantPromotionBanner';

export default function PromotionBannerWrapper({ skipDelay = false }: { skipDelay?: boolean }) {
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

  return (
    <ElegantPromotionBanner
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
    />
  );
} 