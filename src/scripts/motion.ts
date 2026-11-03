import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// HTML stays visible until an animation actually starts.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const activeTweens = new Map<HTMLElement, gsap.core.Animation>();
const revealed = new WeakSet<HTMLElement>();

let lenis: Lenis | null = null;
let lenisTickerFn: ((time: number) => void) | null = null;

function destroySmoothScroll() {
  if (lenisTickerFn) {
    gsap.ticker.remove(lenisTickerFn);
    lenisTickerFn = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  document.documentElement.removeAttribute('data-lenis-active');
}

function initSmoothScroll() {
  destroySmoothScroll();
  if (preference.matches) return;

  lenis = new Lenis({
    autoRaf: false,
    anchors: true,
    duration: 1.05,
    prevent: (node) =>
      node.classList?.contains('athlete-track') ||
      Boolean(node.closest?.('[data-lenis-prevent-horizontal]')),
  });

  lenis.on('scroll', ScrollTrigger.update);
  lenisTickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(lenisTickerFn);
  gsap.ticker.lagSmoothing(0);
  document.documentElement.setAttribute('data-lenis-active', 'true');
}

function trackReveal(element: HTMLElement, tween: gsap.core.Animation) {
  activeTweens.set(element, tween);
  tween.eventCallback('onComplete', () => {
    gsap.set(element, { clearProps: 'opacity,transform,clipPath' });
    activeTweens.delete(element);
  });
}

function clearAllAnimatedElements() {
  activeTweens.forEach((tween, element) => {
    tween.kill();
    gsap.set(element, { clearProps: 'all' });
  });
  activeTweens.clear();
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.id?.startsWith('motion-')) {
      trigger.kill();
    }
  });
}

function initializeMotion() {
  clearAllAnimatedElements();
  destroySmoothScroll();

  if (preference.matches || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  initSmoothScroll();

  const mobile = matchMedia('(max-width: 48rem)').matches;
  const shiftX = mobile ? 14 : 36;

  // Scroll-drawn Timeline Progress Line in #historia
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  const timelineProgress = document.querySelector<HTMLElement>('[data-timeline-progress]');
  if (timeline && timelineProgress) {
    ScrollTrigger.create({
      id: 'motion-timeline-progress',
      trigger: timeline,
      start: 'top 78%',
      end: 'bottom 45%',
      scrub: 0.35,
      animation: gsap.fromTo(
        timelineProgress,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none' }
      ),
    });
  }

  // Reveal elements across sections (excluding React/Motion island internals per propertyOwnershipRule)
  const revealSelectors = [
    '.section-heading',
    '.intro-grid > .lead',
    '.principles > article',
    '.timeline > article',
    '.history-grid > .media-frame',
    '.impact',
    '.grid > article',
    '.match-row',
    '.event-row',
    '.instagram-card',
    '.partner-slots > div',
    '.support-callout',
  ].join(',');

  document.querySelectorAll<HTMLElement>(revealSelectors).forEach((element, idx) => {
    if (revealed.has(element) || element.closest('[data-motion-island]')) return;

    ScrollTrigger.create({
      id: `motion-reveal-${idx}`,
      trigger: element,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        if (revealed.has(element) || preference.matches) return;
        revealed.add(element);
        if (element.contains(document.activeElement)) return;

        const siblings = element.parentElement ? [...element.parentElement.children] : [];
        const delay = ((Math.max(0, siblings.indexOf(element)) % 4) * 75) / 1000;
        const heading = element.classList.contains('section-heading');
        const isTimelineItem = element.hasAttribute('data-timeline-item');

        if (isTimelineItem) {
          element.classList.add('is-revealed');
        }

        const tween = gsap.fromTo(
          element,
          {
            opacity: 0,
            x: shiftX,
            ...(heading ? { clipPath: 'inset(0 100% 0 0)' } : {}),
          },
          {
            opacity: 1,
            x: 0,
            ...(heading ? { clipPath: 'inset(0 0% 0 0)' } : {}),
            duration: heading ? 0.65 : 0.6,
            delay,
            ease: 'power3.out',
          }
        );
        trackReveal(element, tween);
      },
    });
  });
}

// Keyboard navigation must never wait for a decorative reveal to finish.
document.addEventListener('focusin', (event) => {
  activeTweens.forEach((tween, element) => {
    if (event.target instanceof Node && element.contains(event.target)) {
      tween.progress(1).kill();
      gsap.set(element, { clearProps: 'opacity,transform,clipPath' });
      activeTweens.delete(element);
    }
  });
});

preference.addEventListener('change', initializeMotion);
initializeMotion();
