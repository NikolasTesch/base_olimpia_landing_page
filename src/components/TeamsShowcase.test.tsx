import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import TeamsShowcase from './TeamsShowcase';

test('renders the centered athlete and separated neighbors before hydration', () => {
  const html = renderToStaticMarkup(
    <TeamsShowcase
      teams={[{ id: 'base', name: 'BASE', category: null }]}
      athletes={['Alex', 'Camila', 'Gabriel'].map((name) => ({
        id: name,
        teamId: 'base',
        name,
        position: null,
        photoSrc: null,
        cutoutSrc: '/' + name + '-cutout.webp',
      }))}
    />,
  );

  expect(html).toContain('athlete-track is-coverflow-track');
  expect(html).toMatch(/id="atleta-Alex"[^>]+is-active-center[^>]+z-index:10/);
  expect(html).toContain('translateX(66%)');
  expect(html).toContain('translateX(-66%)');
  expect(html).toMatch(/Alex-cutout\.webp"[^>]+loading="eager"/);
});
