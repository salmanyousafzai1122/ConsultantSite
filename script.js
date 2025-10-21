// ===== utilities =====
document.getElementById('year')?.textContent = new Date().getFullYear();
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth', block:'start'});
    document.querySelectorAll('.nav-links a').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
  });
});

// ===== typewriter for hero text =====
const typeText = "We help companies grow with speed, precision, and innovation — tailored consulting that turns challenges into opportunities.";
(function typewriter(){
  const el = document.getElementById('typewriter');
  if(!el) return;
  let i = 0;
  function tick(){
    if(i <= typeText.length){ el.textContent = typeText.slice(0,i++); setTimeout(tick, 22); }
  }
  tick();
})();

// ===== animated float light canvas =====
const lightCanvas = document.getElementById('floatLight');
const pCanvas = document.getElementById('particles');
function fit(c){ c.width = innerWidth; c.height = innerHeight; }
fit(lightCanvas); fit(pCanvas);
window.addEventListener('resize', ()=>{ fit(lightCanvas); fit(pCanvas); initParticles(); });

const lctx = lightCanvas.getContext('2d');
const pctx = pCanvas.getContext('2d');

// floating soft light blob (subtle)
let t = 0;
function drawLightBg(){
  t += 0.002;
  const w = lightCanvas.width, h = lightCanvas.height;
  lctx.clearRect(0,0,w,h);
  // two soft radial glows that drift slowly
  const grad1 = lctx.createRadialGradient(w*0.15 + Math.sin(t*2)*60, h*0.2 + Math.cos(t*1.5)*40, 50, w*0.15, h*0.2, Math.max(w,h));
  grad1.addColorStop(0, 'rgba(0,214,255,0.08)');
  grad1.addColorStop(0.45, 'rgba(0,214,255,0.02)');
  grad1.addColorStop(1, 'transparent');
  lctx.fillStyle = grad1;
  lctx.fillRect(0,0,w,h);

  const grad2 = lctx.createRadialGradient(w*0.8 + Math.cos(t*1.3)*80, h*0.8 + Math.sin(t*0.9)*60, 40, w*0.8, h*0.8, Math.max(w,h));
  grad2.addColorStop(0, 'rgba(139,92,246,0.06)');
  grad2.addColorStop(0.5, 'rgba(139,92,246,0.01)');
  grad2.addColorStop(1, 'transparent');
  lctx.fillStyle = grad2;
  lctx.fillRect(0,0,w,h);

  requestAnimationFrame(drawLightBg);
}
drawLightBg();

// ===== particles =====
let particles = [];
function initParticles(){
  const count = Math.max(50, Math.round((innerWidth*innerHeight)/120000)); // responsive
  particles = [];
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*pCanvas.width,
      y: Math.random()*pCanvas.height,
      r: Math.random()*2 + 0.4,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
      hue: 180 + Math.random()*120,
      alpha: 0.08 + Math.random()*0.12
    });
  }
}
initParticles();

function drawParticles(){
  pctx.clearRect(0,0,pCanvas.width,pCanvas.height);
  for(let p of particles){
    pctx.beginPath();
    pctx.fillStyle = `hsla(${p.hue},90%,60%,${p.alpha})`;
    pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pctx.fill();
    p.x += p.vx; p.y += p.vy;
    // wrap
    if(p.x < -10) p.x = pCanvas.width + 10;
    if(p.x > pCanvas.width + 10) p.x = -10;
    if(p.y < -10) p.y = pCanvas.height + 10;
    if(p.y > pCanvas.height + 10) p.y = -10;
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== contact form (client side) =====
document.getElementById('contactForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  // Simple client-side feedback — integrate backend or email service if needed
  alert('Thanks — your message has been sent. We will contact you soon.');
  e.target.reset();
});
