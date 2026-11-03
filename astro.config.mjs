import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function donoPersistencePlugin() {
  return {
    name: 'base-dono-persistence',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__dono_api/')) return next();

        const readJsonBody = () =>
          new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
              if (body.length > 25 * 1024 * 1024) {
                reject(new Error('Payload too large'));
              }
            });
            req.on('end', () => {
              try {
                resolve(JSON.parse(body || '{}'));
              } catch (err) {
                reject(err);
              }
            });
            req.on('error', reject);
          });

        if (req.method === 'POST' && req.url === '/__dono_api/save') {
          try {
            const payload = await readJsonBody();
            const siteJsonPath = path.resolve(process.cwd(), 'src/data/site.json');
            const currentRaw = await fs.readFile(siteJsonPath, 'utf-8');
            const siteData = JSON.parse(currentRaw);

            if (Array.isArray(payload.teams) && Array.isArray(payload.athletes)) {
              siteData.sections.equipes.teams = payload.teams.map((t) => ({
                id: String(t.id),
                name: String(t.name),
                category: t.category ? String(t.category) : null,
                status: t.status ?? 'illustrative',
              }));
              siteData.sections.equipes.athletes = payload.athletes.map((a) => ({
                id: String(a.id),
                teamId: String(a.teamId),
                name: String(a.name),
                position: a.position ? String(a.position) : null,
                photoSrc: a.photoSrc ? String(a.photoSrc) : null,
                ...(a.cutoutSrc !== undefined ? { cutoutSrc: a.cutoutSrc } : {}),
                ...(typeof a.photoScale === 'number' ? { photoScale: a.photoScale } : {}),
                ...(typeof a.photoOffsetX === 'number' ? { photoOffsetX: a.photoOffsetX } : {}),
                ...(typeof a.photoOffsetY === 'number' ? { photoOffsetY: a.photoOffsetY } : {}),
                status: a.status ?? 'illustrative',
              }));
            }

            if (Array.isArray(payload.posts)) {
              siteData.sections.instagram.previews = payload.posts.map((p) => ({
                id: String(p.id),
                account: String(p.account || '@baseolimpiavolei'),
                title: String(p.title),
                excerpt: String(p.excerpt),
                imageSrc: String(p.imageSrc),
                permalink: String(p.permalink || 'https://www.instagram.com/baseolimpiavolei/'),
                publishedAt: p.publishedAt ? String(p.publishedAt) : null,
                selected: p.selected !== false,
                status: p.status ?? 'confirmed',
              }));
            }

            if (Array.isArray(payload.teams) || Array.isArray(payload.posts)) {
              await fs.writeFile(siteJsonPath, JSON.stringify(siteData, null, 2) + '\n', 'utf-8');
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
          return;
        }

        if (req.method === 'POST' && req.url === '/__dono_api/upload') {
          try {
            const payload = await readJsonBody();
            const rawDataUrl = String(payload.dataUrl || '');
            const removeBg = Boolean(payload.removeBg);
            const rawSlug = String(payload.slug || 'atleta-custom')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9-]+/g, '-')
              .replace(/(^-|-$)/g, '');

            const match = /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/.exec(rawDataUrl);
            if (!match) {
              res.statusCode = 400;
              res.end(JSON.stringify({ ok: false, error: 'Invalid image dataUrl' }));
              return;
            }

            const buffer = Buffer.from(match[2], 'base64');
            const athletesDir = path.resolve(process.cwd(), 'public/images/athletes');
            await fs.mkdir(athletesDir, { recursive: true });

            const stamp = Date.now().toString(36);
            const baseName = `${rawSlug || 'atleta'}-${stamp}`;
            const origFileName = `${baseName}.webp`;
            const cutoutFileName = `${baseName}-cutout.webp`;
            const origPath = path.join(athletesDir, origFileName);
            const cutoutPath = path.join(athletesDir, cutoutFileName);

            await fs.writeFile(origPath, buffer);

            let cutoutSrc = `/images/athletes/${origFileName}`;
            if (removeBg) {
              try {
                const pyCode = [
                  'import sys, numpy as np',
                  'from PIL import Image',
                  'from rembg import remove, new_session',
                  'inp, outp = sys.argv[1], sys.argv[2]',
                  'img = Image.open(inp).convert("RGBA")',
                  'mh = np.array(remove(img, session=new_session("u2net_human_seg"), only_mask=True, post_process_mask=True))',
                  'mg = np.array(remove(img, session=new_session("u2net"), only_mask=True, post_process_mask=True))',
                  'rgba = np.array(img)',
                  'rgba[:, :, 3] = np.maximum(mh, mg)',
                  'res = Image.fromarray(rgba, "RGBA")',
                  'bbox = res.getbbox()',
                  'if bbox:',
                  '    l, t, r, b = bbox',
                  '    px, pt = max(0, int((r-l)*0.04)), max(0, int((b-t)*0.02))',
                  '    res = res.crop((max(0, l-px), max(0, t-pt), min(res.width, r+px), res.height))',
                  'res.save(outp, "WEBP", quality=92, method=6)',
                ].join('\n');

                await execFileAsync('uv', [
                  'run',
                  '--with',
                  'rembg[cpu]',
                  '--with',
                  'pillow',
                  '--with',
                  'onnxruntime',
                  'python',
                  '-c',
                  pyCode,
                  origPath,
                  cutoutPath,
                ]);
                cutoutSrc = `/images/athletes/${cutoutFileName}`;
              } catch {
                // If rembg isn't available, keep original image
                await fs.copyFile(origPath, cutoutPath);
                cutoutSrc = `/images/athletes/${cutoutFileName}`;
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: true,
                photoSrc: `/images/athletes/${origFileName}`,
                cutoutSrc,
              })
            );
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [donoPersistencePlugin()],
  },
});
