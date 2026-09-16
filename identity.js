/* Shared identity UI; portfolio data and animation remain in script.js. */
(()=>{
 'use strict';
 const logo='<span class="brand-logo"><img src="images/kimheerin-logo.png" width="471" height="138" alt="KIM HEERIN"><i aria-hidden="true"></i></span>';
 const statement='<p>저는 디자인이 단순히 정보를 전달하거나 아름다움을 만드는 것을 넘어, 사람의 일상에 작은 즐거움과 새로운 경험을 더할 수 있다고 생각합니다.</p><p>익숙한 것에서 새로운 가능성을 발견하고, 색과 형태, 이미지의 조합을 통해 기억에 남는 감정을 만드는 것을 좋아합니다.</p><p>작은 디자인 하나가 평범한 하루를 조금 더 특별하게 만들 수 있도록, 일상 속 즐거움의 가치를 높이는 그래픽 디자이너가 되고 싶습니다.</p>';
 const short='<p class="identity-statement">CREATING SMALL MOMENTS OF JOY<br>THROUGH GRAPHIC DESIGN.</p>';
 const contacts='<dl class="identity-contacts"><div><dt>T.</dt><dd><a href="tel:+821029557315">010 2955 7315</a></dd></div><div><dt>E.</dt><dd><a href="mailto:kimheerin.work@gmail.com">kimheerin.work@gmail.com</a></dd></div><div><dt>IG.</dt><dd><a href="https://instagram.com/kimheerin.archive" target="_blank" rel="noopener noreferrer">@kimheerin.archive <span aria-hidden="true">↗</span></a></dd></div><div><dt>LOC.</dt><dd>South Korea</dd></div></dl>';
 const routes=[['ARCHIVE','archive-panel'],['ABOUT','about-panel'],['CONTACT','contact-panel']];
 const nav=(numbered=false)=>routes.map(([name,id],i)=>`<button type="button" data-brand-route data-panel="${id}">${numbered?`<span class="menu-number">0${i+1}</span>`:''}<span>${name}</span></button>`).join('');
 const menu=document.createElement('dialog');menu.id='identity-menu';menu.className='identity-menu';menu.setAttribute('aria-label','Site menu');
 menu.innerHTML=`<header class="identity-menu-top"><a href="#home" data-brand-home aria-label="KIM HEERIN home">${logo}</a><button type="button" data-menu-close aria-label="Close menu">CLOSE ×</button></header><div class="identity-menu-layout"><nav class="identity-menu-nav" aria-label="Menu navigation">${nav(true)}</nav><div class="identity-menu-copy"><div class="designer-statement" lang="ko">${statement}</div>${short}</div><div class="menu-contact"><p>KIM HEERIN<br><span>GRAPHIC DESIGNER</span></p>${contacts}</div></div>`;
 document.body.append(menu);
 const contact=document.createElement('aside');contact.id='contact-panel';contact.className='side-panel contact-panel';contact.hidden=true;contact.setAttribute('aria-labelledby','contact-title');
 contact.innerHTML=`<header><p>CONTACT / KIM HEERIN</p><button type="button" data-close-panel aria-label="Close contact">CLOSE ×</button></header><h2 id="contact-title">CONTACT</h2><div class="contact-composition"><p>KIM HEERIN<br>GRAPHIC DESIGNER</p>${short}${contacts}</div>`;
 document.body.append(contact);
 document.querySelector('.about-copy').insertAdjacentHTML('beforeend',`<div class="designer-statement about-statement" lang="ko">${statement}</div>`);
 const inlineAbout=document.createElement('section');inlineAbout.className='inline-about';inlineAbout.setAttribute('aria-labelledby','inline-about-title');
 inlineAbout.innerHTML='<h2 id="inline-about-title">ABOUT / KIM HEERIN</h2>'+document.querySelector('#about-panel .about-layout').outerHTML.replace('id="about-title"','');
 document.querySelector('#canvas-world').append(inlineAbout);
 const footer=()=>`<footer class="identity-footer"><div class="footer-composition"><div class="footer-brand"><a href="#home" data-brand-home aria-label="KIM HEERIN home">${logo}</a><p>GRAPHIC DESIGNER</p>${short}</div>${contacts}<nav aria-label="Footer navigation">${nav()}</nav></div><div class="footer-bottom"><span>© 2026 KIM HEERIN</span><button type="button" data-back-top>BACK TO TOP ↑</button></div></footer>`;
 ['#canvas-world','#archive-panel','#about-panel','#contact-panel','#project-overlay'].forEach(selector=>document.querySelector(selector).insertAdjacentHTML('beforeend',footer()));
 const open=document.querySelector('#menu-open');let closeTimer=0,previousFocus=null;
 function openMenu(){clearTimeout(closeTimer);previousFocus=document.activeElement;menu.showModal();document.body.classList.add('menu-visible');open.setAttribute('aria-expanded','true');requestAnimationFrame(()=>menu.classList.add('is-open'));menu.querySelector('[data-menu-close]').focus()}
 function closeMenu(immediate=false){clearTimeout(closeTimer);menu.classList.remove('is-open');const finish=()=>{menu.close();document.body.classList.remove('menu-visible');open.setAttribute('aria-expanded','false');if(previousFocus?.isConnected)previousFocus.focus()};if(immediate||matchMedia('(prefers-reduced-motion: reduce)').matches)finish();else closeTimer=setTimeout(finish,350)}
 function closeScreens(){const overlay=document.querySelector('#project-overlay');if(!overlay.hidden)document.querySelector('#overlay-close').click();document.querySelectorAll('.side-panel:not([hidden]) [data-close-panel]').forEach(b=>b.click())}
 open.addEventListener('click',openMenu);
 menu.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});
 document.addEventListener('keydown',e=>{if(menu.open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeMenu()}},true);
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-menu-close]'))closeMenu();
  if(e.target.closest('[data-brand-route]')){if(menu.open)closeMenu(true);closeScreens()}
  if(e.target.closest('[data-brand-home]')){e.preventDefault();if(menu.open)closeMenu(true);closeScreens();document.querySelector('#canvas-viewport').scrollTo({top:0,behavior:'smooth'})}
  const top=e.target.closest('[data-back-top]');if(top){const screen=top.closest('.side-panel,.project-overlay,#canvas-viewport');screen?.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 },true);
})();
