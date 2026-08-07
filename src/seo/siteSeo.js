export const siteConfig = {
  siteName: '2026今周刊第十屆新能源國際論壇',
  title: '2026今周刊第十屆新能源國際論壇｜算力爆發大挑戰・台灣能源轉型新思維',
  description:
    '2026今周刊第十屆新能源國際論壇，以「算力爆發大挑戰，台灣能源轉型新思維」為主題，聚焦AI用電、電力韌性、再生能源、核能、儲能、氫能、地熱與能源政策，邀集政府、企業及國際專家共同探討台灣能源轉型與永續發展的新方向。',
  keywords: [
    '新能源論壇',
    '能源論壇',
    '國際論壇',
    '能源轉型',
    'AI用電',
    'AI電力',
    '算力',
    '電力需求',
    '台灣能源',
    '能源政策',
    '再生能源',
    '綠能',
    '核能',
    '小型模組化反應爐',
    'SMR',
    '核融合',
    '地熱',
    '氫能',
    '儲能',
    '電網韌性',
    '永續',
    'ESG',
    '淨零排放',
    'Net Zero',
    '今周刊'
  ],
  language: 'zh-Hant-TW',
  locale: 'zh_TW',
  canonicalUrl: 'https://events.businesstoday.com.tw/2026/NEWNERGYFOURM/',
  themeColor: '#0f7f83',
  ogImageName: 'fb-share.jpg',
  ogImageAlt: '2026今周刊第十屆新能源國際論壇活動主視覺',
  organizationName: '今周刊 Business Today',
  organizationUrl: 'https://www.businesstoday.com.tw/',
  organizationLogo: 'https://events.businesstoday.com.tw/2026/NEWNERGYFOURM/favicon.png',
  offerValidFrom: '2026-08-07T00:00:00+08:00',
  sameAs: [
    'https://www.businesstoday.com.tw/',
    'https://esg.businesstoday.com.tw/',
    'https://esgschool.businesstoday.com.tw/'
  ]
}

function getContentArray(infoData) {
  return Array.isArray(infoData?.content) ? infoData.content : []
}

function getContentBy(infoData, matcher) {
  return getContentArray(infoData).find(matcher) ?? {}
}

function padNumber(value) {
  return String(value).padStart(2, '0')
}

function toIsoDate(dateParts, timeText) {
  if (!dateParts || !timeText) {
    return undefined
  }

  return `${dateParts.year}-${padNumber(dateParts.month)}-${padNumber(dateParts.day)}T${timeText}:00+08:00`
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function stripHtml(value = '') {
  return String(value)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseEventSchedule(signUpContent = {}) {
  const eventInfo = Array.isArray(signUpContent.event_info) ? signUpContent.event_info : []
  const dateItem = eventInfo.find((item) => item.label === '活動時間') ?? {}
  const dateText = stripHtml(dateItem.title)
  const timeText = stripHtml(dateItem.detail)

  const dateMatch = dateText.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/)
  const timeMatch = timeText.match(/(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/)
  const dateParts = dateMatch
    ? { year: dateMatch[1], month: dateMatch[2], day: dateMatch[3] }
    : { year: '2026', month: '4', day: '29' }

  return {
    dateText,
    timeText,
    startDate: toIsoDate(dateParts, timeMatch?.[1] ?? '09:30'),
    endDate: toIsoDate(dateParts, timeMatch?.[2] ?? '16:50')
  }
}

function getTrafficVenue(infoData) {
  const trafficContent = getContentBy(infoData, (item) => item.cmsType === 'traffic' || item.titleEn === 'traffic')
  return trafficContent?.trafficInfo?.info?.[0] ?? {}
}

function getAgendaTopics(infoData) {
  const agendaContent = getContentBy(infoData, (item) => item.cmsType === 'agenda' || Array.isArray(item.agendaInfo))
  return (agendaContent?.agendaInfo ?? [])
    .map((item) => stripHtml(item?.topic))
    .filter((topic) => topic && topic !== '演講主題')
}

function normalizeSpeakers(speakers) {
  const speakerList = Array.isArray(speakers?.data) ? speakers.data : Array.isArray(speakers) ? speakers : []

  return speakerList
    .map((speaker) => ({
      '@type': 'Person',
      name: stripHtml(speaker?.name),
      jobTitle: stripHtml(speaker?.title)
    }))
    .filter((speaker) => speaker.name)
}

export function createSeoPayload({ infoData, speakers }) {
  const signUpContent = getContentBy(infoData, (item) => item.cmsType === 'signUp' || item.titleEn === 'sign up')
  const trafficVenue = getTrafficVenue(infoData)
  const agendaTopics = getAgendaTopics(infoData)
  const schedule = parseEventSchedule(signUpContent)
  const speakerEntities = normalizeSpeakers(speakers)
  const ogImageUrl = new URL(siteConfig.ogImageName, siteConfig.canonicalUrl).toString()
  const organizationId = `${siteConfig.canonicalUrl}#organization`
  const websiteId = `${siteConfig.canonicalUrl}#website`
  const webpageId = `${siteConfig.canonicalUrl}#webpage`
  const eventId = `${siteConfig.canonicalUrl}#event`
  const locationName = [trafficVenue.title, trafficVenue.subTitle].filter(Boolean).join(' ')
  const locationAddress = stripHtml(trafficVenue.location)

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    canonicalUrl: siteConfig.canonicalUrl,
    ogImageUrl,
    ogImageAlt: siteConfig.ogImageAlt,
    siteName: siteConfig.siteName,
    locale: siteConfig.locale,
    language: siteConfig.language,
    themeColor: siteConfig.themeColor,
    author: siteConfig.organizationName,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': organizationId,
        name: siteConfig.organizationName,
        url: siteConfig.organizationUrl,
        logo: {
          '@type': 'ImageObject',
          url: siteConfig.organizationLogo
        },
        sameAs: siteConfig.sameAs
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteConfig.canonicalUrl,
        name: siteConfig.siteName,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        publisher: {
          '@id': organizationId
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': webpageId,
        url: siteConfig.canonicalUrl,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        isPartOf: {
          '@id': websiteId
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: ogImageUrl
        },
        about: agendaTopics,
        mainEntity: {
          '@id': eventId
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Event',
        '@id': eventId,
        name: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.canonicalUrl,
        image: [ogImageUrl],
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        inLanguage: siteConfig.language,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        about: agendaTopics,
        location: {
          '@type': 'Place',
          name: locationName || '陽明交通大學 國際會議廳',
          sameAs: trafficVenue.locationUrl?.url,
          address: {
            '@type': 'PostalAddress',
            streetAddress: locationAddress,
            addressLocality: '新竹市',
            addressCountry: 'TW'
          }
        },
        organizer: {
          '@id': organizationId
        },
        performer: speakerEntities,
        offers: {
          '@type': 'Offer',
          url: `${siteConfig.canonicalUrl}#signUp`,
          price: '0',
          priceCurrency: 'TWD',
          availability: 'https://schema.org/InStock',
          validFrom: siteConfig.offerValidFrom
        }
      },
      speakerEntities.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${siteConfig.canonicalUrl}#speakers`,
            name: '2026今周刊第十屆新能源國際論壇講者陣容',
            itemListElement: speakerEntities.map((speaker, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: speaker
            }))
          }
        : null
    ].filter(Boolean)
  }
}

