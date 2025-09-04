import { fetchAPI } from '@/utils/fetch-api'

interface PageProps {
  params: { slug: string; locale: string }
}
export default async function StrapiTemplatePage({ params }: PageProps) {
  const { slug, locale } = await params
  const res = await fetchAPI(`/templates/`, {
    'populate[blocks][on][sections.compare-section][populate][compare][populate]': '*',
    'populate[blocks][on][sections.video-section][populate][video][populate]': '*',
    'populate[blocks][on][sections.image-section][populate][image][populate]': '*',
    'filters[slug][$eq]': slug,
    locale,
  })
  return <pre>{JSON.stringify(res, null, 2)}</pre>
}
