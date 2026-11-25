'use strict';

const $ = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const serviceById = new Map(services.map(service => [service.id, service]));
const basketKey = 'detail-studio-basket-v1';
const sizeKey = 'detail-studio-vehicle';
const sizes = {
  compact: {name: 'Compact', factor: 1},
  standard: {name: 'Saloon / estate', factor: 1.15},
  large: {name: 'Large SUV / MPV', factor: 1.35}
};

function stored(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function persist(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Private sessions keep the selection in memory. */ }
}
function readItems() {
  try {
    const saved = JSON.parse(stored(basketKey));
    if (!Array.isArray(saved)) return [];
    const items = new Map();
    for (const item of saved) {
      const service = serviceById.get(item?.id);
      if (service && Number.isInteger(item.pack) && service.packages[item.pack]) {
        items.set(item.id, {id: item.id, pack: item.pack});
      }
    }
    return [...items.values()];
  } catch { return []; }
}
let vehicle = stored(sizeKey);
if (!Object.hasOwn(sizes, vehicle)) vehicle = 'compact';
let items = readItems();

function priceFor(service, tier) {
  const [name, price, minutes, description] = service.packages[tier];
  const factor = sizes[vehicle].factor;
  return {name, price: Math.round(price * factor), minutes: Math.ceil(minutes * factor / 5) * 5, description};
}
function orderedItems(selection) {
  return services.flatMap(service => selection.filter(item => item.id === service.id));
}
function totals(selection) {
  return selection.reduce((sum, item) => {
    const entry = priceFor(serviceById.get(item.id), item.pack);
    return {price: sum.price + entry.price, minutes: sum.minutes + entry.minutes};
  }, {price: 0, minutes: 0});
}
function animate(element) {
  element.classList.remove('arrive');
  void element.offsetWidth;
  element.classList.add('arrive');
}
function pressed(buttons, selected) {
  buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === selected)));
}
function refreshCount() { all('.count').forEach(el => el.textContent = items.length); }
function updateItems(next) {
  items = orderedItems(next);
  persist(basketKey, JSON.stringify(items));
  refreshCount();
}
function mergeItems(additions, preserveUpgrade) {
  const merged = new Map(items.map(item => [item.id, item]));
  for (const entry of additions) {
    const pack = preserveUpgrade ? Math.max(entry.pack, merged.get(entry.id)?.pack ?? 0) : entry.pack;
    merged.set(entry.id, {id: entry.id, pack});
  }
  updateItems([...merged.values()]);
}
refreshCount();

