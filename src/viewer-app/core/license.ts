import { TEST_LICENSE, type ViewLicenseConfig } from '@univer/render-preset'

let viewerLicense: Promise<ViewLicenseConfig> | undefined

/** Resolve the host-provided production license once, falling back to the bundled dev license. */
export function loadViewerLicense(): Promise<ViewLicenseConfig> {
  viewerLicense ??= fetch('/univer-viewer/license', { credentials: 'same-origin' }).then(
    async (response) => {
      if (response.status === 204 || response.status === 404) return { license: TEST_LICENSE }
      if (!response.ok) {
        throw new Error(`Failed to load the Univer license (${String(response.status)}).`)
      }
      const value: unknown = await response.json()
      if (!isViewLicenseConfig(value)) {
        throw new Error('The Univer license response is invalid.')
      }
      return value
    }
  )
  return viewerLicense
}

function isViewLicenseConfig(value: unknown): value is ViewLicenseConfig {
  if (value === null || typeof value !== 'object') return false
  const candidate = value as { license?: unknown; pbk?: unknown }
  return (
    typeof candidate.license === 'string' &&
    candidate.license.length > 0 &&
    typeof candidate.pbk === 'string' &&
    candidate.pbk.length > 0
  )
}
