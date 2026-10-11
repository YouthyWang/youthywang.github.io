/* An intentional hidden easter egg. No visible call to action or switch. */
(() => {
  'use strict';
  const root=document.querySelector('.avatar-lab');
  const portrait=document.getElementById('avatar-toggle');
  if(!root || !portrait) return;
  let timer=null;
  function reset(){root.classList.remove('is-real');timer=null;}
  portrait.addEventListener('click',()=>{
    if(timer!==null) clearTimeout(timer);
    root.classList.remove('is-real');
    // A frame of separation lets repeated clicks restart the scan smoothly.
    void root.offsetWidth;
    root.classList.add('is-real');
    timer=setTimeout(reset,2300);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden && timer!==null){clearTimeout(timer);reset();}});
})();
