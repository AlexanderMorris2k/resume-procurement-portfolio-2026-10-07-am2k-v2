(() => {
  'use strict';
  const order = ['home', 'impact', 'experience', 'expertise', 'resume'];
  const labels = {home:'Overview', impact:'Impact', experience:'Experience', expertise:'Expertise', resume:'Resume & Contact'};
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const nav = document.querySelector('[data-navigation]');
  const content = document.querySelector('#content');
  const currentLabel = document.querySelector('[data-current-section]');
  const announcement = document.querySelector('[data-announcement]');
  const previousButton = document.querySelector('[data-previous]');
  const nextButton = document.querySelector('[data-next]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const aliases = {overview:'home',contact:'resume',about:'home'};
  const printOpenState = new Map();
  let current = '';
  function route() {
    const name = location.hash.slice(1).replace(/^panel-/, '').toLowerCase();
    return order.includes(name) ? name : aliases[name] || 'home';
  }
  function activate(name, {historyMode = 'push', focusPanel = false, scroll = true} = {}) {
    if (!order.includes(name)) return;
    const index = order.indexOf(name);
    const oldIndex = order.indexOf(current);
    const changed = current !== name;
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === name;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      const selected = panel.dataset.panel === name;
      panel.hidden = !selected;
      panel.classList.remove('is-entering','enter-back','enter-forward');
      if (selected && changed && oldIndex !== -1 && !motion.matches) {
        panel.classList.add('is-entering', index < oldIndex ? 'enter-back' : 'enter-forward');
      }
    });
    if (historyMode !== 'none' && changed && location.hash !== `#${name}`) {
      history[historyMode === 'replace' ? 'replaceState' : 'pushState'](null, '', `#${name}`);
    }
    current = name;
    if (nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({left:Math.max(0,tabs[index].offsetLeft-12),behavior:'auto'});
    }
    if (currentLabel) currentLabel.textContent = `${String(index+1).padStart(2,'0')} / ${labels[name]}`;
    if (announcement && changed && oldIndex !== -1) announcement.textContent = `${labels[name]} section`;
    if (previousButton) previousButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === order.length - 1;
    if (scroll && changed && window.scrollY > content.offsetTop - 28) {
      content.scrollIntoView({block:'start', behavior:'auto'});
    }
    if (focusPanel) document.querySelector(`#${name}`).focus({preventScroll:true});
  }
  nav.setAttribute('role','tablist');
  nav.setAttribute('aria-label','Resume sections');
  tabs.forEach(tab => {
    const name = tab.dataset.tab;
    tab.id = `tab-${name}`;
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls', name);
    tab.addEventListener('click', event => {event.preventDefault();activate(name);});
    tab.addEventListener('keydown', event => {
      if (event.key === ' ') {event.preventDefault();activate(name);return;}
      const here = order.indexOf(name);
      let destination;
      if (event.key === 'ArrowRight') destination = (here + 1) % order.length;
      if (event.key === 'ArrowLeft') destination = (here - 1 + order.length) % order.length;
      if (event.key === 'Home') destination = 0;
      if (event.key === 'End') destination = order.length - 1;
      if (destination === undefined) return;
      event.preventDefault();
      activate(order[destination]);
      tabs[destination].focus();
    });
  });
  panels.forEach(panel => {
    panel.setAttribute('role','tabpanel');
    panel.setAttribute('aria-labelledby',`tab-${panel.dataset.panel}`);
    panel.tabIndex = 0;
  });
  document.querySelectorAll('[data-jump]').forEach(link => {
    link.addEventListener('click', event => {event.preventDefault();activate(link.dataset.jump, {focusPanel:true});});
  });
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    content.focus({preventScroll:true});
    content.scrollIntoView({block:'start',behavior:'auto'});
  });
  previousButton?.addEventListener('click', () => {
    const index = order.indexOf(current);
    if (index > 0) activate(order[index - 1], {focusPanel:true});
  });
  nextButton?.addEventListener('click', () => {
    const index = order.indexOf(current);
    if (index < order.length-1) activate(order[index + 1], {focusPanel:true});
  });
  window.addEventListener('popstate', () => activate(route(), {historyMode:'none'}));
  window.addEventListener('hashchange', () => activate(route(), {historyMode:'none'}));
  motion.addEventListener?.('change', () => {
    if (motion.matches) panels.forEach(p => p.classList.remove('is-entering'));
  });
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('details').forEach(item => {printOpenState.set(item,item.open);item.open=true;});
  });
  window.addEventListener('afterprint', () => {
    printOpenState.forEach((open,item) => {item.open=open;});
    printOpenState.clear();
  });
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
  document.documentElement.classList.add('enhanced');
  document.querySelector('[data-controls]').hidden = false;
  activate(route(), {historyMode:'none', scroll:false});
})();
