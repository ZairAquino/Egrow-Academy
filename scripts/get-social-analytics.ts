#!/usr/bin/env tsx

/**
 * Script para obtener métricas de redes sociales desde Google Analytics 4
 * 
 * Uso:
 * npm run get-social-analytics
 * 
 * Requisitos:
 * - Configurar GOOGLE_APPLICATION_CREDENTIALS en .env
 * - Tener acceso a la propiedad de GA4
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';

dotenv.config();

interface SocialMetrics {
  platform: string;
  clicks: number;
  impressions: number;
  conversions: number;
  conversionRate: number;
  sessions: number;
  users: number;
  bounceRate: number;
  avgSessionDuration: number;
}

class SocialAnalyticsCollector {
  private analyticsDataClient: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    this.analyticsDataClient = new BetaAnalyticsDataClient();
    this.propertyId = process.env.GA4_PROPERTY_ID || '';
    
    if (!this.propertyId) {
      throw new Error('GA4_PROPERTY_ID no está configurado en .env');
    }
  }

  /**
   * Obtener métricas básicas de redes sociales
   */
  async getSocialMediaMetrics(dateRange: string = '30daysAgo'): Promise<SocialMetrics[]> {
    try {
      console.log('📊 Obteniendo métricas de redes sociales...');

      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: dateRange, endDate: 'today' }],
        dimensions: [
          { name: 'utm_source' },
          { name: 'utm_campaign' }
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'users' },
          { name: 'eventCount' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'utm_medium',
            stringFilter: {
              matchType: 'EXACT',
              value: 'social'
            }
          }
        },
        orderBys: [
          {
            dimension: { dimensionName: 'sessions' },
            desc: true
          }
        ]
      });

      const platformMetrics = new Map<string, SocialMetrics>();

      if (response.rows) {
        for (const row of response.rows) {
          const utmSource = row.dimensionValues?.[0]?.value || '';
          const utmCampaign = row.dimensionValues?.[1]?.value || '';
          const sessions = parseInt(row.metricValues?.[0]?.value || '0');
          const users = parseInt(row.metricValues?.[1]?.value || '0');
          const eventCount = parseInt(row.metricValues?.[2]?.value || '0');
          const bounceRate = parseFloat(row.metricValues?.[3]?.value || '0');
          const avgSessionDuration = parseFloat(row.metricValues?.[4]?.value || '0');

          if (utmSource && ['instagram', 'tiktok', 'linkedin'].includes(utmSource)) {
            const existing = platformMetrics.get(utmSource);
            
            if (existing) {
              existing.sessions += sessions;
              existing.users += users;
              existing.impressions += eventCount;
              // Promedio ponderado para tasas
              existing.bounceRate = (existing.bounceRate + bounceRate) / 2;
              existing.avgSessionDuration = (existing.avgSessionDuration + avgSessionDuration) / 2;
            } else {
              platformMetrics.set(utmSource, {
                platform: utmSource,
                clicks: 0, // Se calcula por separado
                impressions: eventCount,
                conversions: 0, // Se calcula por separado
                conversionRate: 0,
                sessions,
                users,
                bounceRate,
                avgSessionDuration
              });
            }
          }
        }
      }

      // Obtener conversiones por plataforma
      await this.addConversionMetrics(platformMetrics, dateRange);

      // Calcular tasas de conversión
      for (const metrics of platformMetrics.values()) {
        metrics.conversionRate = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;
      }

      return Array.from(platformMetrics.values());
    } catch (error) {
      console.error('❌ Error obteniendo métricas de redes sociales:', error);
      throw error;
    }
  }

  /**
   * Obtener métricas de conversión por plataforma
   */
  private async addConversionMetrics(
    platformMetrics: Map<string, SocialMetrics>, 
    dateRange: string
  ): Promise<void> {
    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: dateRange, endDate: 'today' }],
        dimensions: [
          { name: 'utm_source' },
          { name: 'eventName' }
        ],
        metrics: [
          { name: 'eventCount' }
        ],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: 'utm_medium',
                  stringFilter: {
                    matchType: 'EXACT',
                    value: 'social'
                  }
                }
              },
              {
                filter: {
                  fieldName: 'eventName',
                  inListFilter: {
                    values: ['social_click', 'social_conversion', 'form_submit', 'purchase']
                  }
                }
              }
            ]
          }
        }
      });

      if (response.rows) {
        for (const row of response.rows) {
          const utmSource = row.dimensionValues?.[0]?.value || '';
          const eventName = row.dimensionValues?.[1]?.value || '';
          const eventCount = parseInt(row.metricValues?.[0]?.value || '0');

          const metrics = platformMetrics.get(utmSource);
          if (metrics) {
            if (eventName === 'social_click') {
              metrics.clicks += eventCount;
            } else if (['social_conversion', 'form_submit', 'purchase'].includes(eventName)) {
              metrics.conversions += eventCount;
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error obteniendo métricas de conversión:', error);
    }
  }

  /**
   * Obtener métricas por campaña específica
   */
  async getCampaignMetrics(campaign: string, dateRange: string = '30daysAgo'): Promise<any> {
    try {
      console.log(`📊 Obteniendo métricas para campaña: ${campaign}`);

      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: dateRange, endDate: 'today' }],
        dimensions: [
          { name: 'utm_source' },
          { name: 'utm_campaign' }
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'users' },
          { name: 'eventCount' }
        ],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: 'utm_campaign',
                  stringFilter: {
                    matchType: 'EXACT',
                    value: campaign
                  }
                }
              },
              {
                filter: {
                  fieldName: 'utm_medium',
                  stringFilter: {
                    matchType: 'EXACT',
                    value: 'social'
                  }
                }
              }
            ]
          }
        }
      });

      return response;
    } catch (error) {
      console.error(`❌ Error obteniendo métricas para campaña ${campaign}:`, error);
      throw error;
    }
  }

  /**
   * Generar reporte completo
   */
  async generateFullReport(dateRange: string = '30daysAgo'): Promise<void> {
    try {
      console.log('🚀 Generando reporte completo de redes sociales...\n');

      // Métricas generales por plataforma
      const platformMetrics = await this.getSocialMediaMetrics(dateRange);
      
      console.log('📱 MÉTRICAS POR PLATAFORMA SOCIAL');
      console.log('=====================================');
      
      for (const metrics of platformMetrics) {
        console.log(`\n${metrics.platform.toUpperCase()}:`);
        console.log(`  👥 Usuarios: ${metrics.users.toLocaleString()}`);
        console.log(`  📊 Sesiones: ${metrics.sessions.toLocaleString()}`);
        console.log(`  👆 Clicks: ${metrics.clicks.toLocaleString()}`);
        console.log(`  🎯 Conversiones: ${metrics.conversions.toLocaleString()}`);
        console.log(`  💰 Tasa de Conversión: ${metrics.conversionRate.toFixed(1)}%`);
        console.log(`  📈 Impresiones: ${metrics.impressions.toLocaleString()}`);
        console.log(`  🔄 Tasa de Rebote: ${metrics.bounceRate.toFixed(1)}%`);
        console.log(`  ⏱️  Duración Promedio: ${(metrics.avgSessionDuration / 60).toFixed(1)} min`);
      }

      // Top campañas
      console.log('\n\n🏆 TOP CAMPAÑAS POR PLATAFORMA');
      console.log('=====================================');
      
      const campaigns = ['newsletter', 'curso_ia', 'recursos_gratuitos', 'comunidad'];
      
      for (const campaign of campaigns) {
        console.log(`\n📋 Campaña: ${campaign}`);
        const campaignData = await this.getCampaignMetrics(campaign, dateRange);
        
        if (campaignData.rows && campaignData.rows.length > 0) {
          for (const row of campaignData.rows) {
            const platform = row.dimensionValues?.[0]?.value || '';
            const sessions = parseInt(row.metricValues?.[0]?.value || '0');
            const users = parseInt(row.metricValues?.[1]?.value || '0');
            
            if (sessions > 0) {
              console.log(`  ${platform}: ${sessions} sesiones, ${users} usuarios`);
            }
          }
        } else {
          console.log('  Sin datos');
        }
      }

      console.log('\n✅ Reporte completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error generando reporte:', error);
    }
  }
}

// Función principal
async function main() {
  try {
    const collector = new SocialAnalyticsCollector();
    
    // Verificar argumentos de línea de comandos
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
      case 'platforms':
        const platformMetrics = await collector.getSocialMediaMetrics();
        console.log(JSON.stringify(platformMetrics, null, 2));
        break;
        
      case 'campaign':
        const campaign = args[1] || 'newsletter';
        const campaignMetrics = await collector.getCampaignMetrics(campaign);
        console.log(JSON.stringify(campaignMetrics, null, 2));
        break;
        
      case 'full':
      default:
        await collector.generateFullReport();
        break;
    }
    
  } catch (error) {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { SocialAnalyticsCollector };