export function buildIndexHtmlSeoTags(seoPayload) {
  const metaTags = [
    { tag: 'title', children: seoPayload.title },
    { tag: 'meta', attrs: { name: 'description', content: seoPayload.description } },
    { tag: 'meta', attrs: { name: 'keywords', content: seoPayload.keywords.join(', ') } },
    {
      tag: 'meta',
      attrs: {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      }
    },
    { tag: 'meta', attrs: { name: 'author', content: seoPayload.author } },
    { tag: 'meta', attrs: { name: 'theme-color', content: seoPayload.themeColor } },
    { tag: 'meta', attrs: { property: 'og:locale', content: seoPayload.locale } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: seoPayload.siteName } },
    { tag: 'meta', attrs: { property: 'og:title', content: seoPayload.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: seoPayload.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: seoPayload.canonicalUrl } },
    { tag: 'meta', attrs: { property: 'og:image', content: seoPayload.ogImageUrl } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: seoPayload.ogImageAlt } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: seoPayload.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: seoPayload.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: seoPayload.ogImageUrl } },
    { tag: 'link', attrs: { rel: 'canonical', href: seoPayload.canonicalUrl } },
    {
      tag: 'link',
      attrs: { rel: 'alternate', hreflang: 'zh-TW', href: seoPayload.canonicalUrl }
    },
    {
      tag: 'link',
      attrs: { rel: 'alternate', hreflang: 'x-default', href: seoPayload.canonicalUrl }
    }
  ].map((tag) => ({
    ...tag,
    injectTo: 'head'
  }))

  const structuredDataTags = seoPayload.structuredData.map((item, index) => ({
    tag: 'script',
    attrs: {
      type: 'application/ld+json',
      'data-seo-json-ld': `static-${index}`
    },
    children: JSON.stringify(item),
    injectTo: 'head'
  }))

  return [...metaTags, ...structuredDataTags]
}

export function createSitemapXml({ canonicalUrl, lastmod }) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${escapeXml(canonicalUrl)}</loc>`
  ]

  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`)
  }

  lines.push('    <changefreq>weekly</changefreq>')
  lines.push('    <priority>1.0</priority>')
  lines.push('  </url>')
  lines.push('</urlset>')

  return `${lines.join('\n')}\n`
}

export function createRobotsTxt({ canonicalUrl }) {
  const sitemapUrl = new URL('sitemap.xml', canonicalUrl).toString()

  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
}
