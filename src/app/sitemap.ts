import { MetadataRoute } from 'next'
import { DATA } from '@/data/resume'

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = DATA.work
    .filter((w): w is typeof w & { caseStudy: { enabled: boolean; slug: string } } => 
      'caseStudy' in w && !!w.caseStudy?.enabled
    )
    .map((w) => ({
      url: `${DATA.url}/work/${w.caseStudy.slug}`,
      lastModified: new Date(),
    }))

  return [
    { url: DATA.url, lastModified: new Date() },
    ...caseStudies,
  ]
}

