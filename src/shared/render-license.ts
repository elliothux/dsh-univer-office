const RENDER_LICENSE_PREFIX = 'dsh-univer-license-v1:'

export interface RenderLicenseConfig {
  readonly license: string
  readonly pbk?: string
}

/** Carry the optional product public key through the SDK's string-only render-page bootstrap. */
export function encodeRenderLicense(config: RenderLicenseConfig): string {
  return `${RENDER_LICENSE_PREFIX}${JSON.stringify(config)}`
}

/** Decode our render-page extension while accepting the SDK's ordinary license string. */
export function decodeRenderLicense(value: string): RenderLicenseConfig {
  if (!value.startsWith(RENDER_LICENSE_PREFIX)) return { license: value }
  const decoded: unknown = JSON.parse(value.slice(RENDER_LICENSE_PREFIX.length))
  if (decoded === null || typeof decoded !== 'object') throw invalidRenderLicense()
  const candidate = decoded as { license?: unknown; pbk?: unknown }
  if (
    typeof candidate.license !== 'string' ||
    candidate.license.length === 0 ||
    typeof candidate.pbk !== 'string' ||
    candidate.pbk.length === 0
  ) {
    throw invalidRenderLicense()
  }
  return { license: candidate.license, pbk: candidate.pbk }
}

function invalidRenderLicense(): Error {
  return new Error('The render license bootstrap is invalid.')
}
