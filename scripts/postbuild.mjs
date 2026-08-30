/* Static hosts need to be told that /lesson/l3-2 is the app, not a missing
   file. `public/_redirects` covers Netlify; this copy covers GitHub Pages,
   which serves 404.html for any unknown path. Both are inert elsewhere. */
import { copyFileSync, existsSync } from 'node:fs'

const from = 'dist/index.html'
const to = 'dist/404.html'
if (existsSync(from)) {
  copyFileSync(from, to)
  console.log('postbuild: wrote dist/404.html for history-fallback hosting')
}
