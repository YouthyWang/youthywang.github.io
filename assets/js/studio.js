/* Studio / Youthy Wang. No framework or runtime dependencies. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Accessible preference switch; localStorage may be unavailable in privacy modes. */
  const themeToggle = $('.theme-toggle');
  const root = document.documentElement;
  let storedTheme = null;
  try { storedTheme = window.localStorage.getItem('yw-studio-theme'); } catch (_) {}
  const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'light';
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      const chinese = window.YouthyLocale?.get() === 'zh';
      const label = chinese ? (isDark ? '切换到浅色主题' : '切换到深色主题') : (isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
      themeToggle.classList.toggle('is-dark',isDark);
    }
    try { window.localStorage.setItem('yw-studio-theme',theme); } catch (_) {}
  }
  setTheme(initialTheme);
  themeToggle?.addEventListener('click', () => setTheme(root.getAttribute('data-theme')==='light'?'dark':'light'));
  window.addEventListener('yw:locale', () => setTheme(root.getAttribute('data-theme')));

  /* A small photo roll. Photos can be replaced by the site owner at any time. */
  const photos = $$('.photo-print');
  if (photos.length) {
    const photosText = [
      {en:'A cup of coffee',zh:'午后一杯咖啡'},
      {en:'Farther out',zh:'遥远星空'},
      {en:'Another beginning',zh:'另一次启程'}
    ];
    let current=0;
    const counter=$('.photo-counter'),title=$('.photo-caption-title');
    function showPhoto(idx) {
      current=(idx+photos.length)%photos.length;
      photos.forEach((el,i)=>{
        el.classList.remove('is-current','is-next','is-prev');
        el.classList.add(i===current?'is-current':(i-current+photos.length)%photos.length===1?'is-next':'is-prev');
        el.setAttribute('aria-pressed',String(i===current));
        el.tabIndex=i===current?0:-1;
      });
      if(counter)counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
      if(title)title.textContent=photosText[current][window.YouthyLocale?.get()==='zh'?'zh':'en'];
    }
    $('#photo-prev')?.addEventListener('click',()=>showPhoto(current-1));
    $('#photo-next')?.addEventListener('click',()=>showPhoto(current+1));
    photos.forEach((el,i)=>el.addEventListener('click',()=>showPhoto(i===current?current+1:i)));
    $('.photo-gallery')?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(current+1);}else if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(current-1);}});
    window.addEventListener('yw:locale',()=>showPhoto(current));
    showPhoto(0);
  }

  /* Subtle cursor ambient light, only on fine pointers. */
  const halo = $('.cursor-halo');
  if (halo && motionOK && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('pointermove', e => {
      halo.style.left = `${e.clientX}px`;
      halo.style.top = `${e.clientY}px`;
      halo.style.opacity = '1';
    }, {passive:true});
    document.addEventListener('pointerleave', () => {halo.style.opacity='0';});
  }

  /* Blog filtering only hides client-side entries; links are native Jekyll URLs. */
  const search = $('#post-search'), posts = $$('.post-entry'), noResults=$('#no-results');
  search?.addEventListener('input',()=>{
    const term=search.value.trim().toLocaleLowerCase();let shown=0;
    for(const post of posts){const visible=(post.textContent||'').toLocaleLowerCase().includes(term);post.hidden=!visible;if(visible)shown++;}
    if(noResults)noResults.hidden=shown!==0;
  });

  /* Interactive random walk: canvas + keyboard-friendly buttons. */
  const walk=$('#walk-canvas');
  if(walk){
    const ctx=walk.getContext('2d'), run=$('#walk-run'), reset=$('#walk-reset');
    let W=1,H=1,pos={x:0,y:0},running=false,segments=[],raf=0,last=0;
    function init(){const r=walk.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(1,r.width);H=Math.max(1,r.height);walk.width=Math.round(W*dpr);walk.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);pos={x:W/2,y:H/2};segments=[];draw();}
    function draw(){ctx.clearRect(0,0,W,H);ctx.strokeStyle='rgba(43,33,66,.15)';ctx.lineWidth=1;for(let x=15;x<W;x+=26){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=12;y<H;y+=26){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.lineWidth=2.5;ctx.strokeStyle='#39304b';ctx.beginPath();segments.forEach((p,i)=>{if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});ctx.stroke();ctx.fillStyle='#f07767';ctx.beginPath();ctx.arc(pos.x,pos.y,6,0,Math.PI*2);ctx.fill();}
    function step(t){if(!running)return;if(t-last>28){last=t;const angle=Math.random()*Math.PI*2;segments.push({...pos});pos.x=Math.min(W-7,Math.max(7,pos.x+Math.cos(angle)*10));pos.y=Math.min(H-7,Math.max(7,pos.y+Math.sin(angle)*10));segments.push({...pos});if(segments.length>400)segments.splice(0,2);draw();}raf=requestAnimationFrame(step);}
    run?.addEventListener('click',()=>{running=!running;run.setAttribute('aria-pressed',String(running));run.firstChild.textContent=running ? (window.YouthyLocale?.get() === 'zh' ? '暂停 ' : 'Pause ') : (window.YouthyLocale?.get() === 'zh' ? '运行 / 暂停 ' : 'Run / Pause ');if(running)raf=requestAnimationFrame(step);else cancelAnimationFrame(raf);});
    reset?.addEventListener('click',()=>{running=false;cancelAnimationFrame(raf);run?.setAttribute('aria-pressed','false');if(run)run.firstChild.textContent=window.YouthyLocale?.get() === 'zh' ? '运行 / 暂停 ' : 'Run / Pause ';init();});
    window.addEventListener('resize',init);init();
    document.addEventListener('visibilitychange',()=>{if(document.hidden){running=false;cancelAnimationFrame(raf);if(run)run.firstChild.textContent=window.YouthyLocale?.get() === 'zh' ? '运行 / 暂停 ' : 'Run / Pause ';}});
  }

  /* Mini generative grid; squares are buttons so keyboard users can play. */
  const grid=$('#pattern-grid');
  if(grid){const palette=['#333b2c','#8b855c','#e9ddbd','#cdeb82','#bc9657','#242825'];const dots=[];
    function recolor(button,pickRandom=true){const chosen=pickRandom?palette[Math.floor(Math.random()*palette.length)]:palette[0];button.style.background=chosen;button.dataset.color=chosen;}
    for(let i=0;i<64;i++){const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',window.YouthyLocale?.get() === 'zh' ? `切换第 ${i+1} 个色块` : `Toggle pattern dot ${i+1}`);dot.dataset.dotNumber=String(i+1);dot.addEventListener('click',()=>recolor(dot));grid.appendChild(dot);dots.push(dot);recolor(dot);}
    $('#pattern-shuffle')?.addEventListener('click',()=>dots.forEach(dot=>recolor(dot)));
    $('#pattern-clear')?.addEventListener('click',()=>dots.forEach(dot=>recolor(dot,false)));
    window.addEventListener('yw:locale',e=>dots.forEach(dot=>dot.setAttribute('aria-label',e.detail.lang === 'zh' ? `切换第 ${dot.dataset.dotNumber} 个色块` : `Toggle pattern dot ${dot.dataset.dotNumber}`)));
  }
})();
