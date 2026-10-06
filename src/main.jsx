import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import './style.css';
import './reference.css';

const telegram = 'https://t.me/amti4u';
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6" /></svg>;
const projects = [
  { title: 'StudioBook', category: 'CRM для салона · приложение для iPhone', description: 'Новая запись собирается без пересечений: клиент, услуга, подходящий мастер и только свободное время — всё в одном сценарии.', theme: 'studio', tags: ['Приложение', 'iOS', 'CRM'], kind: 'app' },
  { title: 'Élan Bloom', category: 'Сайт флористической студии', description: 'Атмосферный сайт с авторскими букетами, интерактивным цветком и формой заказа.', image: 'elan-bloom', url: 'https://elanbloom.vercel.app/', theme: 'bloom', tags: ['Сайт', 'Каталог', 'Анимация'] },
  { title: 'PRO Материалы', category: 'Сайт строительного магазина', description: 'Каталог материалов, интерактивная 3D-композиция и удобный путь от выбора до заявки.', image: 'promaterials', url: 'https://promaterials.vercel.app/', theme: 'materials', tags: ['Сайт', '3D', 'Каталог'] },
  { title: 'SOBR Detailing', category: 'Сайт детейлинг-центра', description: 'Автомобили, детали и результат работы. Сайт с 3D-моделью и интерактивным сравнением «до и после».', image: 'sobr', url: 'https://sobrdeteiling.vercel.app/', theme: 'sobr', tags: ['Сайт', '3D', 'Интерактив'] },
  { title: 'Запись без переписки', category: 'Онлайн-запись для частного мастера', description: 'Бот берёт на себя согласование времени, а мастер получает готовую запись и может заниматься клиентом, а не сообщениями.', theme: 'bot', tags: ['Telegram', 'Автоматизация'], kind: 'bot' },
];

function Hero() {
  function move(event) {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    event.currentTarget.style.setProperty('--head-x', `${x * 18}px`);
    event.currentTarget.style.setProperty('--head-y', `${y * 12}px`);
  }
  function reset(event) {
    for (const property of ['--head-x', '--head-y']) event.currentTarget.style.setProperty(property, '0px');
  }
  return <section className="hero-v2" aria-labelledby="hero-title" onPointerMove={move} onPointerLeave={reset}>
    <header className="hero-nav" id="top"><a className="wordmark" href="#top" aria-label="Маргарита — на главную">m<span>✳</span></a><nav aria-label="Основная навигация"><a href="#about">Обо мне</a><a href="#services">Услуги</a><a href="#work">Проекты</a><a href="#contact">Контакт</a></nav></header>
    <div className="hero-v2-stage">
      <h1 id="hero-title" className="hero-v2-title">HI, I'M RITA</h1>
      <img className="hero-v2-head" src="/images/margarita-3d-head.png" alt="Рисованный 3D-портрет Маргариты" width="1280" height="1280" fetchPriority="high" />
    </div>
    <div className="hero-v2-bottom"><p className="hero-v2-intro">Сайты, приложения и автоматизации, которые нужны твоему бизнесу</p><a className="hero-contact-button" href={telegram} target="_blank" rel="noreferrer">Написать мне <Arrow/></a></div>
  </section>;
}

const showcaseImages = [
  { src: '/images/elan-bloom.webp', label: 'Élan Bloom', ratio: 1272 / 716 },
  { src: '/images/promaterials.webp', label: 'PRO Материалы', ratio: 1272 / 716 },
  { src: '/images/sobr.webp', label: 'SOBR Detailing', ratio: 1280 / 720 },
  { src: '/images/studiobook-antigravity.png', label: 'StudioBook', ratio: 1206 / 2622 },
];
function Marquee() {
  const root = useRef(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = (window.scrollY - el.offsetTop + window.innerHeight) * .24;
        el.style.setProperty('--marquee-offset', `${offset}px`);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);
  const row = (items, reverse) => <div className={`showcase-track${reverse ? ' reverse' : ''}`} aria-hidden="true">{[...items, ...items, ...items].map((item, i) => <div className="showcase-tile" style={{ '--preview-ratio': item.ratio }} key={`${item.label}-${i}`}><img src={item.src} alt="" loading="lazy" /><span>{item.label}</span></div>)}</div>;
  return <section className="showcase" ref={root} aria-label="Фрагменты проектов"><div className="showcase-heading"><span>Избранные фрагменты</span><span>Листай дальше ↓</span></div>{row(showcaseImages, false)}{row([...showcaseImages].reverse(), true)}</section>;
}

const services = [
  { name: 'Сайты', description: 'Лендинги, каталоги и сайты для бизнеса с характером и понятным путём к заявке.' },
  { name: 'Приложения', description: 'Удобные приложения под вашу идею: от первого экрана до продуманного пользовательского сценария.' },
  { name: 'Боты и автоматизации', description: 'Сценарии в Telegram, которые помогают принимать записи и сокращают ручную работу.' },
];
function Services() {
  return <section className="services-section" id="services"><h2>Услуги</h2><div className="services-list">{services.map((service, i) => <div className="service-row" key={service.name}><span className="service-number">0{i + 1}</span><div><h3>{service.name}</h3><p>{service.description}</p></div></div>)}</div></section>;
}

