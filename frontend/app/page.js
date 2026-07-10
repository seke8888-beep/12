'use client';
import { useMemo, useState } from 'react';

const allOffers = [
  { shop: 'Kaspi', price: 7800, city: 'Алматы', delivery: 'Бесплатно', time: 'сегодня, 10:34', color: '#ef4444' },
  { shop: 'Sulpak', price: 8190, city: 'Алматы', delivery: 'от 1 000 ₸', time: 'сегодня, 09:12', color: '#f59e0b' },
  { shop: 'Белый Ветер', price: 8500, city: 'Астана', delivery: 'Бесплатно', time: 'вчера, 18:20', color: '#2563eb' },
  { shop: 'Technodom', price: 8600, city: 'Алматы', delivery: 'Бесплатно', time: 'сегодня, 08:55', color: '#e11d48' },
];
const products = [{name:'Logitech M185', brand:'Logitech', icon:'🖱️'}, {name:'Xiaomi Redmi Note 13', brand:'Xiaomi', icon:'📱'}, {name:'Apple AirPods Pro 2', brand:'Apple', icon:'🎧'}];

const money = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₸';
export default function Home() {
  const [query, setQuery] = useState('Logitech M185');
  const [selected, setSelected] = useState(products[0]);
  const [favorite, setFavorite] = useState(false);
  const results = useMemo(() => products.filter(p => (p.name+p.brand).toLowerCase().includes(query.toLowerCase())), [query]);
  const prices = allOffers.map(o=>o.price); const min=Math.min(...prices), max=Math.max(...prices), avg=Math.round(prices.reduce((a,b)=>a+b,0)/prices.length);
  return <main>
    <nav><a className="brand">baǵa<span>.</span></a><div className="links"><a>Каталог</a><a>Как это работает</a><a>Магазины</a></div><button className="login">Войти</button></nav>
    <section className="hero"><div className="eyebrow">УМНЫЙ ПОИСК ПОКУПОК</div><h1>Находите лучшее.<br/><em>Платите меньше.</em></h1><p>Сравниваем цены в магазинах Казахстана, чтобы вы всегда выбирали выгодно.</p><div className="search"><span>⌕</span><input aria-label="Поиск" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название, бренд или штрихкод"/><button>Найти цены</button></div>{query && results.length>0 && <div className="suggestions">{results.map(p=><button key={p.name} onClick={()=>{setSelected(p);setQuery(p.name)}}>{p.icon} <b>{p.name}</b><small>{p.brand}</small></button>)}</div>}</section>
    <section className="content"><div className="crumb">Главная <span>›</span> Компьютерные мыши <span>›</span> {selected.name}</div><div className="product-head"><div className="product-icon">{selected.icon}</div><div><div className="eyebrow">{selected.brand.toUpperCase()} · В НАЛИЧИИ</div><h2>{selected.name}</h2><p>Беспроводная мышь · Артикул: M185-GR</p></div><button className={'heart '+(favorite?'active':'')} onClick={()=>setFavorite(!favorite)}>{favorite?'♥':'♡'} <span>{favorite?'В избранном':'В избранное'}</span></button></div>
      <div className="stats"><article className="best"><label>ЛУЧШАЯ ЦЕНА</label><strong>{money(min)}</strong><p>в Kaspi <i>→</i></p></article><article><label>СРЕДНЯЯ ЦЕНА</label><strong>{money(avg)}</strong><p>Среди {allOffers.length} предложений</p></article><article><label>ДИАПАЗОН ЦЕН</label><strong>{money(min)} — {money(max)}</strong><p>Разница {money(max-min)}</p></article></div>
      <div className="section-title"><div><h3>Предложения магазинов</h3><p>Цены обновлены сегодня</p></div><button className="sort">По цене ↑</button></div>
      <div className="offers">{allOffers.map((o,i)=><article className="offer" key={o.shop}><div className="rank">{i+1}</div><div className="shop"><b style={{color:o.color}}>{o.shop}</b><span>★ 4.{9-i}</span></div><div className="offer-meta"><span>📍 {o.city}</span><span>◌ {o.delivery}</span></div><div className="offer-price"><strong>{money(o.price)}</strong><small>Обновлено {o.time}</small></div><button className="go">В магазин ↗</button></article>)}</div>
    </section><footer><b>baǵa<span>.</span></b><p>Ваш помощник в выгодных покупках</p><p>© 2026 Baǵa. Сделано в Казахстане 🇰🇿</p></footer>
  </main>
}
