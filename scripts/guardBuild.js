#!/usr/bin/env node
/**
 * Runs before `pnpm build`. Refuses to build while something is listening on
 * port 3000, because a running `next start` or `next dev` shares `.next` with
 * the build and silently corrupts it: some routes then return a bare 500 with
 * nothing in the server log.
 *
 * Skipped on Vercel, where no local server exists.
 */

const net = require('net')

if (process.env.VERCEL) process.exit(0)

const probe = net.createServer()
probe.once('error', (err) => {
  if (err.code !== 'EADDRINUSE') throw err
  console.error('\nA server is running on port 3000. Building now would corrupt .next.')
  console.error('Stop it first:  pnpm kill-port\n')
  process.exit(1)
})
probe.once('listening', () => probe.close())
probe.listen(3000)