function AppIllustration() {
  return <div className="crm-story">
    <div className="case-promise"><p className="case-audience">Для администратора салона</p><h4>Кто придёт сегодня.<br/>Когда есть окно.<br/>Что уже оплачено.</h4><p>StudioBook собирает записи и показатели дня на одном экране. При новой записи помогает выбрать услугу, мастера и свободное время.</p><p className="video-hint">Посмотрите, как это работает</p><span className="case-status">Прототип iOS-приложения</span></div>
    <figure className="crm-demo"><video controls playsInline preload="metadata" poster="/images/studiobook-antigravity.png" aria-label="Демонстрация StudioBook: рабочие экраны календаря, клиентов и аналитики"><source src="/videos/studiobook-demo.mp4" type="video/mp4"/>Ваш браузер не поддерживает видео. <a href="/videos/studiobook-demo.mp4">Скачать демонстрацию</a></video><figcaption>Экранная запись · демонстрационные данные</figcaption></figure>
  </div>;
}
function BotIllustration() {
  return <div className="bot-story">
    <div className="case-promise"><p className="case-audience">Для частного мастера</p><h4>Принимать записи, <br/>пока вы заняты <br/>с клиентом.</h4><p>Не нужно согласовывать каждое время в переписке. Бот проводит клиента от выбора услуги до подтверждения.</p></div>
    <div className="booking-flow" aria-label="Как работает запись через бота"><p className="flow-caption">Путь клиента в Telegram</p><ol><li><span>1</span><div><strong>Выбирает услугу</strong><p>Видит описание и стоимость.</p></div></li><li><span>2</span><div><strong>Находит свободное время</strong><p>Выбирает дату и доступное окно.</p></div></li><li><span>3</span><div><strong>Подтверждает запись</strong><p>Мастер получает уведомление.</p></div></li></ol><p className="flow-result">Клиент может посмотреть или отменить свой визит прямо в боте.</p></div>
  </div>;
}
function Project({ project: p, index }) {
  return <ScrollStackItem itemClassName={`project-card ${p.theme}${p.image ? ' website-project' : ''}`}><article aria-label={p.title}>
    <div className="project-heading"><span className="project-number">{String(index + 1).padStart(2, '0')}</span><div><p>{p.category}</p><h3>{p.title}</h3></div>{p.url && <a className="project-live" href={p.url} target="_blank" rel="noreferrer" aria-label={`Открыть сайт ${p.title}`}>Открыть сайт <Arrow/></a>}</div>
    <div className="project-visual">{p.image ? <a className="site-preview" href={p.url} target="_blank" rel="noreferrer" aria-label={`Посмотреть ${p.title}`}><img src={`/images/${p.image}.webp`} alt={`Первый экран сайта ${p.title}`} width="1272" height="716" loading="lazy" /></a> : p.kind === 'app' ? <AppIllustration/> : <BotIllustration/>}</div>
    <div className="project-bottom"><p>{p.description}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div>
  </article></ScrollStackItem>;
}
function App() {
  return <><a href="#main" className="skip-link">К содержимому</a><main id="main"><Hero /><Marquee />
    <section className="about" id="about"><span className="about-sticker sticker-moon" aria-hidden="true"/><span className="about-sticker sticker-cube" aria-hidden="true"/><span className="about-sticker sticker-smile" aria-hidden="true"/><span className="about-sticker sticker-pointer" aria-hidden="true"/><img className="about-flower" src="/images/leopard-flower.png" alt="" aria-hidden="true" loading="lazy"/><h2>Обо мне</h2><div className="about-copy"><p className="about-kicker">Привет, я Маргарита</p><p className="about-intro">Мне нравится превращать идеи в то, чем можно пользоваться каждый день</p><p>Создаю выразительные сайты, удобные приложения и Telegram-ботов для автоматизации отдельных задач. В каждом проекте ищу форму, которая подходит именно его цели.</p></div><a className="hero-contact-button" href={telegram} target="_blank" rel="noreferrer">Написать мне <Arrow/></a></section>
    <Services />
    <section className="work" id="work"><div className="section-heading"><h2>Проекты</h2><p>Сайты, приложение и автоматизация для разных задач</p></div><ScrollStack>{projects.map((p, index)=><Project project={p} index={index} key={p.title}/>)}</ScrollStack></section></main>
    <footer className="portfolio-footer" id="contact"><div><a className="footer-name" href="#top">m✳</a><p>Есть идея? Давайте сделаем её работающей</p></div><a className="hero-contact-button" href={telegram} target="_blank" rel="noreferrer">Написать в Telegram <Arrow/></a><a href="#top">Наверх ↑</a></footer></>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
