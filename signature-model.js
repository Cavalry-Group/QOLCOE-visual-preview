(() => {
  const model = document.querySelector('[data-signature-model]');
  const canvas = model?.querySelector('canvas');
  const buttons = [...(model?.querySelectorAll('[data-concept-service]') || [])];
  if (!model || !canvas || !buttons.length) return;

  const context = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, ratio = 1, active = 0, start = performance.now();

  const resize = () => {
    const rect = model.getBoundingClientRect(); ratio = Math.min(devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height; canvas.width = width * ratio; canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const setActive = (index) => { active = index; buttons.forEach((button, i) => button.classList.toggle('is-active', i === index)); };
  buttons.forEach((button, index) => {
    button.addEventListener('pointerenter', () => setActive(index));
    button.addEventListener('focus', () => setActive(index));
  });

  const pointFor = (button) => {
    const m = model.getBoundingClientRect(), b = button.getBoundingClientRect();
    return { x: button.matches(':nth-child(odd)') ? b.right - m.left + 17 : b.left - m.left - 17, y: b.top - m.top + b.height / 2 };
  };
  const draw = (now) => {
    const time = reducedMotion ? 0 : (now - start) / 1000, cx = width / 2, cy = height / 2;
    context.clearRect(0, 0, width, height);
    context.save(); context.translate(cx, cy);
    for (let ring = 0; ring < 3; ring++) {
      context.beginPath(); context.ellipse(0, 0, 120 + ring * 53, 82 + ring * 36, time * (ring % 2 ? -.035 : .028), 0, Math.PI * 2);
      context.strokeStyle = `rgba(177,244,242,${.12 - ring * .025})`; context.lineWidth = 1; context.stroke();
    }
    for (let i = 0; i < 16; i++) {
      const angle = time * (.13 + i % 3 * .025) + i * Math.PI * 2 / 16, rx = 118 + (i % 4) * 34, ry = 78 + (i % 4) * 24;
      const x = Math.cos(angle) * rx, y = Math.sin(angle) * ry;
      context.beginPath(); context.arc(x, y, i % 5 === 0 ? 2.4 : 1.25, 0, Math.PI * 2); context.fillStyle = i % 5 === 0 ? 'rgba(255,212,106,.8)' : 'rgba(190,249,247,.42)'; context.fill();
    }
    context.restore();

    buttons.forEach((button, index) => {
      const target = pointFor(button), left = index % 2 === 0;
      context.beginPath(); context.moveTo(cx + (left ? -102 : 102), cy);
      context.bezierCurveTo(cx + (left ? -150 : 150), cy, target.x + (left ? 55 : -55), target.y, target.x, target.y);
      context.strokeStyle = index === active ? 'rgba(255,212,106,.62)' : 'rgba(204,250,248,.105)'; context.lineWidth = index === active ? 1.4 : 1; context.stroke();
      if (index === active) {
        const progress = reducedMotion ? 1 : (time % 2.5) / 2.5, sx = cx + (left ? -102 : 102), ex = target.x;
        const x = sx + (ex - sx) * progress, y = cy + (target.y - cy) * progress;
        const glow = context.createRadialGradient(x,y,0,x,y,13); glow.addColorStop(0,'rgba(255,212,106,1)'); glow.addColorStop(1,'rgba(255,212,106,0)');
        context.fillStyle=glow; context.beginPath(); context.arc(x,y,13,0,Math.PI*2); context.fill();
      }
    });
    requestAnimationFrame(draw);
  };
  new ResizeObserver(resize).observe(model); resize(); setActive(0);
  if (!reducedMotion) setInterval(() => setActive((active + 1) % buttons.length), 3200);
  requestAnimationFrame(draw);
})();
