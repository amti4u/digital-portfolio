// Adapted from React Bits ScrollStack, supplied by the project owner.
// Keeps the original pin/scale model; caches untransformed geometry to avoid
// scroll feedback and adds resize, reduced-motion and keyboard handling.
import React, { useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`}>{children}</div>
);

export default function ScrollStack({ children, itemDistance = 130, itemScale = 0.025,
  itemStackDistance = 18, baseScale = 0.90, stackPosition = 80 }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    const el = root.current;
    const cards = [...el.querySelectorAll('.scroll-stack-card')];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const small = matchMedia('(max-width: 760px), (max-height: 620px)');
    let lenis, frame, observer, tops = [], end = 0, active = false;
    const update = () => {
      if (!active) return;
      const y = window.scrollY;
      cards.forEach((card, i) => {
        const start = tops[i] - stackPosition - itemStackDistance * i;
        const progress = Math.min(1, Math.max(0, (y - start) / 250));
        const scale = 1 - progress * (1 - Math.min(1, baseScale + i * itemScale));
        const translate = Math.max(0, Math.min(y, end) - start);
        card.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
        // Cards have different heights. Once the next card is pinned, retain
        // only this card's top lip so its footer cannot protrude underneath it.
        const nextStart = tops[i + 1] - stackPosition - itemStackDistance * (i + 1);
        const covered = i < cards.length - 1 && y >= nextStart;
        const visibleHeight = (itemStackDistance + 2) / scale;
        card.style.clipPath = covered
          ? `inset(0 0 ${Math.max(0, card.offsetHeight - visibleHeight)}px 0)`
          : '';
      });
    };
    const measure = () => {
      if (!active) return;
      cards.forEach(c => c.style.transform = 'none');
      tops = cards.map(c => c.getBoundingClientRect().top + window.scrollY);
      end = tops.at(-1) - stackPosition - itemStackDistance * (cards.length - 1) + 180;
      update();
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      observer?.disconnect();
      cards.forEach(c => { c.style.transform = ''; c.style.marginBottom = ''; c.style.clipPath = ''; });
    };
    const setup = () => {
      stop();
      active = !motion.matches && !small.matches;
      el.classList.toggle('stack-active', active);
      if (!active) return;
      cards.forEach(c => c.style.marginBottom = `${itemDistance}px`);
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: true });
      lenis.on('scroll', update);
      const raf = time => { lenis.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
      observer = new ResizeObserver(measure);
      cards.forEach(c => observer.observe(c));
      measure();
    };
    // Tab navigation must reveal a card even if it is currently covered.
    const focus = event => {
      const index = cards.findIndex(c => c.contains(event.target));
      if (active && index >= 0) lenis.scrollTo(tops[index] - stackPosition - index * itemStackDistance, { immediate: true });
    };
    setup();
    motion.addEventListener('change', setup);
    small.addEventListener('change', setup);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', update, { passive: true });
    el.addEventListener('focusin', focus);
    document.fonts.ready.then(() => { if (active) measure(); });
    return () => {
      stop();
      motion.removeEventListener('change', setup);
      small.removeEventListener('change', setup);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', update);
      el.removeEventListener('focusin', focus);
    };
  }, [itemDistance, itemScale, itemStackDistance, baseScale, stackPosition]);
  return <div ref={root} className="scroll-stack-scroller"><div className="scroll-stack-inner">{children}<div className="scroll-stack-end" /></div></div>;
}
