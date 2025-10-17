/* Futuristic animated background + particles + UI interactions
   Save as script.js
*/

// update year
document.getElementById('year')?.textContent = new Date().getFullYear();

// Smooth link behavior and active class
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth', block:'start'});
    document.querySelectorAll('.nav-links a').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
  });
});

/* Canvas: animated gradient wave background (bg-gradient) */
const bg = document.getElementById('bg-gradient');
const p = document.getElementById('particles');

function fitCanvas(c){
  c.width = innerWidth;
  c.height = innerHeight;
}
fitCanvas(bg);
fitCanvas(p);
window.addEventListener('resize', ()=>{ fitCanvas(bg); fitCanvas(p); });

const bgCtx = bg.getContext('2d');
const pCtx = p.getContext('2d');

let t = 0;
function drawGradientBg(){
  const w = bg.width, h = bg.height;
  t += 0.002;
  // animated multicolor gradient
  const grad = bgCtx.createLinearGradient(0, 0, w, h);
  const a = Math.sin(t*1.2)*0.5 + 0.5;
  const b = Math.sin(t*0.7 + 1)*0.5 + 0.5;
  grad.addColorStop(0, `rgba(11,11,14,${0.98 - a*0.05})`);
  grad.addColorStop(0.35, `rgba(11,60,120,${0.9 - b*0.08})`);
  grad.addColorStop(0.65, `rgba(140,60,240,${0.85 - a*0.06})`);
  grad.addColorStop(1, `rgba(20,10,40,${0.9 - b*0.05})`);
  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0,0,w,h);

  // subtle moving lines (parallax waves)
  bgCtx.globalCompositeOperation = 'lighter';
  for(let i=0;i<6;i++){
    bgCtx.beginPath();
    const yPhase = Math.sin(t*1.2 + i)*20;
    bgCtx.moveTo(0, h*0.2 + i* (h*0.1) );
    for(let x=0;x<w;x+=20){
      const y = h*0.2 + i*(h*0.1) + Math.sin((x*0.008) + (t*2) + i)*40;
      bgCtx.lineTo(x,y + yPhase);
    }
    bgCtx.strokeStyle = `rgba(120,200,255,${0.02 + i*0.006})`;
    bgCtx.lineWidth = 1;
    bgCtx.stroke();
  }
  bgCtx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(drawGradientBg);
}
drawGradientBg();

/* Particles layer */
const particles = [];
const PARTICLE_COUNT = Math.round((innerWidth*innerHeight)/80000)*30; // responsive
function initParticles(){
  particles.length = 0;
  for(let i=0;i<PARTICLE_COUNT;i++){
    particles.push({
      x: Math.random()*p.width,
      y: Math.random()*p.height,
      r: Math.random()*1.8 + 0.6,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
      hue: 180 + Math.random()*120
    });
  }
}
initParticles();

function drawParticles(){
  pCtx.clearRect(0,0,p.width,p.height);
  // draw and link
  for(let i=0;i<particles.length;i++){
    const a = particles[i];
    // move
    a.x += a.vx;
    a.y += a.vy;
    if(a.x < -10) a.x = p.width + 10;
    if(a.x > p.width + 10) a.x = -10;
    if(a.y < -10) a.y = p.height + 10;
    if(a.y > p.height + 10) a.y = -10;

    // draw
    pCtx.beginPath();
    pCtx.fillStyle = `hsla(${a.hue}, 90%, 60%, 0.08)`;
    pCtx.arc(a.x, a.y, a.r, 0, Math.PI*2);
    pCtx.fill();

    // linking nearby
    for(let j=i+1;j<particles.length;j++){
      const b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const d = Math.hypot(dx,dy);
      if(d < 120){
        pCtx.beginPath();
        pCtx.strokeStyle = `hsla(${(a.hue+b.hue)/2},90%,60%,${0.06 - d/2200})`;
        pCtx.lineWidth = 0.8;
        pCtx.moveTo(a.x,a.y); pCtx.lineTo(b.x,b.y); pCtx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* Scroll reveal */
const revealItems = document.querySelectorAll('.fade-in, .glass, .card, .section-title');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('reveal-on');
  });
},{threshold:0.15});
revealItems.forEach(i=>revealObserver.observe(i));

/* Type/rotator small UI */
(function rotator(){
  const root = document.querySelector('.type-rotator');
  if(!root) return;
  const phrases = Array.from(root.querySelectorAll('.rot-phrase')).map(s=>s.textContent);
  let idx = 0;
  const el = document.createElement('div');
  el.className = 'rot-box';
  root.innerHTML = '';
  root.appendChild(el);
  function show(){
    el.textContent = phrases[idx];
    el.style.opacity = 0;
    el.style.transform = 'translateY(6px)';
    requestAnimationFrame(()=>{ el.style.transition = 'all 400ms cubic-bezier(.2,.9,.3,1)'; el.style.opacity = 1; el.style.transform = 'translateY(0)'; });
    setTimeout(()=>{
      el.style.opacity = 0;
      el.style.transform = 'translateY(-6px)';
      setTimeout(()=>{ idx = (idx+1)%phrases.length; show(); }, 350);
    }, 2200);
  }
  show();
})();

/* Resize handler for particles count */
window.addEventListener('resize', ()=>{
  fitCanvas(bg); fitCanvas(p);
  initParticles();
});

/* helper used earlier */
function fitCanvas(c){ c.width = innerWidth; c.height = innerHeight; }
