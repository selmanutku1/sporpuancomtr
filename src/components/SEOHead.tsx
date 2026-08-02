import React, { useEffect } from 'react';
import { SportsEvent } from '../types';
import { getEventDetailUrl } from '../lib/categoryUtils';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'business';
  event?: SportsEvent | null;
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  canonicalUrl,
  type = 'website',
  event
}) => {
  useEffect(() => {
    // 1. Determine Title & Meta Values
    let metaTitle = "SporPuan - Türkiye'nin Bağımsız Spor Tesisleri, Salonları ve Etkinlikleri Puanlama Platformu";
    let metaDescription = "Türkiye'nin en kapsamlı bağımsız spor tesisi, spor salonu, spor okulu ve organizasyon puanlama ve inceleme platformu. 5 farklı boyutta objektif analizler ve tarafsız yorumlar.";
    let metaKeywords = "spor puan, spor salonu yorumları, spor tesisleri, macfit puanı, spor okulları, halı saha puanlama, maraton takvimi, boks salonları, pilates stüdyoları";
    let metaImage = image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop";
    let currentCanonical = canonicalUrl || window.location.origin + window.location.pathname;

    if (event) {
      const catName = event.category || 'Spor Tesisi';
      const scoreStr = event.overallScore ? Number(event.overallScore).toFixed(1) : '8.8';
      const cityStr = event.city ? `${event.city}` : 'Türkiye';
      const reviewCountStr = event.reviewCount || (event.reviews ? event.reviews.length : 0);

      metaTitle = `⭐ ${event.title} Puanı & Yorumları (${scoreStr}/10) | ${catName} - SporPuan`;
      metaDescription = `${event.title} (${cityStr}) için sporseverler tarafından verilen ${scoreStr}/10 puanı, ${reviewCountStr} gerçek kullanıcı yorumu, hijyen, ekipman, eğitmen kadrosu ve lokasyon detaylı kriter incelemesi.`;
      metaKeywords = `${event.title}, ${event.title} yorumları, ${event.title} puanı, ${cityStr} ${catName}, ${event.venue || ''}, spor salonu tavsiyesi, sporpuan`;
      
      if (event.image) {
        metaImage = event.image;
      }
      currentCanonical = window.location.origin + getEventDetailUrl(event);
    } else if (title) {
      metaTitle = `${title} | SporPuan`;
      if (description) {
        metaDescription = description;
      }
      if (keywords) {
        metaKeywords = keywords;
      }
    }

    // 2. Update Document Title
    document.title = metaTitle;

    // Helper function to update or create meta tag
    const updateMeta = (selector: string, attributeName: string, attributeValue: string, contentValue: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper to update link canonical
    const updateCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    };

    // Standard Meta Tags
    updateMeta('meta[name="title"]', 'name', 'title', metaTitle);
    updateMeta('meta[name="description"]', 'name', 'description', metaDescription);
    updateMeta('meta[name="keywords"]', 'name', 'keywords', metaKeywords);

    // OpenGraph
    updateMeta('meta[property="og:title"]', 'property', 'og:title', metaTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', metaDescription);
    updateMeta('meta[property="og:image"]', 'property', 'og:image', metaImage);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', currentCanonical);
    updateMeta('meta[property="og:type"]', 'property', 'og:type', type);
    updateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'SporPuan');

    // Twitter
    updateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', metaTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', metaDescription);
    updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', metaImage);

    // Canonical
    updateCanonical(currentCanonical);

    // 3. Structured Data (JSON-LD Schema.org)
    let jsonLdScript = document.getElementById('sporpuan-jsonld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'sporpuan-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    let schemaData: any = {};

    if (event) {
      let schemaType = 'SportsActivityLocation';
      if (event.category === 'Spor Okulları') schemaType = 'EducationalOrganization';
      else if (event.category === 'Spor Etkinlikleri') schemaType = 'SportsEvent';
      else if (event.category === 'Spor Salonları') schemaType = 'HealthClub';

      schemaData = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        'name': event.title,
        'description': event.description || `${event.title} detaylı puanlaması ve incelemesi.`,
        'image': metaImage,
        'url': currentCanonical,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': event.city || 'İstanbul',
          'streetAddress': event.venue || event.title
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': event.overallScore ? Number(event.overallScore).toFixed(1) : '8.8',
          'bestRating': '10',
          'worstRating': '1',
          'ratingCount': event.reviewCount || (event.reviews ? event.reviews.length : 1)
        }
      };
    } else {
      schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://sporpuan.com/#website',
            'url': window.location.origin,
            'name': 'SporPuan',
            'description': metaDescription,
            'publisher': {
              '@id': 'https://sporpuan.com/#organization'
            },
            'potentialAction': {
              '@type': 'SearchAction',
              'target': `${window.location.origin}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'Organization',
            '@id': 'https://sporpuan.com/#organization',
            'name': 'SporPuan',
            'url': window.location.origin,
            'logo': {
              '@type': 'ImageObject',
              'url': `${window.location.origin}/sporpuan-logo.svg`
            },
            'sameAs': [
              'https://instagram.com/sporpuan',
              'https://twitter.com/sporpuan'
            ]
          }
        ]
      };
    }

    jsonLdScript.textContent = JSON.stringify(schemaData);

  }, [title, description, keywords, image, canonicalUrl, type, event]);

  return null;
};
