'use strict';

const $ = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const bookableServices = [...services, ...valetOffers];
const serviceById = new Map(bookableServices.map(service => [service.id, service]));
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
  if (service.prices) {
    const index = ['compact', 'standard', 'large'].indexOf(vehicle);
    return {name, price: service.prices[index], minutes: service.times[index], description};
  }
  const factor = sizes[vehicle].factor;
  return {name, price: Math.round(price * factor), minutes: Math.ceil(minutes * factor / 5) * 5, description};
}
function orderedItems(selection) {
  return bookableServices.flatMap(service => selection.filter(item => item.id === service.id));
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

const tourChapters = [
  {name:'Mini Valet', label:'Maintenance valet', href:'mini-valet.html', start:14, image:'rinse.jpg', alt:'Rear of the Citroën during its wash'},
  {name:'Full Valet', label:'Cabin deep clean', href:'full-valet.html', start:27, image:'cabin.jpg', alt:'The open cabin and seats of the Citroën'},
  {name:'Extras', label:'Paint and headlights', href:'extras.html', start:50, image:'bonnet-after.jpg', alt:'The polished bonnet under the studio lights'}
];

function startTour() {
  const film = $('.tour video');
  const track = $('.tour-track');
  const runway = $('.tour-travel');
  const still = $('#still');
  const title = $('#title');
  const buttons = all('[data-jump]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const first = tourChapters[0].start;
  const last = 60;
  let time = first;
  let active = -1;
  let frame = 0;
  let stalledTimer;
  function jump(target) {
    const fraction = Math.max(0, Math.min(1, (target-first)/(last-first)));
    window.scrollTo(0, track.offsetTop + runway.offsetHeight*fraction);
  }
  function showStill() { film.hidden = true; }
  function seek() {
    if (motion.matches || film.readyState < 1 || film.error || film.seeking) return;
    if (Math.abs(film.currentTime-time) > .07) {
      clearTimeout(stalledTimer);
      stalledTimer = setTimeout(showStill, 450);
      film.currentTime = time;
    } else if (film.readyState >= 2) {
      clearTimeout(stalledTimer);
      film.hidden = false;
    }
  }
  function update() {
    frame = 0;
    const fraction = Math.min(1, Math.max(0, (scrollY-track.offsetTop)/runway.offsetHeight));
    time = first + fraction*(last-first);
    let index = 0;
    while (index+1 < tourChapters.length && time >= tourChapters[index+1].start) index++;
    const chapter = tourChapters[index];
    const end = tourChapters[index+1]?.start ?? last;
    const phase = (time-chapter.start)/(end-chapter.start);
    const enter = Math.min(1, (index === 0 ? .45 : 0) + phase/.23);
    const exit = Math.max(0, (phase-.75)/.25);
    const heading = title.parentElement;
    heading.style.setProperty('--shift', ((1-enter)*-30 - exit*28)+'%');
    heading.style.setProperty('--zoom', .69+.31*enter);
    heading.style.setProperty('--ink', (.62+.38*enter)*(1-exit));
    if (active !== index) {
      active = index;
      title.textContent = chapter.name;
      $('#station-label').textContent = chapter.label;
      still.src = chapter.image;
      still.alt = chapter.alt;
      buttons.forEach((b,i) => { if (i===index) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current'); });
    }
    const link = chapter.href+'?t='+time.toFixed(3);
    title.href = link;
    $('#station-service').href = link;
    $('#clock').textContent = String(index+1).padStart(2,'0')+' / 03';
    buttons.forEach((b,i) => b.style.setProperty('--progress', (i<index ? 100 : i===index ? phase*100 : 0)+'%'));
    seek();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function configureFilm() {
    showStill();
    if (!motion.matches && !film.hasAttribute('src')) film.src = 'tour.mp4';
    schedule();
  }
  for (const event of ['loadedmetadata','loadeddata','seeked','canplay']) film.addEventListener(event,seek);
  film.addEventListener('error',showStill);
  motion.addEventListener('change',configureFilm);
  buttons.forEach((b,i) => b.onclick = () => {
    const start = tourChapters[i].start;
    jump(start + ((tourChapters[i+1]?.start ?? last)-start)*.3);
  });
  const requested = new URLSearchParams(location.search).get('t');
  const legacy = services.find(s => location.hash==='#stage-'+s.id);
  if (!location.hash && requested !== null && Number.isFinite(Number(requested))) jump(Number(requested));
  if (legacy) jump(legacy.start);
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  addEventListener('pageshow',schedule);
  configureFilm();
  update();
  const slider = $('.compare input');
  slider.oninput = () => {
    $('.compare').style.setProperty('--cut', slider.value + '%');
    slider.setAttribute('aria-valuetext', slider.value + ' percent before');
  };
}

const deck = $('.offer-deck');
if (deck) {
  const controls = all('[data-card-step]');
  const cards = [...deck.children];
  function currentCard() {
    const left = deck.getBoundingClientRect().left;
    return cards.reduce((best, card, i) =>
      Math.abs(card.getBoundingClientRect().left-left) < Math.abs(cards[best].getBoundingClientRect().left-left) ? i : best, 0);
  }
  function updateButtons() {
    controls[0].disabled = deck.scrollLeft < 2;
    controls[1].disabled = deck.scrollLeft + deck.clientWidth >= deck.scrollWidth - 2;
  }
  controls.forEach(button => button.onclick = () => {
    const i = Math.max(0, Math.min(cards.length-1, currentCard() + Number(button.dataset.cardStep)));
    deck.scrollTo({left: cards[i].offsetLeft - cards[0].offsetLeft,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  deck.addEventListener('scroll', updateButtons, {passive:true});
  new ResizeObserver(updateButtons).observe(deck);
  updateButtons();
}


let renderPrices = () => {};
const servicePage = $('.detail');
if ($('.tour-track')) startTour();
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
function durationText(minutes) {
  const hours = Math.floor(minutes / 60);
  return [hours && hours + ' hr', minutes % 60 && minutes % 60 + ' min'].filter(Boolean).join(' ') || '0 min';
}
if ($('#lines')) {
  const request = $('#request');
  const preview = $('#enquiry');
  request.onclick = () => {
    preview.hidden = !preview.hidden;
    request.setAttribute('aria-expanded', String(!preview.hidden));
    if (!preview.hidden) preview.focus();
  };
  renderPrices = () => {
    const lines = $('#lines');
    lines.replaceChildren();
    for (const item of items) {
      const service = serviceById.get(item.id);
      const offer = priceFor(service, item.pack);
      const row = document.createElement('article');
      row.className = 'line';
      row.innerHTML = '<div><a href="'+(service.href || service.id+'.html')+'"><strong>'+service.title+' <i class="arrow" aria-hidden="true"></i></strong></a><small>€'+offer.price+' · '+offer.minutes+' min</small></div>';
      const select = document.createElement('select');
      select.className = 'tierSelect';
      select.setAttribute('aria-label',service.title+' package');
      service.packages.forEach(([name],i) => select.add(new Option(name, String(i), false, i === item.pack)));
      select.onchange = () => {
        mergeItems([{id:item.id,pack:Number(select.value)}],false);
        renderPrices();
        all('.line')[items.findIndex(v=>v.id===item.id)]?.querySelector('select')?.focus();
      };
      const remove = document.createElement('button');
      remove.className = 'remove';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove '+service.title);
      remove.onclick = () => { const index=items.indexOf(item); updateItems(items.filter(v => v.id !== item.id)); renderPrices(); (all('.remove')[index] || all('.remove').at(-1) || $('.estimate .pill')).focus(); };
      if (service.packages.length > 1) row.append(select);
      row.append(remove);
      lines.append(row);
    }
    if (!items.length) lines.innerHTML = '<p class="empty">Your basket is empty. Choose a service or <a class="review" href="packages.html">compare packages</a> to start.</p>';
    const total = totals(items);
    $('#sum').innerHTML = '<small>Estimated total</small><div class="price">€' + total.price + '<span>' + total.minutes + ' min</span></div>';
    $('#download').disabled = request.disabled = !items.length;
    if (!items.length) { preview.hidden = true; request.setAttribute('aria-expanded','false'); }
    const details = items.map(item => {
      const service = serviceById.get(item.id);
      const offer = priceFor(service,item.pack);
      return service.title + (service.packages.length > 1 ? ' · '+offer.name : '') + ' — €' + offer.price + ' · ' + durationText(offer.minutes);
    });
    $('#request-summary').textContent = [sizes[vehicle].name, ...details, 'Estimated total €'+total.price+' · '+durationText(total.minutes)].join('\n');
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
function refreshOffers() {
  all('[data-offer-price]').forEach(label => {
    label.textContent = '€' + priceFor(serviceById.get(label.dataset.offerPrice), 0).price;
  });
  all('[data-offer-time]').forEach(label => {
    label.textContent = durationText(priceFor(serviceById.get(label.dataset.offerTime), 0).minutes);
  });
}
all('[data-add-offer]').forEach(button => button.onclick = () => {
  const offer = serviceById.get(button.dataset.addOffer);
  // A full valet includes the mini. The two paint correction options also cover the same panels.
  const next = items.filter(item => serviceById.get(item.id)?.group !== offer.group);
  const old = items.find(item => item.id !== offer.id && serviceById.get(item.id)?.group === offer.group);
  updateItems([...next, {id:offer.id, pack:0}]);
  $('#added').textContent = old ? offer.title + ' replaces ' + serviceById.get(old.id).title + ' in your basket.'
                                : offer.title + ' saved to your basket.';
});
const offerReturn = $('[data-tour-return]');
if (offerReturn) {
  const time = new URLSearchParams(location.search).get('t');
  if (time !== null && Number.isFinite(Number(time))) offerReturn.href = 'index.html?t=' + encodeURIComponent(time);
}
const treatment = document.getElementById(location.hash.slice(1));
if (treatment?.matches('details.treatment')) treatment.open = true;

function syncControls() {
  refreshOffers();
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
