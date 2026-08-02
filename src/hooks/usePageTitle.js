import { useEffect } from 'react'
import { SITE } from '../config.js'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.nom}` : SITE.nom
  }, [title])
}
