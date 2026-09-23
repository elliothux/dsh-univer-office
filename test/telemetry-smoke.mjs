import { existsSync, readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const host = readFileSync(new URL('../lib/index.js', import.meta.url), 'utf8')

if (manifest.scripts.uninstall || manifest.files.some((file) => file.includes('telemetry'))) {
  throw new Error('package must not ship a telemetry lifecycle entry')
}
if (existsSync(new URL('../lib/telemetry-entry.js', import.meta.url))) {
  throw new Error('build must not emit a telemetry entry')
}
const buildInfo = JSON.parse(
  readFileSync(new URL('../lib/build-info.json', import.meta.url), 'utf8')
)
if ('telemetryEndpoint' in buildInfo) throw new Error('build must not emit a telemetry endpoint')
if (host.includes('https://univer.ai/api/telemetry/cli')) {
  throw new Error('host bundle must not include the product telemetry endpoint')
}

console.log('telemetry disabled smoke passed')
