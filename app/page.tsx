'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// ─── TYPES ───────────────────────────────────────────────
interface CartItem { id: string; name: string; price: number; size?: string; qty: number }
interface MenuItem { id: string; nr?: number; name: string; desc?: string; pS?: number; pL?: number; p?: number; cat: string; hot?: boolean }

// ─── MENU DATA ───────────────────────────────────────────
const MENU: MenuItem[] = [
  // KEBAB
  { id:'k1', nr:1, name:'Kebab mit Kalbfleisch', desc:'Fladenbrot, Kebabfleisch, Salat, Zwiebeln, Tzaziki', pS:7.50, pL:9.50, cat:'kebab', hot:true },
  { id:'k2', nr:2, name:'Kebabrolle', desc:'geh. Salat, Zwiebeln und Tzaziki', pS:6.00, pL:7.00, cat:'kebab' },
  { id:'k3', nr:3, name:'Kebabrolle mit Fetakäse', desc:'Fetakäse, Oliven, Zwiebeln und Tzaziki', pS:7.00, pL:9.50, cat:'kebab' },
  { id:'k4', nr:4, name:'Falafel', desc:'Gemischter Salat, Zwiebeln und Tzaziki', pS:6.00, pL:7.50, cat:'kebab' },
  { id:'k5', nr:5, name:'Kebabbox', pS:6.50, pL:9.50, cat:'kebab' },
  { id:'k6', nr:6, name:'Türkische Pizza', pS:6.50, pL:7.50, cat:'kebab' },
  { id:'k7', nr:7, name:'Türk. Pizza mit Kebabfleisch', pS:6.50, pL:9.50, cat:'kebab' },
  { id:'k8', nr:8, name:'Hähnchenpizza', desc:'Hähnchenfleisch, Tzaziki und Zwiebeln', pS:6.50, pL:9.50, cat:'kebab' },
  { id:'k9', nr:9, name:'Kebabteller', desc:'Kebabfleisch, Pommes, Salat, Zwiebeln und Tzaziki', pS:9.00, pL:12.00, cat:'kebab', hot:true },
  { id:'k9a', nr:9, name:'Kebabteller überbacken', desc:'Kebabfleisch mit Käse überbacken und Salat', p:11.00, cat:'kebab' },
  { id:'k10', nr:10, name:'Grillteller', desc:'Pommes, Salat, Tzaziki, Fetakäse und Zwiebeln', p:13.00, cat:'kebab', hot:true },
  { id:'k9b', name:'Taxiteller', desc:'Kebabfleisch, Currywurst mit Pommes, Tzaziki', p:12.50, cat:'kebab' },
  // PIZZA
  { id:'p40', nr:40, name:'Margherita', desc:'Tomatensauce und Käse', pS:5.50, pL:7.50, cat:'pizza' },
  { id:'p41', nr:41, name:'Salami', desc:'mit Formfleischenschinken', pS:6.50, pL:8.50, cat:'pizza', hot:true },
  { id:'p42', nr:42, name:'Schinken', pS:6.50, pL:8.50, cat:'pizza' },
  { id:'p43', nr:43, name:'Funghi', pS:6.50, pL:8.50, cat:'pizza' },
  { id:'p44', nr:44, name:'Thunfisch', desc:'mit Thunfisch und Zwiebeln', pS:6.50, pL:8.50, cat:'pizza' },
  { id:'p45', nr:45, name:'Broccoli', pS:6.50, pL:8.50, cat:'pizza' },
  { id:'p46', nr:46, name:'Spinat', pS:6.50, pL:8.50, cat:'pizza' },
  { id:'p47', nr:47, name:'Paprika', pS:6.50, pL:8.50, cat:'pizza' },
  { id:'p48', nr:48, name:'Bolognese', desc:'mit Hackfleischsauce', pS:7.00, pL:9.50, cat:'pizza' },
  { id:'p49', nr:49, name:'Scampi', desc:'mit Krabben', pS:8.00, pL:10.00, cat:'pizza' },
  { id:'p50', nr:50, name:'Frutti di Mare', desc:'mit Meeresfrüchten', pS:8.00, pL:10.00, cat:'pizza' },
  { id:'p51', nr:51, name:'Kebabpizza', desc:'Kebabfleisch und Zwiebeln', pS:8.00, pL:10.00, cat:'pizza', hot:true },
  { id:'p52', nr:52, name:'Hähnchenpizza', desc:'Hähnchenfleisch, Zwiebeln und Paprika', pS:8.00, pL:10.50, cat:'pizza' },
  { id:'p53', nr:53, name:'Rustica', desc:'Salami, Schinken, Thunfisch, Pilze und Fetakäse', pS:7.50, pL:9.50, cat:'pizza' },
  { id:'p54', nr:54, name:'Hawaii', desc:'mit Schinken und Ananas', pS:7.50, pL:9.50, cat:'pizza' },
  { id:'p55', nr:55, name:'Mozzarella', desc:'mit frischen Tomaten', pS:8.00, pL:10.00, cat:'pizza' },
  { id:'p57', nr:57, name:'Vegetaria', desc:'Broccoli, Spinat, Paprika, Pilze, Zwiebeln, Mais', pS:8.00, pL:10.50, cat:'pizza' },
  { id:'p58', nr:58, name:'Diavola (scharf)', desc:'Schinken, Pilze, Paprika', pS:8.00, pL:10.50, cat:'pizza', hot:true },
  { id:'p60', nr:60, name:'Hollandaise Royal', desc:'Sauce Hollandaise, Hähnchen, Broccoli und Mais', pS:8.00, pL:10.50, cat:'pizza' },
  { id:'p61', nr:61, name:'El-Nurki', desc:'Kebabfleisch, Zwiebeln, Fetakäse, Sauce Hollandaise', pS:8.00, pL:10.50, cat:'pizza' },
  { id:'p62', nr:62, name:'El Simon', desc:'Kebabfleisch, Schinken, Broccoli, Fetakäse, Hollandaise', pS:8.00, pL:10.50, cat:'pizza' },
  // TASCHENPIZZA
  { id:'t65', nr:65, name:'Calzone', desc:'Schinken, Salami und Pilze', pS:8.00, pL:9.50, cat:'tasche' },
  { id:'t66', nr:66, name:'Calzone Spezial', desc:'Schinken, Thunfisch, Zwiebeln, Pilze, Fetakäse', pS:8.00, pL:10.50, cat:'tasche' },
  { id:'t67', nr:67, name:'Kebab-Taschenpizza', desc:'Kebabfleisch, Zwiebeln und Paprika', pS:8.00, pL:10.50, cat:'tasche', hot:true },
  { id:'t68', nr:68, name:'Hähnchen-Taschenpizza', desc:'Hähnchenfleisch, Zwiebeln und Paprika', pS:8.00, pL:10.50, cat:'tasche' },
  // PARTYPIZZA
  { id:'pp1', name:'Partypizza 40×60cm', desc:'Tomatensauce und Käse – jede weitere Zutat +1,00 €', p:21.00, cat:'party', hot:true },
  { id:'pp2', name:'Pizzabrötchen 10 Stück', p:4.50, cat:'party' },
  { id:'pp3', name:'Gefüllte Pizzabrötchen 10 Stück', p:7.50, cat:'party' },
  // WRAPS
  { id:'w70', nr:70, name:'Hawaii Wrap', desc:'Ananas, Salat, Zwiebeln, Tzaziki mit Gouda überbacken', pS:7.00, pL:8.00, cat:'wraps' },
  { id:'w71', nr:71, name:'Käse Wrap', desc:'Salat, Tzaziki mit Gouda und Fetakäse überbacken', pS:7.00, pL:8.00, cat:'wraps' },
  { id:'w72', nr:72, name:'Thunfisch Wrap', desc:'Thunfisch, Salat, Zwiebeln, Tzaziki und Gouda', pS:7.50, pL:9.50, cat:'wraps' },
  { id:'w73', nr:73, name:'Hähnchen Wrap', desc:'Hähnchenfleisch, Zwiebeln, Tzaziki und Gouda', pS:7.50, pL:9.50, cat:'wraps', hot:true },
  // IMBISS
  { id:'i11', nr:11, name:'Pommes Frites', pS:3.50, pL:4.50, cat:'imbiss' },
  { id:'i12', nr:12, name:'Pommes Frites Spezial', pS:4.50, pL:5.00, cat:'imbiss' },
  { id:'i14', nr:14, name:'Wedges', p:5.00, cat:'imbiss' },
  { id:'i15', nr:15, name:'Currywurst', p:4.50, cat:'imbiss' },
  { id:'i16', nr:16, name:'Bratwurst', p:4.50, cat:'imbiss' },
  { id:'i19', nr:19, name:'Wiener Schnitzel', p:8.50, cat:'imbiss' },
  { id:'i20', nr:20, name:'Hähnchenschnitzel', p:6.50, cat:'imbiss' },
  { id:'i23', nr:23, name:'Hollandaise Schnitzel', p:10.00, cat:'imbiss' },
  { id:'i24', nr:24, name:'Hawaii Schnitzel', p:10.00, cat:'imbiss' },
  { id:'i27', nr:27, name:'Cheeseburger', p:5.00, cat:'imbiss' },
  { id:'i29', nr:29, name:'Cheeseburger XL', p:6.50, cat:'imbiss' },
  { id:'i36', nr:36, name:'Chicken Nuggets', desc:'5 Stk. 5,00 € / 10 Stk. 7,00 €', p:5.00, cat:'imbiss' },
  // SALATE
  { id:'s75', nr:75, name:'Gemischter Salat', desc:'Eisbergsalat, Tomaten, Gurken, Paprika und Mais', pS:6.00, pL:7.00, cat:'salate' },
  { id:'s78', nr:78, name:'Thunfischsalat', desc:'Eisbergsalat, Gurken, Thunfisch, Zwiebeln, Ei und Käse', pS:7.00, pL:8.50, cat:'salate' },
  { id:'s79', nr:79, name:'Bauernsalat', desc:'Eisbergsalat, Tomaten, Gurken, Paprika, Oliven, Fetakäse', pS:7.00, pL:8.50, cat:'salate' },
  { id:'s80', nr:80, name:'Californiasalat', desc:'Eisbergsalat, Tomaten, Gurken, Hähnchen, Paprika und Mais', pS:7.00, pL:9.00, cat:'salate' },
  { id:'s81', nr:81, name:'Istanbulsalat', desc:'Eisbergsalat, Tomaten, Kebabfleisch, Zwiebeln, Fetakäse', pS:7.00, pL:9.00, cat:'salate', hot:true },
  { id:'s82', nr:82, name:'Mozzarella Salat', desc:'Eisbergsalat, Tomaten, Gurken, Mozzarella und Oliven', pS:6.50, pL:8.50, cat:'salate' },
  // NUDELN
  { id:'n85', nr:85, name:'Spaghetti Napoli', desc:'mit Tomatensauce', p:9.00, cat:'nudeln' },
  { id:'n86', nr:86, name:'Spaghetti Bolognese', desc:'mit Hackfleischsauce', p:10.00, cat:'nudeln', hot:true },
  { id:'n87', nr:87, name:'Spaghetti Carbonara', p:11.00, cat:'nudeln' },
  { id:'n88', nr:88, name:'Maccheroni Vegetaria', desc:'mit Gemüse, Spinat und Tomatensauce', p:11.00, cat:'nudeln' },
  { id:'n89', nr:89, name:'Maccheroni California', desc:'mit Hähnchen, Pilzen, Mais und Sahnesauce', p:11.50, cat:'nudeln' },
  { id:'n92', nr:92, name:'Spaghetti al Scampi', desc:'mit Scampi und Pilzen in Sahnesauce', p:12.00, cat:'nudeln' },
  // GETRÄNKE
  { id:'g1', nr:101, name:'Cola / Fanta / Sprite 0,33l', p:2.50, cat:'drinks' },
  { id:'g2', nr:102, name:'Cola / Fanta / Sprite 1l', p:3.50, cat:'drinks' },
  { id:'g3', nr:103, name:'Wasser 0,5l', p:2.00, cat:'drinks' },
  { id:'g4', nr:104, name:'Ayran 0,2l', p:2.00, cat:'drinks' },
  // SOSSEN
  { id:'ss1', name:'Mayonnaise', p:0.50, cat:'sossen' },
  { id:'ss2', name:'Ketchup', p:0.50, cat:'sossen' },
  { id:'ss3', name:'Jägersauce', p:1.00, cat:'sossen' },
  { id:'ss4', name:'Paprikasauce', p:1.00, cat:'sossen' },
  { id:'ss5', name:'Hollandaise', p:1.00, cat:'sossen' },
  { id:'ss6', name:'Tzaziki', p:1.00, cat:'sossen' },
  { id:'ss7', name:'Tzaziki gr. Schale', p:1.50, cat:'sossen' },
  { id:'ss8', name:'Knoblauchsauce', p:1.00, cat:'sossen' },
  { id:'ss9', name:'Knoblauchsauce gr. Schale', p:1.50, cat:'sossen' },
  { id:'ss10', name:'Kräuterbutter', p:1.00, cat:'sossen' },
]

