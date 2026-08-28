import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Accessibility,
  ArrowRight,
  Bell,
  BellRing,
  CalendarDays,
  CalendarSearch,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleUserRound,
  Clock3,
  Compass,
  CreditCard,
  Eye,
  Home,
  Info,
  Languages,
  LocateFixed,
  MapPin,
  Mic,
  Navigation as NavigationIcon,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrainFront,
  UserRound,
  WalletCards,
} from 'lucide-react'
import './App.css'

type View = 'home' | 'search' | 'booking' | 'ticket' | 'trips' | 'journey' | 'alerts' | 'profile'
type Language = 'en' | 'hi' | 'ta'
type ResultFilter = 'best' | 'cheapest' | 'fastest' | 'comfortable'

type TrainResult = {
  id: string
  name: string
  number: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  fare: number
  className: string
  availability: 'available' | 'waitlist' | 'full'
  seats?: number
  waitlist?: number
  probability?: number
  tags: string[]
  reason: string
}

const trainResults: TrainResult[] = [
  { id: 'brindavan', name: 'Brindavan Express', number: '12639', from: 'Chennai Central', to: 'KSR Bengaluru', departure: '07:40', arrival: '13:35', duration: '5h 55m', fare: 620, className: 'AC 3 Tier', availability: 'available', seats: 32, tags: ['Direct', 'Good availability'], reason: 'Within your budget and arrives before your deadline' },
  { id: 'shatabdi', name: 'Shatabdi Express', number: '12027', from: 'Chennai Central', to: 'KSR Bengaluru', departure: '05:50', arrival: '10:30', duration: '4h 40m', fare: 810, className: 'AC Chair Car', availability: 'waitlist', waitlist: 6, probability: 76, tags: ['Fastest', 'Direct'], reason: 'Gets you there fastest, but currently has a waiting list' },
  { id: 'kaveri', name: 'Kaveri Express', number: '16021', from: 'Chennai Egmore', to: 'KSR Bengaluru', departure: '21:15', arrival: '04:50', duration: '7h 35m', fare: 480, className: 'Sleeper', availability: 'available', seats: 18, tags: ['Lowest fare', 'Overnight'], reason: 'The lowest-cost option from a nearby station' },
  { id: 'lalbagh', name: 'Lalbagh Express', number: '12607', from: 'Chennai Central', to: 'KSR Bengaluru', departure: '15:30', arrival: '21:45', duration: '6h 15m', fare: 560, className: 'Sleeper', availability: 'full', tags: ['Direct', 'Seat watch available'], reason: 'A direct evening option that is currently full' },
]

const navItems: Array<{ id: View; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search trains', icon: Search },
  { id: 'trips', label: 'My trips', icon: Ticket },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'profile', label: 'Profile', icon: CircleUserRound },
]