function startTour() {
  const film = $('video');
  const track = $('.track');
  const screen = $('.screen');
  const chapters = all('[data-jump]');
  const clock = $('#clock');
  const pin = $('.focusPin');
  // Normalised image positions follow the point of interest through the original camera moves.
  const path = [[0,.5,.56],[3,.57,.53],[7,.48,.44],[12,.45,.48],[16,.5,.43],
    [20,.57,.44],[25,.61,.56],[28,.55,.49],[32,.46,.65],[36,.45,.69],
    [40,.54,.56],[46,.51,.5],[50,.5,.65],[54,.6,.54],[57,.62,.54],
    [60,.6,.54],[63,.5,.56],[66.3,.51,.54]];
  function positionPin(time) {
    const next = path.findIndex(point => point[0] > time);
    const [t2,x2,y2] = path[next < 0 ? path.length-1 : next];
    const [t1,x1,y1] = path[Math.max(0, (next < 0 ? path.length-1 : next)-1)];
    const mix = Math.max(0, Math.min(1,(time-t1)/(t2-t1 || 1)));
    const width = screen.clientWidth, height = screen.clientHeight;
    const scale = Math.max(width/720, height/406);
    const x = width/2 + (x1 + mix*(x2-x1)-.5)*720*scale;
    const y = height/2 + (y1 + mix*(y2-y1)-.5)*406*scale;
    pin.style.left = x+'px'; pin.style.top = y+'px';
    const copy = $('.caption');
    pin.hidden = x<22 || x>width-22 || y<86 || y>height-108 ||
      (x>copy.offsetLeft-22 && x<copy.offsetLeft+copy.offsetWidth+22 && y>copy.offsetTop-22 && y<copy.offsetTop+copy.offsetHeight+22);
  }
  let duration = 66.3;
  let desired = 0;
  let active = -1;
  let frame = 0;
  let shownTime = 0;
  const travel = () => Math.max(1, track.offsetHeight - screen.offsetHeight);
  const stamp = time => String(Math.floor(time / 60)).padStart(2, '0') + ':' + String(Math.floor(time % 60)).padStart(2, '0');
  function jump(time) {
    scrollTo({top: track.offsetTop + travel() * Math.min(1, Math.max(time, 0) / duration), behavior:'instant'});
  }
  function display(time) {
    shownTime = time;
    positionPin(time);
    const index = services.reduce((prev, s, i) => s.start <= time ? i : prev, 0);
    clock.textContent = stamp(time) + ' / ' + stamp(duration);
    chapters.forEach((button, i) => {
      const start = services[i].start;
      const end = services[i+1]?.start ?? duration;
      const fraction = Math.min(1, Math.max(0, (time - start) / (end - start)));
      button.style.setProperty('--progress', (fraction * 100) + '%');
    });
    if (active === index) return;
    active = index;
    const s = services[index];
    screen.style.setProperty('--accent', s.color);
    $('#title').textContent = s.title;
    $('#category').textContent = s.category;
    $('#summary').textContent = s.desc;
    pin.href = $('#title').href = $('#explore').href = s.id + '.html';
    pin.setAttribute('aria-label','Open ' + s.title.toLowerCase() + ' service');
    chapters.forEach((b, i) => {
      if (i === index) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    if (film.error) film.poster = s.id + '.jpg';
    animate($('.caption'));
  }
  function seek() {
    if (film.error || film.readyState < 1) { display(desired); return; }
    if (!film.seeking && Math.abs(film.currentTime - desired) > .025) film.currentTime = desired;
    else if (!film.seeking) display(film.currentTime);
  }
  function update() {
    frame = 0;
    desired = Math.min(duration - .04, Math.max(0, (scrollY - track.offsetTop) / travel() * duration));
    seek();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  chapters.forEach((button, i) => button.onclick = () => jump(services[i].start + .18));
  film.addEventListener('loadedmetadata', () => { duration = film.duration; update(); });
  film.addEventListener('loadeddata', schedule);
  film.addEventListener('seeked', () => { display(film.currentTime); seek(); });
  film.addEventListener('error', () => { active = -1; display(desired); });
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  for (const link of [$('#title'), $('#explore'), pin]) {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      const url = new URL(link.href);
      url.searchParams.set('t', shownTime.toFixed(3));
      $('.caption').classList.add('leaving');
      setTimeout(() => location.assign(url.href), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140);
    });
  }
  const time = new URLSearchParams(location.search).get('t');
  const stage = services.find(s => location.hash === '#stage-' + s.id);
  if (!location.hash && time !== null && Number.isFinite(Number(time))) jump(Number(time));
  else if (stage) jump(stage.start + .18);
  display(0);
  update();
  addEventListener('pageshow', () => { $('.caption').classList.remove('leaving'); schedule(); });
  const filters = all('[data-filter]');
  filters.forEach((b, i) => b.onclick = () => {
    pressed(filters, i);
    all('[data-group]').forEach(card => card.hidden = i !== 0 && card.dataset.group !== b.dataset.filter);
  });
  const slider = $('.compare input');
  slider.oninput = () => $('.compare').style.setProperty('--cut', slider.value + '%');
}

let renderPrices = () => {};
const servicePage = $('.detail');
if ($('.track')) startTour();
if (servicePage) {
  const s = serviceById.get(servicePage.dataset.service);
  const t = new URLSearchParams(location.search).get('t');
  if (t !== null && Number.isFinite(Number(t))) $('#return').href = 'index.html?t=' + encodeURIComponent(t);
  const pins = all('[data-spot]');
  const zones = all('[data-zone]');
  function inspect(index) {
    pressed(pins, index);
    pressed(zones, index);
    const [label,,,text] = s.spots[index];
    $('#zoneText').innerHTML = '<h3>' + label + '</h3><p>' + text + '</p>';
    animate($('#zoneText'));
  }
  pins.forEach((pin,i) => pin.onclick = () => inspect(i));
  zones.forEach((zone,i) => zone.onclick = () => inspect(i));
  let tier = items.find(item => item.id === s.id)?.pack ?? 0;
  const options = all('[data-pack]');
  renderPrices = () => {
    const offer = priceFor(s, tier);
    pressed(options, tier);
    $('#quote').innerHTML = '<div class="price">€' + offer.price + '<span>approx. ' + offer.minutes + ' min</span></div><p>' + (tier === 0 ? s.scope : offer.description + ' Includes the base service.') + '</p>';
    $('#added').textContent = '';
    animate($('#quote'));
  };
  options.forEach((button,i) => button.onclick = () => { tier = i; renderPrices(); });
  $('#add').onclick = () => {
    mergeItems([{id:s.id,pack:tier}], false);
    $('#added').textContent = priceFor(s,tier).name + ' saved to your basket.';
  };
}
if ($('.bundleGrid')) {
  renderPrices = () => {
    all('[data-total]').forEach((el,i) => {
      const total = totals(bundles[i].items);
      el.innerHTML = '<dt>Estimated price &amp; time</dt><dd>€' + total.price + ' · ' + total.minutes + ' min</dd>';
      animate(el);
    });
  };
  all('[data-bundle]').forEach((button,i) => button.onclick = () => {
    mergeItems(bundles[i].items, true);
    $('#added').textContent = bundles[i].label + ' added. Your basket contains ' + items.length + ' services.';
  });
}
if ($('#lines')) {
  renderPrices = () => {
    const lines = $('#lines');
    lines.replaceChildren();
    for (const item of items) {
      const service = serviceById.get(item.id);
      const offer = priceFor(service, item.pack);
      const row = document.createElement('article');
      row.className = 'line';
      row.innerHTML = '<div><a href="'+service.id+'.html"><strong>'+service.title+' ↗</strong></a><small>€'+offer.price+' · '+offer.minutes+' min</small></div>';
      const select = document.createElement('select');
      select.className = 'tierSelect';
      select.setAttribute('aria-label',service.title+' package');
      service.packages.forEach(([name],i) => select.add(new Option(name, String(i), false, i === item.pack)));
      select.onchange = () => {
        mergeItems([{id:item.id,pack:Number(select.value)}],false);
        renderPrices();
        all('.tierSelect')[items.findIndex(v=>v.id===item.id)]?.focus();
      };
      const remove = document.createElement('button');
      remove.className = 'remove';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove '+service.title);
      remove.onclick = () => { const index=items.indexOf(item); updateItems(items.filter(v => v.id !== item.id)); renderPrices(); (all('.remove')[index] || all('.remove').at(-1) || $('.estimate .pill')).focus(); };
      row.append(select, remove);
      lines.append(row);
    }
    if (!items.length) lines.innerHTML = '<p class="empty">Your basket is empty. Choose a service or <a class="review" href="packages.html">compare packages</a> to start.</p>';
    const total = totals(items);
    $('#sum').innerHTML = '<small>Estimated total</small><div class="price">€' + total.price + '<span>' + total.minutes + ' min</span></div>';
    $('#download').disabled = !items.length;
  };
  $('#download').onclick = () => {
    const total = totals(items);
    const lines = items.map(item => {
      const s = serviceById.get(item.id);
      const v = priceFor(s,item.pack);
      return s.title + ' — ' + v.name + ' | €' + v.price + ' | ' + v.minutes + ' min';
    });
    const text = ['DETAIL STUDIO','Detailing estimate',new Date().toLocaleDateString('en-IE'),'Vehicle: '+sizes[vehicle].name,'',...lines,'','Estimated total: €'+total.price,'Estimated working time: '+total.minutes+' min','','Illustrative estimate. Confirm the final scope, price and availability with the studio.'].join('\n');
    const url = URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a');
    a.href = url; a.download = 'Detail-Studio-Estimate.txt'; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };
}
function syncControls() {
  refreshCount();
  all('.size').forEach(select => select.value = vehicle);
  renderPrices();
}
all('.size').forEach(select => select.onchange = () => {
  vehicle = select.value; persist(sizeKey,vehicle); syncControls();
});
function restoreSelection() {
  items = readItems();
  const savedSize = stored(sizeKey);
  if (Object.hasOwn(sizes, savedSize)) vehicle = savedSize;
  syncControls();
}
addEventListener('storage',restoreSelection);
addEventListener('pageshow',event => { if(event.persisted) restoreSelection(); });
syncControls();
