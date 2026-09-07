// Fondo animado tipo "destello de estrellas" (como la imagen de referencia)
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let width, height, cx, cy;
  let stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
  }

  function makeStar() {
    return {
      angle: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.8,
      dist: Math.random() * 40,
      size: 0.6 + Math.random() * 1.8,
      hueShift: Math.random() < 0.5 ? -1 : 1
    };
  }

  function initStars() {
    stars = [];
    const count = Math.floor((width * height) / 6000);
    for (let i = 0; i < count; i++) {
      const s = makeStar();
      s.dist = Math.random() * Math.max(width, height) * 0.6;
      stars.push(s);
    }
  }

  function draw() {
    ctx.fillStyle = 'rgba(2, 2, 15, 1)';
    ctx.fillRect(0, 0, width, height);

    for (const s of stars) {
      s.dist += s.speed;
      const maxDist = Math.max(width, height) * 0.75;
      if (s.dist > maxDist) {
        s.dist = 0;
        s.angle = Math.random() * Math.PI * 2;
      }

      const x = cx + Math.cos(s.angle) * s.dist;
      const y = cy + Math.sin(s.angle) * s.dist;
      const alpha = Math.min(1, s.dist / 60);
      const size = s.size * (0.4 + s.dist / maxDist);

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(120,160,255,${alpha * 0.5})`;
      ctx.arc(x + s.hueShift, y, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    initStars();
  });

  resize();
  initStars();
  draw();
})();