const CATS = [
  { id:'kebab',  label:'Kebab',       icon:'🥙' },
  { id:'pizza',  label:'Pizza',       icon:'🍕' },
  { id:'tasche', label:'Taschenpizza',icon:'🫓' },
  { id:'party',  label:'Partypizza',  icon:'🎉' },
  { id:'wraps',  label:'Wraps',       icon:'🌯' },
  { id:'imbiss', label:'Imbiss',      icon:'🍟' },
  { id:'salate', label:'Salate',      icon:'🥗' },
  { id:'nudeln', label:'Nudeln',      icon:'🍝' },
  { id:'sossen', label:'Soßen',       icon:'🫙' },
  { id:'drinks', label:'Getränke',    icon:'🥤' },
]

const OFFERS = [
  { day:'Dienstag',   offer:'Gr. Pizza + Getränk',                            price:10 },
  { day:'Mittwoch',   offer:'Schnitzel nach Wahl + Pommes + Getränk',          price:12 },
  { day:'Donnerstag', offer:'Gr. Kebab + Getränk',                            price:10 },
  { day:'Freitag',    offer:'1× Familien-Blech + 1× Zutat + Salat + Getränk', price:31 },
]

// ─── STYLES ──────────────────────────────────────────────
const S = {
  gold:'#E8971F', goldL:'#F5B942', brown:'#3D1F0A', brownM:'#6B3A1F',
  brownL:'#A0522D', dark:'#1A0A00', cream:'#FDF8F0', creamD:'#F0E8D0',
  white:'#FFFFFF', green:'#22c55e',
}

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCat, setActiveCat] = useState('kebab')
  const [activePage, setActivePage] = useState<'home'|'menu'|'order'|'done'>('home')
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [orderType, setOrderType] = useState<'delivery'|'pickup'>('delivery')
  const [orderStep, setOrderStep] = useState<'cart'|'form'|'confirm'>('cart')
  const [form, setForm] = useState({ name:'', phone:'', street:'', city:'Klein Reken', note:'' })
  const [addedId, setAddedId] = useState<string|null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const total = cart.reduce((s,i) => s + i.price * i.qty, 0)
  const count = cart.reduce((s,i) => s + i.qty, 0)

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).style.opacity = '1', (e.target as HTMLElement).style.transform = 'translateY(0)' })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [activePage])

  function addToCart(item: MenuItem, size: 'S'|'L'|null) {
    const price = item.p ?? (size === 'S' ? item.pS : item.pL) ?? 0
    const sizeLabel = size ? (size === 'S' ? 'Klein' : 'Groß') : undefined
    const key = item.id + (sizeLabel || '')
    setCart(prev => {
      const ex = prev.find(c => c.id === key)
      if (ex) return prev.map(c => c.id === key ? { ...c, qty: c.qty+1 } : c)
      return [...prev, { id:key, name:item.name, price, size:sizeLabel, qty:1 }]
    })
    setAddedId(key)
    setTimeout(() => setAddedId(null), 1200)
  }

  function changeQty(id: string, delta: number) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty+delta } : c).filter(c => c.qty > 0))
  }

  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Nunito',sans-serif;background:${S.cream};color:${S.dark};overflow-x:hidden}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${S.gold};border-radius:2px}
    @keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    .btn-gold{background:linear-gradient(90deg,#c4780f,${S.gold},${S.goldL},${S.gold},#c4780f);background-size:300%;animation:shimmer 3s linear infinite;color:${S.dark};font-weight:800;border:none;cursor:pointer;transition:transform .15s,box-shadow .15s;font-family:'Nunito',sans-serif}
    .btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(232,151,31,.4)}
    .btn-gold:active{transform:scale(.97)}
    .btn-dark{background:${S.brown};color:${S.gold};border:none;cursor:pointer;font-weight:700;font-family:'Nunito',sans-serif;transition:all .2s}
    .btn-dark:hover{background:${S.brownM}}
    .btn-ghost{background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.3);cursor:pointer;font-weight:700;font-family:'Nunito',sans-serif;backdrop-filter:blur(8px);transition:all .2s}
    .btn-ghost:hover{background:rgba(255,255,255,.18)}
    .reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
    .cat-scroll{scrollbar-width:none}.cat-scroll::-webkit-scrollbar{display:none}
    .drawer{transform:translateY(100%);transition:transform .38s cubic-bezier(.32,.72,0,1)}
    .drawer.open{transform:translateY(0)}
    .card{transition:transform .25s,box-shadow .25s}.card:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(61,31,10,.15)}
    input,textarea{font-family:'Nunito',sans-serif;outline:none}
    a{color:inherit;text-decoration:none}
  `

  // ── NAVBAR ──
  const Navbar = () => (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
      background: navScrolled || activePage !== 'home' ? 'rgba(26,10,0,.97)' : 'transparent',
      backdropFilter: navScrolled ? 'blur(16px)' : 'none',
      boxShadow: navScrolled ? '0 2px 24px rgba(0,0,0,.4)' : 'none',
      transition:'all .3s' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button onClick={() => setActivePage('home')} style={{ display:'flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer' }}>
          <Image src="/images/logo.png" alt="Rekener Grill" width={42} height={42} style={{ borderRadius:'50%', objectFit:'cover' }} />
          <div style={{ textAlign:'left' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, fontWeight:700, color:S.gold, lineHeight:1 }}>Rekener Grill</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.45)', letterSpacing:'0.08em', marginTop:2 }}>PIZZA & GRILL</div>
          </div>
        </button>

        {/* Desktop links */}
        <div style={{ display:'flex', gap:28, alignItems:'center' }}>
          {[['home','Start'],['menu','Speisekarte']].map(([pg,label]) => (
            <button key={pg} onClick={() => setActivePage(pg as 'home'|'menu')} style={{
              background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:700,
              color: activePage === pg ? S.gold : 'rgba(255,255,255,.7)',
              fontFamily:'Nunito,sans-serif',
              borderBottom: activePage === pg ? `2px solid ${S.gold}` : '2px solid transparent',
              paddingBottom:2, transition:'color .2s'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {/* Cart */}
          <button onClick={() => setCartOpen(true)} style={{
            position:'relative', width:44, height:44, borderRadius:'50%',
            background:'rgba(232,151,31,.15)', border:`1.5px solid rgba(232,151,31,.35)`,
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span style={{ position:'absolute', top:-4, right:-4, background:S.gold, color:S.dark, borderRadius:'50%', width:19, height:19, fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{count}</span>}
          </button>
          {/* Hamburger */}
          <button onClick={() => setMobileNav(!mobileNav)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', flexDirection:'column', gap:5 }}>
            {[0,1,2].map(i => <span key={i} style={{ display:'block', width:22, height:2, background:'white', borderRadius:1, transition:'all .25s',
              transform: mobileNav && i===0 ? 'rotate(45deg) translate(5px,5px)' : mobileNav && i===2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
              opacity: mobileNav && i===1 ? 0 : 1 }} />)}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div style={{ overflow:'hidden', maxHeight: mobileNav ? 280 : 0, transition:'max-height .3s ease', background:'rgba(26,10,0,.98)' }}>
        <div style={{ padding:'8px 20px 20px', display:'flex', flexDirection:'column', gap:4 }}>
          {[['home','Start'],['menu','Speisekarte'],['order','Bestellen']].map(([pg,label]) => (
            <button key={pg} onClick={() => { setActivePage(pg as 'home'|'menu'|'order'); setMobileNav(false) }}
              style={{ padding:'13px 16px', borderRadius:14, fontWeight:700, fontSize:15, color: activePage===pg ? S.gold : 'rgba(255,255,255,.8)',
                background: activePage===pg ? 'rgba(232,151,31,.1)' : 'transparent', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'Nunito,sans-serif' }}>
              {label}
            </button>
          ))}
          <a href="tel:028648856030" style={{ padding:'13px 16px', borderRadius:14, fontWeight:700, fontSize:15, color:'rgba(255,255,255,.8)', display:'block' }}>
            02864 / 8856030
          </a>
        </div>
      </div>
    </nav>
  )

  // ── CART DRAWER ──
  const CartDrawer = () => (
    <>
      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', backdropFilter:'blur(4px)', zIndex:200 }} />}
      <div className={`drawer ${cartOpen ? 'open':''}`} style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201,
        background:`linear-gradient(180deg,#2A1005 0%,${S.dark} 100%)`, borderRadius:'24px 24px 0 0',
        maxHeight:'85vh', display:'flex', flexDirection:'column', boxShadow:'0 -8px 48px rgba(0,0,0,.5)' }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'rgba(255,255,255,.2)' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 20px 14px' }}>
          <div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:'white' }}>Warenkorb</div>
            <div style={{ fontSize:12, color:S.gold, marginTop:2 }}>{count} Artikel</div>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,.08)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0 16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,.35)', fontSize:14 }}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" style={{ margin:'0 auto 12px', display:'block', opacity:.3 }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Dein Warenkorb ist leer
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8, paddingBottom:12 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:16, background:'rgba(232,151,31,.07)', border:'1px solid rgba(232,151,31,.12)' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                    {item.size && <div style={{ fontSize:11, color:S.gold, marginTop:2 }}>{item.size}</div>}
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.45)', marginTop:2 }}>{(item.price*item.qty).toFixed(2)} €</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <button onClick={() => changeQty(item.id,-1)} style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,.08)', border:'none', color:'white', fontWeight:800, fontSize:18, cursor:'pointer', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                    <span style={{ color:'white', fontWeight:800, width:18, textAlign:'center' }}>{item.qty}</span>
                    <button onClick={() => changeQty(item.id,1)} style={{ width:30, height:30, borderRadius:'50%', background:S.gold, border:'none', color:S.dark, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding:'14px 20px 28px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
            {total < 15 && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, marginBottom:14, background:'rgba(232,151,31,.1)', color:S.gold, fontSize:12, fontWeight:600 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h5l2 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Noch <strong style={{ marginLeft:3 }}>{(15-total).toFixed(2)} €</strong>&nbsp;bis Mindestbestellwert
              </div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
              <span style={{ color:'rgba(255,255,255,.6)', fontWeight:600, fontSize:14 }}>Gesamt</span>
              <span style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, color:S.gold }}>{total.toFixed(2)} €</span>
            </div>
            <button className="btn-gold" onClick={() => { setCartOpen(false); setActivePage('order'); setOrderStep('cart') }}
              style={{ width:'100%', padding:16, borderRadius:16, fontSize:16 }}>Zur Kasse →</button>
          </div>
        )}
      </div>
    </>
  )

  // ── FLOATING CART ──
  const FloatingCart = () => count > 0 ? (
    <div style={{ position:'fixed', bottom:20, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 32px)', maxWidth:560, zIndex:150 }}>
      <button className="btn-gold" onClick={() => setCartOpen(true)}
        style={{ width:'100%', padding:'14px 20px', borderRadius:18, fontSize:15, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 -4px 24px rgba(61,31,10,.2)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:28, height:28, background:S.dark, color:S.gold, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800 }}>{count}</span>
          <span>Warenkorb anzeigen</span>
        </div>
        <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:17 }}>{total.toFixed(2)} €</span>
      </button>
    </div>
  ) : null

  // ── HOME PAGE ──
  const HomePage = () => (
    <main>
      {/* HERO */}
      <section style={{ position:'relative', height:'100vh', minHeight:600, overflow:'hidden' }}>
        <video autoPlay muted loop playsInline src="/videos/hero.mp4"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(26,10,0,.78) 0%,rgba(26,10,0,.45) 50%,rgba(26,10,0,.7) 100%)' }} />
        {/* Gold glow */}
        <div style={{ position:'absolute', bottom:'15%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(232,151,31,.18) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 24px 60px', maxWidth:1000, margin:'0 auto', width:'100%' }}>
          {/* Status */}
          <div style={{ marginBottom:18, animation:'fadeUp .6s .1s both' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(34,197,94,.12)', border:'1px solid rgba(34,197,94,.35)', color:'#4ade80', borderRadius:100, padding:'6px 16px', fontSize:11, fontWeight:700, letterSpacing:'0.06em' }}>
              <span style={{ width:7, height:7, background:'#4ade80', borderRadius:'50%', animation:'pulse 1.8s infinite' }} />
              JETZT GEÖFFNET · LIEFERUNG AB 15 €
            </span>
          </div>

          {/* Logo + Headline */}
          <div style={{ display:'flex', alignItems:'flex-end', gap:20, marginBottom:20, animation:'fadeUp .6s .25s both' }}>
            <Image src="/images/logo.png" alt="Rekener Grill Logo" width={120} height={120}
              style={{ borderRadius:'50%', border:'3px solid rgba(232,151,31,.5)', boxShadow:'0 0 40px rgba(232,151,31,.3)', animation:'floatY 4s ease-in-out infinite', flexShrink:0 }} />
            <div>
              <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(52px,9vw,100px)', fontWeight:900, color:'white', lineHeight:1 }}>Rekener</h1>
              <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(52px,9vw,100px)', fontWeight:900, lineHeight:1,
                background:'linear-gradient(135deg,#E8971F 0%,#F5B942 50%,#C4780F 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Grill</h1>
            </div>
          </div>

          <p style={{ color:'rgba(255,255,255,.6)', fontSize:16, fontWeight:600, marginBottom:28, letterSpacing:'0.04em', animation:'fadeUp .6s .4s both' }}>
            Pizza · Kebab · Grill · Klein Reken
          </p>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap', animation:'fadeUp .6s .55s both' }}>
            <button className="btn-gold" onClick={() => setActivePage('order')}
              style={{ padding:'15px 32px', borderRadius:16, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Jetzt bestellen
            </button>
            <button className="btn-ghost" onClick={() => setActivePage('menu')}
              style={{ padding:'15px 32px', borderRadius:16, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
              Speisekarte
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:.35, pointerEvents:'none' }}>
          <span style={{ fontSize:9, color:'white', letterSpacing:'0.2em', textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:1, height:36, background:'linear-gradient(to bottom,white,transparent)' }} />
        </div>
      </section>

      {/* TAGESANGEBOTE */}
      <section style={{ background:S.dark, padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:40 }}>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:'0.15em', color:S.gold, textTransform:'uppercase', marginBottom:8 }}>Di – Fr · Nur Selbstabholer</p>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,5vw,48px)', color:'white', fontWeight:700 }}>Tagesangebote</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:14 }}>
            {OFFERS.map((o, i) => (
              <div key={o.day} className={`reveal card`} style={{ background:`linear-gradient(135deg,${i%2===0?S.brown:'#2A1005'} 0%,${S.dark} 100%)`, border:`1px solid rgba(232,151,31,.18)`, borderRadius:20, padding:24, transitionDelay:`${i*.08}s` }}>
                <p style={{ fontSize:11, fontWeight:800, color:S.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>{o.day}</p>
                <p style={{ color:'rgba(255,255,255,.8)', fontSize:13, fontWeight:600, lineHeight:1.5, marginBottom:16 }}>{o.offer}</p>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:40, fontWeight:900, color:S.gold }}>{o.price} €</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BELIEBT */}
      <section style={{ background:S.cream, padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:40 }}>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:'0.15em', color:S.gold, textTransform:'uppercase', marginBottom:8 }}>Unsere Klassiker</p>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,5vw,48px)', color:S.brown, fontWeight:700 }}>Beliebt & Lecker</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {MENU.filter(m => m.hot).slice(0,6).map((item, i) => (
              <div key={item.id} className="reveal card" style={{ background:'white', borderRadius:18, padding:18, border:'1.5px solid rgba(61,31,10,.08)', display:'flex', gap:14, alignItems:'center', transitionDelay:`${i*.07}s` }}>
                <div style={{ width:48, height:48, borderRadius:12, background:'rgba(232,151,31,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 }}>
                  {CATS.find(c=>c.id===item.cat)?.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                    <span style={{ fontWeight:800, fontSize:14, color:S.brown, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{item.name}</span>
                    <span style={{ background:S.gold, color:S.dark, borderRadius:100, padding:'2px 8px', fontSize:9, fontWeight:800, flexShrink:0 }}>TOP</span>
                  </div>
                  {item.desc && <p style={{ fontSize:11, color:S.brownM, lineHeight:1.4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as const }}>{item.desc}</p>}
                </div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, fontWeight:700, color:S.brown, flexShrink:0 }}>ab {(item.p??item.pS??0).toFixed(2)} €</div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign:'center', marginTop:32 }}>
            <button className="btn-gold" onClick={() => setActivePage('menu')} style={{ padding:'14px 40px', borderRadius:16, fontSize:15 }}>Alle Gerichte ansehen →</button>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section style={{ background:S.brown, padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {[
              { icon:<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h5l2 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, title:'Lieferservice', lines:['Klein Reken','Lembeck · Groß Reken','Maria Veen · ab 15 €'] },
              { icon:<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title:'Öffnungszeiten', lines:['Mo–Do 10:30–21:30','Fr & Sa 10:00–22:00','So & Feiertag 12:00–21:30'] },
              { icon:<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.9 1.19a2 2 0 012-1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.02z"/></svg>, title:'Telefon', lines:['02864 / 8856030'] },
              { icon:<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, title:'Adresse', lines:['Dorfstr. 9','48734 Klein Reken'] },
            ].map((c,i) => (
              <div key={c.title} className="reveal" style={{ background:'rgba(232,151,31,.07)', border:'1px solid rgba(232,151,31,.15)', borderRadius:20, padding:'24px 20px', transitionDelay:`${i*.08}s` }}>
                <div style={{ marginBottom:12 }}>{c.icon}</div>
                <h3 style={{ fontSize:11, fontWeight:800, color:S.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>{c.title}</h3>
                {c.lines.map(l => <p key={l} style={{ fontSize:13, color:'rgba(255,255,255,.6)', lineHeight:1.7 }}>{l}</p>)}
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop:40, textAlign:'center' }}>
            <a href="tel:028648856030" className="btn-gold" style={{ padding:'15px 48px', borderRadius:16, fontSize:16, display:'inline-flex', alignItems:'center', gap:10 }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.9 1.19a2 2 0 012-1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.02z"/></svg>
              Jetzt anrufen
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#0D0500', padding:'36px 24px', textAlign:'center' }}>
        <Image src="/images/logo.png" alt="Logo" width={48} height={48} style={{ borderRadius:'50%', marginBottom:12, opacity:.7 }} />
        <p style={{ fontFamily:'Playfair Display,serif', fontSize:16, color:S.gold, fontWeight:700, marginBottom:8 }}>Rekener Grill</p>
        <p style={{ fontSize:11, color:'rgba(255,255,255,.3)', lineHeight:1.8 }}>Dorfstr. 9 · 48734 Klein Reken · 02864/8856030<br/>Alle Preise inkl. MwSt. · Konservierung und Zusatzstoffe auf Anfrage</p>
        <p style={{ fontSize:10, color:'rgba(255,255,255,.15)', marginTop:16 }}>© 2025 Rekener Grill · Pizza & Grill</p>
      </footer>
    </main>
  )

  // ── MENU PAGE ──
  const MenuPage = () => {
    const items = MENU.filter(m => m.cat === activeCat)
    return (
      <main style={{ paddingTop:60 }}>
        <div style={{ background:'linear-gradient(160deg,#1A0A00 0%,#3D1F0A 100%)', padding:'28px 24px 20px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:'0.15em', color:S.gold, textTransform:'uppercase', marginBottom:6 }}>Rekener Grill</p>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(26px,5vw,44px)', fontWeight:900, color:'white', marginBottom:20 }}>Speisekarte</h1>
          </div>
        </div>

        {/* Category tabs */}
        <div className="cat-scroll" ref={menuRef} style={{ background:'#2A1005', overflowX:'auto', position:'sticky', top:60, zIndex:40, boxShadow:'0 4px 20px rgba(0,0,0,.25)' }}>
          <div style={{ display:'flex', gap:6, padding:'10px 16px', width:'max-content', minWidth:'100%' }}>
            {CATS.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:12, fontSize:13, fontWeight:700, border:'none', cursor:'pointer', whiteSpace:'nowrap', fontFamily:'Nunito,sans-serif',
                  background: activeCat===cat.id ? S.gold : 'rgba(232,151,31,.1)',
                  color: activeCat===cat.id ? S.dark : 'rgba(255,255,255,.6)' }}>
                <span>{cat.icon}</span>{cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 20px 120px' }}>
          {(activeCat==='pizza'||activeCat==='tasche') && (
            <div style={{ marginBottom:18, padding:'11px 16px', borderRadius:12, fontSize:12, fontWeight:600, background:'rgba(232,151,31,.08)', color:S.brownL, border:'1px solid rgba(232,151,31,.18)' }}>
              Klein ø 22 cm · Groß ø 28 cm · Käserand +3,00 € · Jeder weitere Belag +1,00 €
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:13 }}>
            {items.map(item => <MenuItemCard key={item.id} item={item} />)}
          </div>
        </div>
      </main>
    )
  }

  // ── MENU ITEM CARD ──
  const MenuItemCard = ({ item }: { item: MenuItem }) => {
    const hasSize = !!(item.pS && item.pL)
    const [sel, setSel] = useState<'S'|'L'>('S')
    const price = item.p ?? (sel==='S' ? item.pS : item.pL) ?? 0
    const key = item.id + (hasSize ? sel : '')
    const isAdded = addedId === key
    return (
      <div className="card" style={{ background:'white', borderRadius:18, padding:17, border:'1.5px solid rgba(61,31,10,.08)', display:'flex', flexDirection:'column', gap:11 }}>
        <div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:6 }}>
            {item.nr && <span style={{ fontSize:10, fontWeight:800, background:'rgba(232,151,31,.12)', color:S.brownL, padding:'2px 8px', borderRadius:6 }}>Nr. {item.nr}</span>}
            {item.hot && <span style={{ fontSize:10, fontWeight:800, background:S.gold, color:S.dark, padding:'2px 10px', borderRadius:100 }}>Beliebt</span>}
          </div>
          <h3 style={{ fontWeight:800, fontSize:14, color:S.brown, lineHeight:1.2 }}>{item.name}</h3>
          {item.desc && <p style={{ fontSize:11, color:S.brownM, marginTop:4, lineHeight:1.5 }}>{item.desc}</p>}
        </div>
        {hasSize && (
          <div style={{ display:'flex', gap:6 }}>
            {(['S','L'] as const).map(s => (
              <button key={s} onClick={() => setSel(s)} style={{ flex:1, padding:'7px 4px', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif',
                background: sel===s ? S.brown : 'rgba(61,31,10,.06)',
                color: sel===s ? S.gold : S.brownM, border:'none' }}>
                {s==='S' ? `Klein ${item.pS?.toFixed(2)} €` : `Groß ${item.pL?.toFixed(2)} €`}
              </button>
            ))}
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {!hasSize && <span style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:S.brown }}>{price.toFixed(2)} €</span>}
          {hasSize && <div />}
          <button onClick={() => addToCart(item, hasSize ? sel : null)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:12, fontWeight:800, fontSize:12, fontFamily:'Nunito,sans-serif',
              background: isAdded ? S.green : S.gold, color:S.dark, border:'none', cursor:'pointer', transition:'all .2s',
              minWidth: hasSize ? 110 : 90, justifyContent:'center' }}>
            {isAdded
              ? <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> OK!</>
              : <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> {hasSize ? `${price.toFixed(2)} €` : 'Hinzufügen'}</>
            }
          </button>
        </div>
      </div>
    )
  }

  // ── ORDER PAGE ──
  const OrderPage = () => {
    const minOrder = orderType==='delivery' ? 15 : 0
    const canCheckout = total >= minOrder

    if (activePage === 'done') return (
      <main style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'20px', background:`linear-gradient(160deg,${S.dark} 0%,${S.brown} 100%)` }}>
        <div style={{ fontSize:80, marginBottom:16, animation:'floatY 3s ease-in-out infinite' }}>✅</div>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:32, color:'white', marginBottom:12 }}>Bestellung aufgegeben!</h1>
        <p style={{ color:'rgba(255,255,255,.6)', maxWidth:320, lineHeight:1.6, marginBottom:32 }}>Wir haben deine Bestellung erhalten und bereiten sie jetzt vor. Du erhältst eine Bestätigung per Telefon.</p>
        <button className="btn-gold" onClick={() => { setActivePage('home'); setCart([]); setOrderStep('cart') }} style={{ padding:'15px 36px', borderRadius:16, fontSize:15 }}>Zurück zur Startseite</button>
      </main>
    )

    return (
      <main style={{ paddingTop:60, minHeight:'100vh', background:S.cream }}>
        <div style={{ background:`linear-gradient(160deg,${S.dark} 0%,${S.brown} 100%)`, padding:'24px 24px 20px' }}>
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,5vw,40px)', fontWeight:900, color:'white', marginBottom:16 }}>Bestellen</h1>
            {/* Steps */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {['Warenkorb','Angaben','Bestätigen'].map((s,i) => {
                const steps = ['cart','form','confirm']
                const active = steps.indexOf(orderStep)
                return (
                  <div key={s} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, background: i<=active ? S.gold : 'rgba(255,255,255,.12)', color: i<=active ? S.dark : 'rgba(255,255,255,.4)' }}>{i+1}</div>
                      <span style={{ fontSize:11, color: i<=active ? S.gold : 'rgba(255,255,255,.4)', fontWeight:700 }}>{s}</span>
                    </div>
                    {i<2 && <div style={{ width:16, height:1, background:'rgba(255,255,255,.2)' }} />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 20px 120px' }}>
          {/* STEP 1: Cart */}
          {orderStep === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign:'center', padding:'64px 0' }}>
                  <div style={{ fontSize:64, marginBottom:12, opacity:.4 }}>🛒</div>
                  <p style={{ color:S.brownL, marginBottom:24 }}>Dein Warenkorb ist leer</p>
                  <button className="btn-gold" onClick={() => setActivePage('menu')} style={{ padding:'13px 32px', borderRadius:16, fontSize:14 }}>Zur Speisekarte</button>
                </div>
              ) : (
                <>
                  {/* Delivery / Pickup */}
                  <div style={{ display:'flex', gap:8, marginBottom:20, padding:6, borderRadius:18, background:'rgba(61,31,10,.07)' }}>
                    {(['delivery','pickup'] as const).map(t => (
                      <button key={t} onClick={() => setOrderType(t)} style={{ flex:1, padding:'12px', borderRadius:13, fontWeight:700, fontSize:13, fontFamily:'Nunito,sans-serif', border:'none', cursor:'pointer',
                        background: orderType===t ? S.brown : 'transparent', color: orderType===t ? S.gold : S.brownM }}>
                        {t==='delivery' ? '🛵 Lieferung' : '🏪 Abholung'}
                      </button>
                    ))}
                  </div>

                  {/* Items */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderRadius:14, background:'white', border:'1.5px solid rgba(61,31,10,.08)' }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:700, fontSize:13, color:S.brown, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                          {item.size && <div style={{ fontSize:11, color:S.brownL, marginTop:2 }}>{item.size}</div>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <button onClick={() => changeQty(item.id,-1)} style={{ width:28, height:28, borderRadius:'50%', background:'rgba(61,31,10,.08)', border:'none', fontWeight:800, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                          <span style={{ fontWeight:800, width:18, textAlign:'center', fontSize:14 }}>{item.qty}</span>
                          <button onClick={() => changeQty(item.id,1)} style={{ width:28, height:28, borderRadius:'50%', background:S.gold, border:'none', color:S.dark, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                        </div>
                        <div style={{ fontWeight:700, fontSize:13, color:S.brown, width:60, textAlign:'right' }}>{(item.price*item.qty).toFixed(2)} €</div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ padding:18, borderRadius:16, marginBottom:16, background:'rgba(61,31,10,.05)', border:'1px solid rgba(61,31,10,.09)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800 }}>
                      <span style={{ color:S.brown }}>Gesamt</span>
                      <span style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:S.gold }}>{total.toFixed(2)} €</span>
                    </div>
                    {orderType==='delivery' && total<15 && (
                      <div style={{ marginTop:10, padding:'8px 12px', borderRadius:10, background:'rgba(239,68,68,.07)', color:'#dc2626', fontSize:12, fontWeight:600 }}>
                        ⚠️ Mindestbestellwert für Lieferung: 15,00 € (noch {(15-total).toFixed(2)} € fehlen)
                      </div>
                    )}
                  </div>

                  <button className="btn-gold" onClick={() => setOrderStep('form')} disabled={!canCheckout}
                    style={{ width:'100%', padding:15, borderRadius:16, fontSize:15, opacity: canCheckout?1:.5 }}>
                    Weiter zu den Angaben →
                  </button>
                </>
              )}
            </>
          )}

          {/* STEP 2: Form */}
          {orderStep === 'form' && (
            <>
              <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:S.brown, marginBottom:20 }}>Deine Angaben</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  { key:'name', label:'Name *', placeholder:'Vollständiger Name', type:'text' },
                  { key:'phone', label:'Telefon *', placeholder:'z.B. 0170 1234567', type:'tel' },
                  ...(orderType==='delivery' ? [
                    { key:'street', label:'Straße & Hausnummer *', placeholder:'Musterstraße 1', type:'text' },
                    { key:'city', label:'Ort *', placeholder:'Klein Reken', type:'text' },
                  ] : []),
                  { key:'note', label:'Anmerkungen', placeholder:'Sonderwünsche, Allergien…', type:'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display:'block', fontSize:11, fontWeight:800, color:S.brownL, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.key]:e.target.value }))}
                      style={{ width:'100%', padding:'13px 16px', borderRadius:13, background:'white', border:'1.5px solid rgba(61,31,10,.15)', color:S.dark, fontSize:14 }} />
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:10, marginTop:24 }}>
                <button className="btn-dark" onClick={() => setOrderStep('cart')} style={{ flex:1, padding:14, borderRadius:14, fontSize:14 }}>← Zurück</button>
                <button className="btn-gold" onClick={() => setOrderStep('confirm')} disabled={!form.name||!form.phone}
                  style={{ flex:2, padding:14, borderRadius:14, fontSize:14, opacity:(!form.name||!form.phone)?0.5:1 }}>Weiter →</button>
              </div>
            </>
          )}

          {/* STEP 3: Confirm */}
          {orderStep === 'confirm' && (
            <>
              <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:S.brown, marginBottom:20 }}>Bestellung bestätigen</h2>
              <div style={{ padding:18, borderRadius:16, background:'rgba(61,31,10,.05)', border:'1px solid rgba(61,31,10,.09)', marginBottom:16 }}>
                <p style={{ fontWeight:800, color:S.brown, marginBottom:4 }}>{form.name}</p>
                <p style={{ fontSize:13, color:S.brownM }}>{form.phone}</p>
                {orderType==='delivery' && <p style={{ fontSize:13, color:S.brownM }}>{form.street}, {form.city}</p>}
                {form.note && <p style={{ fontSize:12, fontStyle:'italic', color:S.brownL, marginTop:6 }}>"{form.note}"</p>}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:16 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(61,31,10,.07)', fontSize:13 }}>
                    <span style={{ color:S.brown }}>{item.qty}× {item.name} {item.size?`(${item.size})`:''}</span>
                    <span style={{ fontWeight:700, color:S.brown }}>{(item.price*item.qty).toFixed(2)} €</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', fontWeight:800 }}>
                  <span style={{ color:S.brown }}>Gesamt</span>
                  <span style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:S.gold }}>{total.toFixed(2)} €</span>
                </div>
              </div>
              <div style={{ padding:'10px 14px', borderRadius:12, background:'rgba(232,151,31,.08)', color:S.brownL, fontSize:12, fontWeight:600, marginBottom:20 }}>
                💳 Zahlung: Bar bei {orderType==='delivery'?'Lieferung':'Abholung'} · Kartenzahlung möglich
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn-dark" onClick={() => setOrderStep('form')} style={{ flex:1, padding:14, borderRadius:14, fontSize:14 }}>← Zurück</button>
                <button className="btn-gold" onClick={() => setActivePage('done')} style={{ flex:2, padding:14, borderRadius:14, fontSize:15 }}>✅ Jetzt bestellen</button>
              </div>
            </>
          )}
        </div>
      </main>
    )
  }

  return (
    <>
      <style>{css}</style>
      <Navbar />
      <CartDrawer />
      {activePage === 'home'  && <HomePage />}
      {activePage === 'menu'  && <MenuPage />}
      {(activePage === 'order' || activePage === 'done') && <OrderPage />}
      <FloatingCart />
    </>
  )
}
