import 'intersection-observer'
import { useIntersection } from 'react-use'

export function useInViewport(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit
) {
  const intersection = useIntersection(ref, options)
  const inViewport = intersection?.isIntersecting

  return inViewport
}
