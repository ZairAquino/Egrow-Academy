#!/usr/bin/env tsx

import { generateSocialTrackingUrl, SOCIAL_TRACKING_URLS } from '../src/lib/social-tracking';

interface CustomCampaign {
  name: string;
  platform: 'instagram' | 'tiktok' | 'linkedin';
  baseUrl: string;
  additionalParams?: Record<string, string>;
}

// Campañas personalizadas adicionales
const customCampaigns: CustomCampaign[] = [
  {
    name: 'curso_ia_especial',
    platform: 'instagram',
    baseUrl: '/courses',
    additionalParams: {
      utm_content: 'curso_ia_especial',
      utm_term: 'inteligencia_artificial',
      utm_campaign: 'curso_ia_especial'
    }
  },
  {
    name: 'recursos_gratuitos_especial',
    platform: 'instagram',
    baseUrl: '/resources',
    additionalParams: {
      utm_content: 'recursos_gratuitos_especial',
      utm_term: 'recursos_gratuitos',
      utm_campaign: 'recursos_gratuitos_especial'
    }
  },
  {
    name: 'comunidad_especial',
    platform: 'instagram',
    baseUrl: '/community',
    additionalParams: {
      utm_content: 'comunidad_especial',
      utm_term: 'comunidad',
      utm_campaign: 'comunidad_especial'
    }
  },
  {
    name: 'curso_monetiza_especial',
    platform: 'instagram',
    baseUrl: '/curso/monetiza-ia',
    additionalParams: {
      utm_content: 'curso_monetiza_especial',
      utm_term: 'monetizar_ia',
      utm_campaign: 'curso_monetiza_especial'
    }
  },
  {
    name: 'curso_asistentes_especial',
    platform: 'instagram',
    baseUrl: '/curso/asistentes-virtuales-ia',
    additionalParams: {
      utm_content: 'curso_asistentes_especial',
      utm_term: 'asistentes_virtuales',
      utm_campaign: 'curso_asistentes_especial'
    }
  }
];

function generateCustomUrls() {
  console.log('🔗 Generando URLs de tracking personalizadas...\n');

  // URLs estándar
  console.log('📱 URLs Estándar:');
  Object.entries(SOCIAL_TRACKING_URLS).forEach(([platform, config]) => {
    console.log(`\n${platform.toUpperCase()}:`);
    Object.entries(config.campaigns).forEach(([campaign, url]) => {
      console.log(`  ${campaign}: ${config.base}${url}`);
    });
  });

  // URLs personalizadas
  console.log('\n🎯 URLs Personalizadas:');
  customCampaigns.forEach(campaign => {
    const url = generateSocialTrackingUrl(
      campaign.platform,
      campaign.name,
      campaign.additionalParams
    );
    console.log(`\n${campaign.name}:`);
    console.log(`  Plataforma: ${campaign.platform}`);
    console.log(`  URL: ${url}`);
    if (campaign.additionalParams) {
      console.log(`  Parámetros adicionales:`, campaign.additionalParams);
    }
  });

  // Generar URLs con parámetros dinámicos
  console.log('\n🔄 URLs con Parámetros Dinámicos:');
  
  const dynamicParams = [
    { utm_content: 'post_123', utm_term: 'ia_basico' },
    { utm_content: 'story_456', utm_term: 'ia_avanzado' },
    { utm_content: 'reel_789', utm_term: 'monetizacion' },
    { utm_content: 'carousel_101', utm_term: 'asistentes' }
  ];

  dynamicParams.forEach((params, index) => {
    const url = generateSocialTrackingUrl('instagram', 'curso_ia', params);
    console.log(`\nEjemplo ${index + 1}:`);
    console.log(`  Parámetros: ${JSON.stringify(params)}`);
    console.log(`  URL: ${url}`);
  });

  console.log('\n✅ URLs generadas exitosamente');
}

function generateUrlForPost(postId: string, platform: 'instagram' | 'tiktok' | 'linkedin', campaign: string) {
  const url = generateSocialTrackingUrl(platform, campaign, {
    utm_content: `post_${postId}`,
    utm_term: campaign
  });
  
  console.log(`\n📱 URL para post ${postId} en ${platform}:`);
  console.log(`  ${url}`);
  
  return url;
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    generateCustomUrls();
  } else if (args[0] === 'post' && args.length >= 4) {
    const [_, postId, platform, campaign] = args;
    generateUrlForPost(postId, platform as any, campaign);
  } else {
    console.log('Uso:');
    console.log('  npm run generate-social-urls                    # Generar todas las URLs');
    console.log('  npm run generate-social-urls post 123 instagram curso_ia  # URL para post específico');
  }
}

if (require.main === module) {
  main();
} 