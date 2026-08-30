/* Bundles the test entry with esbuild (already present for Vite) and runs it.
   Node's strip-only TypeScript mode cannot handle parameter properties, which
   the interpreter uses, so a real transform is needed. */
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const result = await build({
  entryPoints: ['scripts/test-arduino.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  write: false,
  logLevel: 'error',
  alias: { '@': new URL('../src', import.meta.url).pathname },
})

const dir = mkdtempSync(join(tmpdir(), 'bench-test-'))
const file = join(dir, 'test.mjs')
writeFileSync(file, result.outputFiles[0].text)
await import(pathToFileURL(file).href)