const languageCopy: Record<Language, Record<string, string>> = {
  en: { home: 'Home', search: 'Search trains', trips: 'My trips', alerts: 'Alerts', profile: 'Profile', where: 'Where are you going?', find: 'Find trains', companion: 'Your journey, made simpler' },
  hi: { home: 'होम', search: 'ट्रेन खोजें', trips: 'मेरी यात्राएँ', alerts: 'सूचनाएँ', profile: 'प्रोफ़ाइल', where: 'आप कहाँ जाना चाहते हैं?', find: 'ट्रेन खोजें', companion: 'आपकी यात्रा, अब आसान' },
  ta: { home: 'முகப்பு', search: 'ரயில்களைத் தேடுங்கள்', trips: 'என் பயணங்கள்', alerts: 'அறிவிப்புகள்', profile: 'சுயவிவரம்', where: 'நீங்கள் எங்கே செல்ல விரும்புகிறீர்கள்?', find: 'ரயில்களைத் தேடுங்கள்', companion: 'உங்கள் பயணம், இன்னும் எளிதாக' },
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

function App() {
  const [view, setView] = useState<View>('home')
  const [filter, setFilter] = useState<ResultFilter>('best')
  const [selectedTrain, setSelectedTrain] = useState<TrainResult>(trainResults[0])
  const [easyMode, setEasyMode] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [delayed, setDelayed] = useState(false)
  const [seatWatchActive, setSeatWatchActive] = useState(false)
  const [toast, setToast] = useState('')
  const copy = languageCopy[language]

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const goTo = (nextView: View) => {
    setView(nextView)
  }

  const visibleResults = useMemo(() => {
    if (filter === 'best') return trainResults
    return [...trainResults].sort((first, second) => {
      if (filter === 'cheapest') return first.fare - second.fare
      if (filter === 'fastest') return first.duration.localeCompare(second.duration)
      return Number(second.availability === 'available') - Number(first.availability === 'available')
    })
  }, [filter])

  const handleSearch = () => {
    goTo('search')
    setToast('Showing journeys that fit your travel needs.')
  }

  const chooseTrain = (train: TrainResult) => {
    if (train.availability === 'full') {
      setSeatWatchActive(true)
      setToast('Seat watch is now active for Lalbagh Express.')
      return
    }
    setSelectedTrain(train)
    goTo('booking')
  }

  const chooseLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    setToast(`${nextLanguage === 'en' ? 'English' : nextLanguage === 'hi' ? 'हिन्दी' : 'தமிழ்'} selected.`)
  }

  return <div className={`app-shell ${easyMode ? 'easy-mode' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <aside className="desktop-sidebar" aria-label="Primary navigation"><Brand /><PrimaryNavigation activeView={view} onNavigate={goTo} copy={copy} /><div className="sidebar-spacer" /><div className="prototype-note"><ShieldCheck size={18} aria-hidden="true" /><div><strong>Prototype mode</strong><span>Mock data only. No real railway booking or payment.</span></div></div></aside>
    <div className="main-column">
      <header className="topbar"><div className="breadcrumb"><span>YatraSaathi</span><ChevronRight size={14} aria-hidden="true" /><strong>{copy[view] ?? (view === 'booking' ? 'Booking' : view === 'ticket' ? 'Ticket' : 'Journey mode')}</strong></div><button className="profile-chip" type="button" onClick={() => goTo('profile')}><span className="avatar">RK</span><span className="profile-name">Riya Kapoor</span><ChevronRight size={15} aria-hidden="true" /></button></header>
      <main id="main-content" className="content-area">
        {view === 'home' && <HomeView copy={copy} onSearch={handleSearch} onNavigate={goTo} onAnnounce={setToast} />}
        {view === 'search' && <SearchView copy={copy} filter={filter} visibleResults={visibleResults} onFilter={setFilter} onChoose={chooseTrain} onAnnounce={setToast} />}
        {view === 'booking' && <BookingView train={selectedTrain} onBack={() => goTo('search')} onComplete={() => { goTo('ticket'); setToast('Booking confirmed in prototype mode.') }} />}
        {view === 'ticket' && <TicketView train={selectedTrain} onJourney={() => goTo('journey')} onSave={() => setToast('Ticket saved for offline access on this device.')} />}
        {view === 'trips' && <TripsView seatWatchActive={seatWatchActive} onJourney={() => goTo('journey')} onTicket={() => goTo('ticket')} onSearch={() => goTo('search')} />}
        {view === 'journey' && <JourneyView delayed={delayed} onDelay={() => { setDelayed(true); setToast('Journey updated: a 90-minute delay needs your attention.') }} onAnnounce={setToast} />}
        {view === 'alerts' && <AlertsView delayed={delayed} onJourney={() => goTo('journey')} />}
        {view === 'profile' && <ProfileView easyMode={easyMode} language={language} onEasyMode={() => { setEasyMode((current) => !current); setToast(!easyMode ? 'Easy Mode is on.' : 'Easy Mode is off.') }} onLanguage={chooseLanguage} />}
      </main>
      <MobileNavigation activeView={view} onNavigate={goTo} copy={copy} />
    </div>
    <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
  </div>
}

function Brand() {
  return <div className="brand"><span className="brand-mark"><TrainFront size={20} aria-hidden="true" /></span><span><strong>Yatra<span>Saathi</span></strong><small>Your railway companion</small></span></div>
}

function PrimaryNavigation({ activeView, onNavigate, copy }: { activeView: View; onNavigate: (view: View) => void; copy: Record<string, string> }) {
  return <nav className="primary-nav">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={activeView === id ? 'page' : undefined} onClick={() => onNavigate(id)}><Icon size={18} aria-hidden="true" /><span>{copy[id] ?? label}</span>{id === 'alerts' && <em>2</em>}</button>)}</nav>
}

function MobileNavigation({ activeView, onNavigate, copy }: { activeView: View; onNavigate: (view: View) => void; copy: Record<string, string> }) {
  return <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={activeView === id ? 'page' : undefined} onClick={() => onNavigate(id)}><Icon size={19} aria-hidden="true" /><span>{copy[id] ?? label.replace(' trains', '')}</span></button>)}</nav>
}

function HomeView({ copy, onSearch, onNavigate, onAnnounce }: { copy: Record<string, string>; onSearch: () => void; onNavigate: (view: View) => void; onAnnounce: (message: string) => void }) {
  return <><div className="eyebrow"><Compass size={14} aria-hidden="true" />{copy.companion}</div><h1>{copy.where}</h1><p className="lede">Tell us what you need. We’ll help you compare trains, understand the choices, and get ready for the journey.</p>
    <section className="search-card" aria-label="Find a train"><div className="search-fields"><Field label="From" value="Chennai Central" icon={<MapPin size={17} aria-hidden="true" />} ariaLabel="Starting station" /><Field label="To" value="Bengaluru" icon={<NavigationIcon size={17} aria-hidden="true" />} ariaLabel="Destination station" /><Field label="Travel date" value="Tomorrow, 28 Aug" icon={<CalendarDays size={17} aria-hidden="true" />} ariaLabel="Travel date" /><Field label="Passengers" value="1 adult" icon={<UserRound size={17} aria-hidden="true" />} ariaLabel="Passengers" select /></div><div className="search-actions"><button className="primary-button" type="button" onClick={onSearch}><Search size={17} aria-hidden="true" />{copy.find}</button><button className="voice-button" type="button" onClick={() => onAnnounce('Voice preview: “Reach Bengaluru before 10 AM.”')}><Mic size={17} aria-hidden="true" />Try speaking</button></div><p className="search-hint">Try: “I need to reach Bengaluru before 10 AM and spend less than ₹800.”</p></section>
    <SectionHeading title="Your next journey" caption="We’ll keep the important details close by." action="See all trips" onAction={() => onNavigate('trips')} /><section className="next-trip-card"><div className="next-trip-copy"><span className="small-label">Upcoming · Sat, 29 Aug</span><h2>Chennai Central <ArrowRight size={18} aria-hidden="true" /> Bengaluru</h2><p>Brindavan Express · Coach S3 · Seat 42</p><div className="trip-meta"><span><Clock3 size={14} aria-hidden="true" />Departs 07:40 AM</span><span><MapPin size={14} aria-hidden="true" />Platform 6</span><span className="on-time"><CircleCheck size={14} aria-hidden="true" />On time</span></div></div><div className="countdown"><strong>1 day</strong><span>until departure</span><button className="light-button" type="button" onClick={() => onNavigate('journey')}>Open journey mode <ArrowRight size={15} aria-hidden="true" /></button></div></section>
    <SectionHeading title="Quick actions" caption="Common tasks, one tap away." /><div className="quick-grid"><QuickAction icon={<CalendarSearch size={20} aria-hidden="true" />} title="Find a train" caption="Compare your options" onClick={() => onNavigate('search')} /><QuickAction icon={<ScanLine size={20} aria-hidden="true" />} title="Check a ticket" caption="See your journey status" onClick={() => onNavigate('ticket')} /><QuickAction icon={<BellRing size={20} aria-hidden="true" />} title="View alerts" caption="2 updates for you" onClick={() => onNavigate('alerts')} /></div><div className="info-strip"><Info size={18} aria-hidden="true" /><div><strong>One thing to know</strong><span>Your next journey departs from Platform 6. We’ll tell you if anything changes.</span></div></div>
  </>
}

function SearchView({ copy, filter, visibleResults, onFilter, onChoose, onAnnounce }: { copy: Record<string, string>; filter: ResultFilter; visibleResults: TrainResult[]; onFilter: (filter: ResultFilter) => void; onChoose: (train: TrainResult) => void; onAnnounce: (message: string) => void }) {
  return <><div className="eyebrow"><Search size={14} aria-hidden="true" />{copy.search}</div><h1>Trains for your journey</h1><p className="lede">Chennai Central to Bengaluru <span className="muted-dot">·</span> Tomorrow, 28 Aug <span className="muted-dot">·</span> 1 adult</p><section className="search-card compact-search" aria-label="Update train search"><div className="search-fields"><Field label="From" value="Chennai Central" ariaLabel="Starting station" /><Field label="To" value="Bengaluru" ariaLabel="Destination station" /><Field label="Date" value="28 Aug 2026" ariaLabel="Travel date" /><Field label="Class" value="Any class" ariaLabel="Travel class" select /></div><div className="search-actions"><button className="primary-button" type="button" onClick={() => onAnnounce('Results updated for your journey.')}><Search size={17} aria-hidden="true" />Update results</button><button className="voice-button" type="button" onClick={() => onAnnounce('Voice preview: “Find the cheapest direct train.”')}><Mic size={17} aria-hidden="true" />Search by voice</button></div></section><div className="results-toolbar"><div><strong>8 journeys</strong> found <span className="muted-dot">·</span> sorted by what fits you</div><div className="filter-tabs" role="tablist" aria-label="Sort journeys">{([['best', 'Best match'], ['cheapest', 'Cheapest'], ['fastest', 'Fastest'], ['comfortable', 'Comfortable']] as const).map(([id, label]) => <button type="button" key={id} role="tab" aria-selected={filter === id} onClick={() => onFilter(id)}>{label}</button>)}</div></div><div className="result-list" aria-live="polite">{visibleResults.map((train, index) => <TrainCard key={train.id} train={train} featured={index === 0 && filter === 'best'} onChoose={() => onChoose(train)} onAnnounce={onAnnounce} />)}</div><p className="prototype-disclaimer"><ShieldCheck size={14} aria-hidden="true" />Availability, fares, and estimates are synthetic prototype data, not live railway information.</p></>
}

function TrainCard({ train, featured, onChoose, onAnnounce }: { train: TrainResult; featured: boolean; onChoose: () => void; onAnnounce: (message: string) => void }) {
  const availability = train.availability === 'available' ? <span className="status success"><CircleCheck size={13} aria-hidden="true" />{train.seats} seats left</span> : train.availability === 'waitlist' ? <span className="status wait"><Clock3 size={13} aria-hidden="true" />WL {train.waitlist} · {train.probability}% prototype estimate</span> : <span className="status full"><CircleAlert size={13} aria-hidden="true" />Currently full</span>
  return <article aria-label={train.name} className={`train-card ${featured ? 'featured' : ''}`}>{featured && <div className="recommendation-label"><Sparkles size={14} aria-hidden="true" />Best match <strong>92%</strong></div>}{!featured && train.availability === 'waitlist' && <div className="recommendation-label wait-label"><Clock3 size={14} aria-hidden="true" />Waitlist explained</div>}<div className="train-card-main"><div className="train-info"><h2>{train.name} <span>{train.number}</span></h2><div className="time-row"><div><strong>{train.departure}</strong><span>{train.from}</span></div><div className="duration"><span>{train.duration}</span><i /></div><div><strong>{train.arrival}</strong><span>{train.to}</span></div></div><div className="reason"><span>{train.reason}</span><div className="tag-row">{train.tags.map((tag) => <em key={tag}>{tag}</em>)}</div></div></div><div className="train-card-side"><strong className="fare">{formatCurrency(train.fare)}</strong><span className="class-name">{train.className}</span>{availability}<button className={train.availability === 'available' ? 'primary-button' : 'secondary-button'} type="button" onClick={onChoose}>{train.availability === 'full' ? 'Watch for a seat' : train.availability === 'waitlist' ? 'Understand & choose' : 'Choose this train'}<ArrowRight size={15} aria-hidden="true" /></button>{train.availability === 'waitlist' && <button className="text-button" type="button" onClick={() => onAnnounce(`WL ${train.waitlist} means you are ${train.waitlist}th on the waiting list. This is a prototype estimate, not an official forecast.`)}>What does WL mean?</button>}</div></div></article>
}

function BookingView({ train, onBack, onComplete }: { train: TrainResult; onBack: () => void; onComplete: () => void }) {
  return <><div className="stepper" aria-label="Booking progress"><span className="done"><b>1</b>Train</span><i /><span className="current"><b>2</b>Passenger</span><i /><span><b>3</b>Review</span><i /><span><b>4</b>Done</span></div><button className="back-button" type="button" onClick={onBack}>← Back to results</button><div className="eyebrow">One clear step at a time</div><h1>Who is travelling?</h1><p className="lede">{train.name} <span className="muted-dot">·</span> {train.from} to {train.to} <span className="muted-dot">·</span> Sat, 29 Aug</p><div className="booking-layout"><div><section className="panel"><div className="panel-heading"><div><h2>Saved passengers</h2><p>Choose who is travelling.</p></div><UserRound size={20} aria-hidden="true" /></div><label className="passenger-option selected"><span className="person-avatar">RK</span><span><strong>Riya Kapoor</strong><small>Adult · Female</small></span><input type="radio" name="passenger" defaultChecked /> <b>Select</b></label><div className="add-passenger"><span className="plus-icon">+</span><span><strong>Add someone else</strong><small>Enter passenger details</small></span><button className="text-button" type="button">Add passenger</button></div></section><section className="panel"><div className="panel-heading"><div><h2>Travel preference</h2><p>We’ll request this when available.</p></div><Compass size={20} aria-hidden="true" /></div><label className="radio-row"><input type="radio" name="berth" defaultChecked />Lower berth, if available</label><label className="radio-row"><input type="radio" name="berth" />No preference</label></section></div><aside className="panel summary-panel"><h2>Your selection</h2><SummaryRow label="Train" value={train.name} /><SummaryRow label="Class" value={train.className} /><SummaryRow label="Passenger" value="1 adult" /><SummaryRow label="Total fare" value={formatCurrency(train.fare)} total /><button className="primary-button full-button" type="button" onClick={onComplete}><CreditCard size={17} aria-hidden="true" />Continue to payment</button><p className="panel-note"><ShieldCheck size={14} aria-hidden="true" />Payment is simulated. No money will be charged.</p></aside></div></>
}

function TicketView({ train, onJourney, onSave }: { train: TrainResult; onJourney: () => void; onSave: () => void }) {
  return <><div className="eyebrow"><CircleCheck size={14} aria-hidden="true" />You’re all set</div><h1>Your ticket is ready</h1><p className="lede">Keep this handy for your journey. We’ll continue to monitor the important details.</p><section className="ticket-card"><div className="ticket-head"><div><h2>{train.name}</h2><p>{train.number} · Confirmed in prototype</p></div><div className="pnr"><span>PNR (prototype)</span><strong>4827 1930</strong></div></div><div className="ticket-route"><StationTime time="07:40" station="Chennai Central" detail="Platform 6" /><ArrowRight className="route-arrow" size={24} aria-hidden="true" /><StationTime time="13:35" station="KSR Bengaluru" /></div><div className="ticket-details"><SummaryRow label="Date" value="Sat, 29 Aug 2026" /><SummaryRow label="Passenger" value="Riya Kapoor" /><SummaryRow label="Coach & seat" value="S3 · 42 Lower" /></div></section><div className="action-row"><button className="primary-button" type="button" onClick={onJourney}><NavigationIcon size={17} aria-hidden="true" />Open journey mode</button><button className="secondary-button" type="button" onClick={onSave}><WalletCards size={17} aria-hidden="true" />Save for offline</button></div><p className="prototype-disclaimer"><ShieldCheck size={14} aria-hidden="true" />Prototype ticket · Not valid for travel · Payment and reservation are simulated.</p></>
}

function TripsView({ seatWatchActive, onJourney, onTicket, onSearch }: { seatWatchActive: boolean; onJourney: () => void; onTicket: () => void; onSearch: () => void }) {
  return <><div className="eyebrow"><Ticket size={14} aria-hidden="true" />Your journeys in one place</div><h1>My trips</h1><p className="lede">Everything you need before, during, and after a journey.</p><SectionHeading title="Upcoming" caption="Sat, 29 Aug · 1 journey" /><section className="trip-list-card"><div className="trip-list-head"><div><h2>Chennai Central <ArrowRight size={17} aria-hidden="true" /> Bengaluru</h2><p>Brindavan Express · Confirmed</p></div><span className="status success"><CircleCheck size={13} aria-hidden="true" />On time</span></div><div className="trip-route-row"><StationTime time="07:40" station="Chennai Central" detail="Platform 6" /><ArrowRight className="route-arrow" size={21} aria-hidden="true" /><StationTime time="13:35" station="KSR Bengaluru" /></div><div className="action-row"><button className="primary-button" type="button" onClick={onJourney}><NavigationIcon size={16} aria-hidden="true" />Open journey mode</button><button className="secondary-button" type="button" onClick={onTicket}>View ticket</button></div></section><SectionHeading title="Being monitored" caption="We’ll tell you if a seat opens up." /><section className="panel watch-panel"><div className="watch-icon"><Eye size={20} aria-hidden="true" /></div><div><h2>Kaveri Express · 16021</h2><p>Chennai Egmore → Bengaluru · Sleeper</p><span className="status wait"><Eye size={13} aria-hidden="true" />{seatWatchActive ? 'Seat watch active' : 'Seat watch on'}</span></div><ChevronRight size={18} aria-hidden="true" /></section><p className="watch-note"><Info size={14} aria-hidden="true" />Currently full. We’ll notify you if a seat becomes available.</p><button className="secondary-button browse-button" type="button" onClick={onSearch}><Search size={16} aria-hidden="true" />Find another journey</button></>
}

function JourneyView({ delayed, onDelay, onAnnounce }: { delayed: boolean; onDelay: () => void; onAnnounce: (message: string) => void }) {
  return <><section className="journey-banner"><div><span className="live-label"><i />Simulated live journey</span><small>Brindavan Express · 12639</small><h2>On the way to Bengaluru</h2></div><div className="eta"><small>ETA</small><strong>{delayed ? '15:05' : '13:35'}</strong></div></section><div className="journey-layout"><section className="panel location-panel"><div className="panel-heading"><div><h2>Where your train is</h2><p>Current location · Salem Junction</p></div><LocateFixed size={20} aria-hidden="true" /></div><div className="journey-timeline"><JourneyStop station="Chennai Central" detail="Departed · 07:40" time="07:40" /><JourneyStop station="Salem Junction" detail="Current location" time="11:05" current /><JourneyStop station="KSR Bengaluru" detail="Expected arrival" time={delayed ? '15:05' : '13:35'} /></div></section><section className="panel details-panel"><div className="panel-heading"><div><h2>Today’s details</h2><p>What you need at a glance.</p></div><TrainFront size={20} aria-hidden="true" /></div><div className="journey-metrics"><Metric label="Platform" value="6" /><Metric label="Coach" value="S3 · Zone B" /><Metric label="Delay" value={delayed ? '90 minutes' : 'On time'} danger={delayed} /><Metric label="Connection" value={delayed ? 'At risk' : 'None'} danger={delayed} /></div><button className="secondary-button full-button" type="button" onClick={onDelay} disabled={delayed}>{delayed ? 'Delay simulated' : 'Simulate a 90 min delay'}</button></section></div>{delayed && <section className="recovery-panel" aria-live="polite"><div className="recovery-heading"><div className="recovery-icon"><CircleAlert size={20} aria-hidden="true" /></div><div><h2>Your journey needs attention</h2><p>Your train is delayed by 90 minutes. You may miss the connecting journey planned from Bengaluru.</p></div></div><div className="recovery-option"><div><strong>Take the 15:10 Intercity</strong><span>Arrives 1h later · ₹180 extra</span></div><button className="primary-button" type="button" onClick={() => onAnnounce('Intercity option selected in prototype mode.')}>Choose</button></div><div className="recovery-option"><div><strong>Keep your current plan</strong><span>Lowest cost · Higher connection risk</span></div><button className="secondary-button" type="button" onClick={() => onAnnounce('Original plan kept in prototype mode.')}>Keep plan</button></div></section>}<p className="prototype-disclaimer"><ShieldCheck size={14} aria-hidden="true" />Location, delay, platform, and recovery options are simulated prototype states.</p></>
}

function AlertsView({ delayed, onJourney }: { delayed: boolean; onJourney: () => void }) {
  return <><div className="eyebrow"><Bell size={14} aria-hidden="true" />Only what matters</div><h1>Alerts</h1><p className="lede">Useful updates about your tickets, seats, and journeys.</p><div className="alert-list">{delayed && <AlertItem icon={<CircleAlert size={19} aria-hidden="true" />} title="Your train is delayed by 90 minutes" text="Open Journey Mode to see your options and decide what to do next." time="Just now" tone="danger" action="View journey" onAction={onJourney} />}<AlertItem icon={<BellRing size={19} aria-hidden="true" />} title="Platform 6 confirmed for your journey" text="Brindavan Express departs from Chennai Central at 07:40 AM on 29 Aug." time="Today · 10:42 AM" /><AlertItem icon={<Eye size={19} aria-hidden="true" />} title="Seat watch is active" text="Kaveri Express is currently full. We’ll notify you if a seat opens up." time="Yesterday · 06:20 PM" tone="blue" /><AlertItem icon={<CircleCheck size={19} aria-hidden="true" />} title="Your booking is confirmed" text="Brindavan Express · PNR 4827 1930 · S3, seat 42." time="27 Aug · 04:15 PM" tone="green" /></div></>
}

function ProfileView({ easyMode, language, onEasyMode, onLanguage }: { easyMode: boolean; language: Language; onEasyMode: () => void; onLanguage: (language: Language) => void }) {
  return <><div className="eyebrow"><Accessibility size={14} aria-hidden="true" />Make it work for you</div><h1>Profile & preferences</h1><p className="lede">Adjust the experience to match how you travel.</p><div className="profile-layout"><section className="panel preferences-panel"><PreferenceRow title="Easy Mode" description="Larger text, simpler words, bigger controls"><button className={`toggle ${easyMode ? 'on' : ''}`} type="button" aria-pressed={easyMode} aria-label="Toggle Easy Mode" onClick={onEasyMode}><i /></button></PreferenceRow><PreferenceRow title="Language" description="Use YatraSaathi in a language you prefer"><div className="language-buttons" role="group" aria-label="Language"><button className={language === 'en' ? 'selected' : ''} type="button" onClick={() => onLanguage('en')}>English</button><button className={language === 'hi' ? 'selected' : ''} type="button" onClick={() => onLanguage('hi')}>हिन्दी</button><button className={language === 'ta' ? 'selected' : ''} type="button" onClick={() => onLanguage('ta')}>தமிழ்</button></div></PreferenceRow><PreferenceRow title="Saved passengers" description="Riya Kapoor"><button className="text-button" type="button">Manage</button></PreferenceRow></section><section className="panel about-panel"><div className="about-symbol"><Languages size={21} aria-hidden="true" /></div><h2>About this prototype</h2><p>YatraSaathi is a hackathon concept that makes railway information easier to understand and act on.</p><div className="trust-box"><ShieldCheck size={18} aria-hidden="true" /><div><strong>Trust first</strong><span>Mock data only. No real railway booking or payment is connected.</span></div></div></section></div></>
}

function Field({ label, value, icon, ariaLabel, select = false }: { label: string; value: string; icon?: ReactNode; ariaLabel: string; select?: boolean }) {
  return <label className="field"><span>{label}</span><div className="field-control">{icon}{select ? <select aria-label={ariaLabel} defaultValue={value}><option>{value}</option><option>2 adults</option><option>Family</option></select> : <input aria-label={ariaLabel} defaultValue={value} />}</div></label>
}

function SectionHeading({ title, caption, action, onAction }: { title: string; caption?: string; action?: string; onAction?: () => void }) {
  return <div className="section-heading"><div><h2>{title}</h2>{caption && <p>{caption}</p>}</div>{action && <button className="text-button" type="button" onClick={onAction}>{action}<ArrowRight size={14} aria-hidden="true" /></button>}</div>
}

function QuickAction({ icon, title, caption, onClick }: { icon: ReactNode; title: string; caption: string; onClick: () => void }) {
  return <button className="quick-action" type="button" onClick={onClick}><span className="quick-icon">{icon}</span><span><strong>{title}</strong><small>{caption}</small></span><ChevronRight size={16} aria-hidden="true" /></button>
}

function SummaryRow({ label, value, total = false }: { label: string; value: string; total?: boolean }) {
  return <div className={`summary-row ${total ? 'total-row' : ''}`}><span>{label}</span><strong>{value}</strong></div>
}

function StationTime({ time, station, detail }: { time: string; station: string; detail?: string }) {
  return <div className="station-time"><strong>{time}</strong><span>{station}</span>{detail && <small>{detail}</small>}</div>
}

function JourneyStop({ station, detail, time, current = false }: { station: string; detail: string; time: string; current?: boolean }) {
  return <div className={`journey-stop ${current ? 'current' : ''}`}><span className="stop-marker" /><div><strong>{station}</strong><span>{detail}</span></div><time>{time}</time></div>
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return <div className="metric"><span>{label}</span><strong className={danger ? 'danger-text' : ''}>{value}</strong></div>
}

function AlertItem({ icon, title, text, time, tone = 'orange', action, onAction }: { icon: ReactNode; title: string; text: string; time: string; tone?: 'orange' | 'blue' | 'green' | 'danger'; action?: string; onAction?: () => void }) {
  return <article className="alert-item"><span className={`alert-icon ${tone}`}>{icon}</span><div><strong>{title}</strong><p>{text}</p><time>{time}</time>{action && <button className="text-button alert-action" type="button" onClick={onAction}>{action}<ArrowRight size={14} aria-hidden="true" /></button>}</div></article>
}

function PreferenceRow({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="preference-row"><div><strong>{title}</strong><span>{description}</span></div>{children}</div>
}

export default App
