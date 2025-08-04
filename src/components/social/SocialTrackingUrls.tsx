'use client';

import { useState } from 'react';
import { getSocialTrackingUrls, generateSocialTrackingUrl } from '@/lib/social-tracking';

interface SocialTrackingUrlsProps {
  platform: 'instagram' | 'tiktok' | 'linkedin';
  showCopyButtons?: boolean;
}

export default function SocialTrackingUrls({ platform, showCopyButtons = true }: SocialTrackingUrlsProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const urls = getSocialTrackingUrls(platform);

  const handleCopyUrl = async (url: string, campaign: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(campaign);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Error al copiar URL:', error);
    }
  };

  const generateCustomUrl = (campaign: string, additionalParams?: Record<string, string>) => {
    return generateSocialTrackingUrl(platform, campaign, additionalParams);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          URLs de Tracking - {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </h3>
        
        <div className="space-y-4">
          {Object.entries(urls).map(([campaign, url]) => (
            <div key={campaign} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 capitalize">
                  {campaign.replace(/_/g, ' ')}
                </h4>
                {showCopyButtons && (
                  <button
                    onClick={() => handleCopyUrl(url, campaign)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      copiedUrl === campaign
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {copiedUrl === campaign ? 'Copiado!' : 'Copiar'}
                  </button>
                )}
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <code className="text-sm text-gray-700 break-all">{url}</code>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">Campaña:</span> {campaign}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* URLs personalizadas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          URLs Personalizadas
        </h3>
        
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">URL con parámetros adicionales</h4>
            <div className="bg-gray-50 rounded p-3">
              <code className="text-sm text-gray-700 break-all">
                {generateCustomUrl('curso_ia', { 
                  utm_content: 'post_123', 
                  utm_term: 'inteligencia_artificial' 
                })}
              </code>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Parámetros:</span> utm_content, utm_term
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 