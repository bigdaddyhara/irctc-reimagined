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
import { getRecommendations } from './services/recommendationService'
import { parseJourneyText } from './services/naturalLanguageParser'
import { createVoiceRecognition } from './services/voiceService'

type VoiceResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type VoiceRecognition = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  onresult: ((event: VoiceResultEvent) => void) | null
  start: () => void
}
type VoiceRecognitionConstructor = new () => VoiceRecognition

declare global {
  interface Window {
    SpeechRecognition?: VoiceRecognitionConstructor
    webkitSpeechRecognition?: VoiceRecognitionConstructor
  }
}

type View = 'home' | 'search' | 'booking' | 'ticket' | 'trips' | 'journey' | 'alerts' | 'profile'
type Language = 'english' | 'hindi' | 'bengali' | 'telugu' | 'marathi' | 'tamil' | 'gujarati' | 'kannada' | 'malayalam' | 'odia' | 'punjabi' | 'assamese'
type ResultFilter = 'best' | 'cheapest' | 'fastest' | 'comfortable'
type SearchField = 'from' | 'to' | 'date' | 'passengers' | 'className' | 'timePreference'

type SearchCriteria = {
  from: string
  to: string
  date: string
  passengers: string
  className: string
  timePreference: string
}

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

const languageOptions: Array<{ id: Language; label: string }> = [
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'हिन्दी' },
  { id: 'bengali', label: 'বাংলা' },
  { id: 'telugu', label: 'తెలుగు' },
  { id: 'marathi', label: 'मराठी' },
  { id: 'tamil', label: 'தமிழ்' },
  { id: 'gujarati', label: 'ગુજરાતી' },
  { id: 'kannada', label: 'ಕನ್ನಡ' },
  { id: 'malayalam', label: 'മലയാളം' },
  { id: 'odia', label: 'ଓଡ଼ିଆ' },
  { id: 'punjabi', label: 'ਪੰਜਾਬੀ' },
  { id: 'assamese', label: 'অসমীয়া' },
]

const classOptions = ['Any class', 'Sleeper', 'AC Chair Car', 'AC 3 Tier', 'First AC']
const stationOptions = ['Chennai Central', 'Bengaluru', 'Mumbai Central', 'Pune', 'New Delhi', 'Hyderabad Deccan', 'Kolkata Howrah', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi Ernakulam', 'Bhopal', 'Patna', 'Visakhapatnam']
const defaultSearchCriteria: SearchCriteria = { from: 'Chennai Central', to: 'Bengaluru', date: '2026-08-28', passengers: '1 adult', className: 'Any class', timePreference: 'Any time' }
const languageCopy: Record<Language, Record<string, string>> = {
  english: { home: 'Home', search: 'Search trains', resultsTitle: 'Trains for your journey', trips: 'My trips', alerts: 'Alerts', profile: 'Profile', where: 'Where are you going?', find: 'Find trains', companion: 'Simple train travel', from: 'From', to: 'To', date: 'Travel date', passengers: 'Passengers', className: 'Class', fromHint: 'Starting station', toHint: 'Destination station', tip: 'Tip: try “Mumbai to Pune”.', nextJourney: 'Your next journey', nextJourneyCaption: 'We’ll keep the important details close by.', seeAllTrips: 'See all trips', quickActions: 'Quick actions', quickActionsCaption: 'Common tasks, one tap away.', findTrain: 'Find a train', findTrainCaption: 'Compare your options', checkTicket: 'Check a ticket', checkTicketCaption: 'See your journey status', viewAlerts: 'View alerts', viewAlertsCaption: '2 updates for you', built: 'Built for simpler journeys', important: 'The important bits, without the railway jargon.', profileTitle: 'Profile & preferences', profileLede: 'Adjust the experience to match how you travel.', easyMode: 'Easy Mode', easyDescription: 'Larger text, simpler words, bigger controls', language: 'Language', languageDescription: 'Choose a language', about: 'About this website', aboutText: 'This website makes railway information easier to understand and act on.', savedPassengers: 'Saved passengers', manage: 'Manage', trustFirst: 'Trust first', trustText: 'Demo data only. No real railway booking or payment is connected.' },
  hindi: { home: 'होम', search: 'ट्रेन खोजें', trips: 'मेरी यात्राएँ', alerts: 'सूचनाएँ', profile: 'प्रोफ़ाइल', where: 'आप कहाँ जा रहे हैं?', find: 'ट्रेन खोजें', companion: 'सरल ट्रेन यात्रा', from: 'कहाँ से', to: 'कहाँ तक', date: 'यात्रा की तारीख', passengers: 'यात्री', className: 'क्लास', fromHint: 'शुरुआती स्टेशन', toHint: 'गंतव्य स्टेशन', tip: 'सुझाव: “मुंबई से पुणे” बोलकर देखें।', nextJourney: 'आपकी अगली यात्रा', nextJourneyCaption: 'ज़रूरी जानकारी यहीं मिलेगी।', seeAllTrips: 'सभी यात्राएँ', quickActions: 'त्वरित काम', quickActionsCaption: 'आम काम, एक टैप में।', findTrain: 'ट्रेन खोजें', findTrainCaption: 'विकल्पों की तुलना करें', checkTicket: 'टिकट देखें', checkTicketCaption: 'यात्रा की स्थिति देखें', viewAlerts: 'सूचनाएँ देखें', viewAlertsCaption: 'आपके लिए 2 अपडेट', built: 'सरल यात्रा के लिए बनाया गया', important: 'ज़रूरी बातें, कठिन रेलवे शब्दों के बिना।', profileTitle: 'प्रोफ़ाइल और पसंद', profileLede: 'यात्रा के अनुसार अनुभव बदलें।', easyMode: 'आसान मोड', easyDescription: 'बड़ा टेक्स्ट, सरल शब्द, बड़े बटन', language: 'भाषा', languageDescription: 'भाषा चुनें', about: 'इस वेबसाइट के बारे में', aboutText: 'यह वेबसाइट रेलवे की जानकारी को समझना और उपयोग करना आसान बनाती है।', savedPassengers: 'सहेजे गए यात्री', manage: 'प्रबंधित करें', trustFirst: 'भरोसा पहले', trustText: 'सिर्फ डेमो डेटा। असली बुकिंग या भुगतान जुड़ा नहीं है।' },
  bengali: { home: 'হোম', search: 'ট্রেন খুঁজুন', trips: 'আমার যাত্রা', alerts: 'সতর্কতা', profile: 'প্রোফাইল', where: 'আপনি কোথায় যাচ্ছেন?', find: 'ট্রেন খুঁজুন', companion: 'সহজ ট্রেন যাত্রা', from: 'কোথা থেকে', to: 'কোথায়', date: 'যাত্রার তারিখ', passengers: 'যাত্রী', className: 'শ্রেণি', fromHint: 'শুরুর স্টেশন', toHint: 'গন্তব্য স্টেশন', tip: 'পরামর্শ: “মুম্বাই থেকে পুনে” চেষ্টা করুন।', nextJourney: 'আপনার পরের যাত্রা', nextJourneyCaption: 'গুরুত্বপূর্ণ তথ্য হাতের কাছে থাকবে।', seeAllTrips: 'সব যাত্রা দেখুন', quickActions: 'দ্রুত কাজ', quickActionsCaption: 'সাধারণ কাজ, এক ট্যাপেই।', findTrain: 'ট্রেন খুঁজুন', findTrainCaption: 'বিকল্প তুলনা করুন', checkTicket: 'টিকিট দেখুন', checkTicketCaption: 'যাত্রার অবস্থা দেখুন', viewAlerts: 'সতর্কতা দেখুন', viewAlertsCaption: 'আপনার জন্য ২টি আপডেট', built: 'সহজ যাত্রার জন্য তৈরি', important: 'রেলওয়ের কঠিন শব্দ ছাড়াই গুরুত্বপূর্ণ তথ্য।', profileTitle: 'প্রোফাইল ও পছন্দ', profileLede: 'আপনার যাত্রার ধরন অনুযায়ী বদলান।', easyMode: 'সহজ মোড', easyDescription: 'বড় লেখা, সহজ শব্দ, বড় বোতাম', language: 'ভাষা', languageDescription: 'ভাষা বেছে নিন', about: 'এই ওয়েবসাইট সম্পর্কে', aboutText: 'এই ওয়েবসাইট রেলওয়ের তথ্য বোঝা ও ব্যবহার করা সহজ করে।', savedPassengers: 'সংরক্ষিত যাত্রী', manage: 'পরিচালনা করুন', trustFirst: 'বিশ্বাস আগে', trustText: 'শুধু ডেমো ডেটা। আসল বুকিং বা পেমেন্ট যুক্ত নয়।' },
  telugu: { home: 'హోమ్', search: 'రైళ్లు వెతకండి', trips: 'నా ప్రయాణాలు', alerts: 'అలర్ట్‌లు', profile: 'ప్రొఫైల్', where: 'మీరు ఎక్కడికి వెళ్తున్నారు?', find: 'రైళ్లు వెతకండి', companion: 'సులభమైన రైలు ప్రయాణం', from: 'ఎక్కడి నుంచి', to: 'ఎక్కడికి', date: 'ప్రయాణ తేదీ', passengers: 'ప్రయాణికులు', className: 'తరగతి', fromHint: 'ప్రారంభ స్టేషన్', toHint: 'గమ్యస్థానం', tip: 'సూచన: “ముంబై నుంచి పుణే” ప్రయత్నించండి.', nextJourney: 'మీ తదుపరి ప్రయాణం', nextJourneyCaption: 'ముఖ్యమైన వివరాలు దగ్గరలో ఉంటాయి.', seeAllTrips: 'అన్ని ప్రయాణాలు', quickActions: 'త్వరిత చర్యలు', quickActionsCaption: 'సాధారణ పనులు, ఒక ట్యాప్‌లో.', findTrain: 'రైలు వెతకండి', findTrainCaption: 'ఎంపికలను పోల్చండి', checkTicket: 'టికెట్ చూడండి', checkTicketCaption: 'ప్రయాణ స్థితి చూడండి', viewAlerts: 'అలర్ట్‌లు చూడండి', viewAlertsCaption: 'మీ కోసం 2 అప్‌డేట్‌లు', built: 'సులభమైన ప్రయాణాల కోసం', important: 'రైల్వే కఠిన పదాలు లేకుండా ముఖ్యమైన విషయాలు.', profileTitle: 'ప్రొఫైల్ & ప్రాధాన్యతలు', profileLede: 'మీ ప్రయాణానికి సరిపోయేలా మార్చండి.', easyMode: 'సులభ మోడ్', easyDescription: 'పెద్ద అక్షరాలు, సరళమైన పదాలు, పెద్ద బటన్లు', language: 'భాష', languageDescription: 'భాషను ఎంచుకోండి', about: 'ఈ వెబ్‌సైట్ గురించి', aboutText: 'రైల్వే సమాచారాన్ని అర్థం చేసుకోవడం మరియు ఉపయోగించడం ఈ వెబ్‌సైట్ సులభం చేస్తుంది.', savedPassengers: 'సేవ్ చేసిన ప్రయాణికులు', manage: 'నిర్వహించండి', trustFirst: 'నమ్మకం ముందు', trustText: 'డెమో డేటా మాత్రమే. నిజమైన బుకింగ్ లేదా చెల్లింపు లేదు.' },
  marathi: { home: 'मुख्यपृष्ठ', search: 'ट्रेन शोधा', trips: 'माझे प्रवास', alerts: 'सूचना', profile: 'प्रोफाइल', where: 'तुम्ही कुठे जात आहात?', find: 'ट्रेन शोधा', companion: 'सोपा ट्रेन प्रवास', from: 'कुठून', to: 'कुठे', date: 'प्रवासाची तारीख', passengers: 'प्रवासी', className: 'वर्ग', fromHint: 'सुरुवातीचे स्टेशन', toHint: 'गंतव्य स्टेशन', tip: 'सूचना: “मुंबई ते पुणे” वापरून पाहा.', nextJourney: 'तुमचा पुढील प्रवास', nextJourneyCaption: 'महत्त्वाची माहिती जवळच राहील.', seeAllTrips: 'सर्व प्रवास', quickActions: 'जलद कृती', quickActionsCaption: 'सामान्य कामे, एका टॅपमध्ये.', findTrain: 'ट्रेन शोधा', findTrainCaption: 'पर्यायांची तुलना करा', checkTicket: 'तिकीट पहा', checkTicketCaption: 'प्रवासाची स्थिती पहा', viewAlerts: 'सूचना पहा', viewAlertsCaption: 'तुमच्यासाठी 2 अपडेट्स', built: 'सोपा प्रवास करण्यासाठी', important: 'रेल्वेच्या कठीण शब्दांशिवाय महत्त्वाच्या गोष्टी.', profileTitle: 'प्रोफाइल आणि पसंती', profileLede: 'तुमच्या प्रवासानुसार अनुभव बदला.', easyMode: 'सोपे मोड', easyDescription: 'मोठा मजकूर, सोपे शब्द, मोठी बटणे', language: 'भाषा', languageDescription: 'भाषा निवडा', about: 'या वेबसाइटबद्दल', aboutText: 'रेल्वेची माहिती समजणे आणि वापरणे ही वेबसाइट सोपे करते.', savedPassengers: 'जतन केलेले प्रवासी', manage: 'व्यवस्थापित करा', trustFirst: 'विश्वास प्रथम', trustText: 'फक्त डेमो डेटा. खरे बुकिंग किंवा पेमेंट जोडलेले नाही.' },
  tamil: { home: 'முகப்பு', search: 'ரயில்களைத் தேடுங்கள்', trips: 'என் பயணங்கள்', alerts: 'அறிவிப்புகள்', profile: 'சுயவிவரம்', where: 'உங்கள் பயணம் எங்கே?', find: 'ரயில்களைத் தேடுங்கள்', companion: 'எளிய ரயில் பயணம்', from: 'எங்கிருந்து', to: 'எங்கு', date: 'பயண தேதி', passengers: 'பயணிகள்', className: 'வகுப்பு', fromHint: 'தொடக்க நிலையம்', toHint: 'சேருமிடம்', tip: 'குறிப்பு: “மும்பை முதல் புனே” என்று முயற்சிக்கவும்.', nextJourney: 'உங்கள் அடுத்த பயணம்', nextJourneyCaption: 'முக்கிய விவரங்கள் அருகிலேயே இருக்கும்.', seeAllTrips: 'அனைத்து பயணங்களையும் காண்க', quickActions: 'விரைவு செயல்கள்', quickActionsCaption: 'பொதுவான பணிகள், ஒரே தட்டலில்.', findTrain: 'ரயிலைத் தேடுங்கள்', findTrainCaption: 'விருப்பங்களை ஒப்பிடுங்கள்', checkTicket: 'டிக்கெட்டைப் பார்க்கவும்', checkTicketCaption: 'பயண நிலையைப் பார்க்கவும்', viewAlerts: 'அறிவிப்புகளைப் பார்க்கவும்', viewAlertsCaption: 'உங்களுக்காக 2 புதுப்பிப்புகள்', built: 'எளிய பயணங்களுக்காக உருவாக்கப்பட்டது', important: 'ரயில்வே கடினமான சொற்கள் இல்லாமல் முக்கியமான தகவல்கள்.', profileTitle: 'சுயவிவரம் மற்றும் விருப்பங்கள்', profileLede: 'உங்கள் பயணத்திற்கு ஏற்றவாறு மாற்றுங்கள்.', easyMode: 'எளிய முறை', easyDescription: 'பெரிய எழுத்து, எளிய சொற்கள், பெரிய பொத்தான்கள்', language: 'மொழி', languageDescription: 'மொழியைத் தேர்ந்தெடுக்கவும்', about: 'இந்த வலைத்தளம் பற்றி', aboutText: 'ரயில்வே தகவலைப் புரிந்துகொண்டு பயன்படுத்த இந்த வலைத்தளம் உதவுகிறது.', savedPassengers: 'சேமித்த பயணிகள்', manage: 'நிர்வகிக்கவும்', trustFirst: 'நம்பிக்கை முதலில்', trustText: 'டெமோ தரவு மட்டுமே. உண்மையான முன்பதிவு அல்லது பணம் இணைக்கப்படவில்லை.' },
  gujarati: { home: 'હોમ', search: 'ટ્રેન શોધો', trips: 'મારી મુસાફરી', alerts: 'ચેતવણીઓ', profile: 'પ્રોફાઇલ', where: 'તમે ક્યાં જઈ રહ્યા છો?', find: 'ટ્રેન શોધો', companion: 'સરળ ટ્રેન મુસાફરી', from: 'ક્યાંથી', to: 'ક્યાં', date: 'મુસાફરીની તારીખ', passengers: 'મુસાફરો', className: 'વર્ગ', fromHint: 'શરૂઆતનું સ્ટેશન', toHint: 'ગંતવ્ય સ્ટેશન', tip: 'સૂચન: “મુંબઈથી પુણે” અજમાવો.', nextJourney: 'તમારી આગામી મુસાફરી', nextJourneyCaption: 'મહત્વની વિગતો નજીક રહેશે.', seeAllTrips: 'બધી મુસાફરી જુઓ', quickActions: 'ઝડપી કાર્યો', quickActionsCaption: 'સામાન્ય કાર્યો, એક ટૅપમાં.', findTrain: 'ટ્રેન શોધો', findTrainCaption: 'વિકલ્પોની સરખામણી કરો', checkTicket: 'ટિકિટ જુઓ', checkTicketCaption: 'મુસાફરીની સ્થિતિ જુઓ', viewAlerts: 'ચેતવણીઓ જુઓ', viewAlertsCaption: 'તમારા માટે 2 અપડેટ્સ', built: 'સરળ મુસાફરી માટે બનાવેલ', important: 'રેલવેના અઘરા શબ્દો વિના મહત્વની બાબતો.', profileTitle: 'પ્રોફાઇલ અને પસંદગીઓ', profileLede: 'તમારી મુસાફરી પ્રમાણે અનુભવ બદલો.', easyMode: 'સરળ મોડ', easyDescription: 'મોટું લખાણ, સરળ શબ્દો, મોટા બટન', language: 'ભાષા', languageDescription: 'ભાષા પસંદ કરો', about: 'આ વેબસાઇટ વિશે', aboutText: 'આ વેબસાઇટ રેલવેની માહિતી સમજવી અને ઉપયોગમાં લેવી સરળ બનાવે છે.', savedPassengers: 'સાચવેલા મુસાફરો', manage: 'સંચાલિત કરો', trustFirst: 'વિશ્વાસ પહેલાં', trustText: 'માત્ર ડેમો ડેટા. વાસ્તવિક બુકિંગ કે ચુકવણી જોડાયેલ નથી.' },
  kannada: { home: 'ಮುಖಪುಟ', search: 'ರೈಲು ಹುಡುಕಿ', trips: 'ನನ್ನ ಪ್ರಯಾಣಗಳು', alerts: 'ಎಚ್ಚರಿಕೆಗಳು', profile: 'ಪ್ರೊಫೈಲ್', where: 'ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?', find: 'ರೈಲು ಹುಡುಕಿ', companion: 'ಸರಳ ರೈಲು ಪ್ರಯಾಣ', from: 'ಎಲ್ಲಿಂದ', to: 'ಎಲ್ಲಿಗೆ', date: 'ಪ್ರಯಾಣದ ದಿನಾಂಕ', passengers: 'ಪ್ರಯಾಣಿಕರು', className: 'ವರ್ಗ', fromHint: 'ಆರಂಭಿಕ ನಿಲ್ದಾಣ', toHint: 'ಗಮ್ಯಸ್ಥಾನ ನಿಲ್ದಾಣ', tip: 'ಸಲಹೆ: “ಮುಂಬೈನಿಂದ ಪುಣೆ” ಪ್ರಯತ್ನಿಸಿ.', nextJourney: 'ನಿಮ್ಮ ಮುಂದಿನ ಪ್ರಯಾಣ', nextJourneyCaption: 'ಮುಖ್ಯ ವಿವರಗಳು ಹತ್ತಿರದಲ್ಲೇ ಇರುತ್ತವೆ.', seeAllTrips: 'ಎಲ್ಲಾ ಪ್ರಯಾಣಗಳನ್ನು ನೋಡಿ', quickActions: 'ತ್ವರಿತ ಕಾರ್ಯಗಳು', quickActionsCaption: 'ಸಾಮಾನ್ಯ ಕೆಲಸಗಳು, ಒಂದೇ ಟ್ಯಾಪ್‌ನಲ್ಲಿ.', findTrain: 'ರೈಲು ಹುಡುಕಿ', findTrainCaption: 'ಆಯ್ಕೆಗಳನ್ನು ಹೋಲಿಸಿ', checkTicket: 'ಟಿಕೆಟ್ ನೋಡಿ', checkTicketCaption: 'ಪ್ರಯಾಣದ ಸ್ಥಿತಿ ನೋಡಿ', viewAlerts: 'ಎಚ್ಚರಿಕೆಗಳನ್ನು ನೋಡಿ', viewAlertsCaption: 'ನಿಮಗಾಗಿ 2 ಅಪ್‌ಡೇಟ್‌ಗಳು', built: 'ಸರಳ ಪ್ರಯಾಣಗಳಿಗಾಗಿ', important: 'ರೈಲ್ವೆಯ ಕಠಿಣ ಪದಗಳಿಲ್ಲದೆ ಮುಖ್ಯ ವಿಷಯಗಳು.', profileTitle: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಆದ್ಯತೆಗಳು', profileLede: 'ನಿಮ್ಮ ಪ್ರಯಾಣಕ್ಕೆ ತಕ್ಕಂತೆ ಅನುಭವ ಬದಲಿಸಿ.', easyMode: 'ಸುಲಭ ಮೋಡ್', easyDescription: 'ದೊಡ್ಡ ಪಠ್ಯ, ಸರಳ ಪದಗಳು, ದೊಡ್ಡ ಬಟನ್‌ಗಳು', language: 'ಭಾಷೆ', languageDescription: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', about: 'ಈ ವೆಬ್‌ಸೈಟ್ ಬಗ್ಗೆ', aboutText: 'ರೈಲ್ವೆ ಮಾಹಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಬಳಸಲು ಈ ವೆಬ್‌ಸೈಟ್ ಸಹಾಯ ಮಾಡುತ್ತದೆ.', savedPassengers: 'ಉಳಿಸಿದ ಪ್ರಯಾಣಿಕರು', manage: 'ನಿರ್ವಹಿಸಿ', trustFirst: 'ನಂಬಿಕೆ ಮೊದಲು', trustText: 'ಡೆಮೋ ಡೇಟಾ ಮಾತ್ರ. ನಿಜವಾದ ಬುಕಿಂಗ್ ಅಥವಾ ಪಾವತಿ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ.' },
  malayalam: { home: 'ഹോം', search: 'ട്രെയിൻ തിരയുക', trips: 'എന്റെ യാത്രകൾ', alerts: 'അറിയിപ്പുകൾ', profile: 'പ്രൊഫൈൽ', where: 'നിങ്ങൾ എവിടേക്കാണ് പോകുന്നത്?', find: 'ട്രെയിൻ തിരയുക', companion: 'എളുപ്പമുള്ള ട്രെയിൻ യാത്ര', from: 'എവിടെ നിന്ന്', to: 'എവിടേക്ക്', date: 'യാത്രാ തീയതി', passengers: 'യാത്രക്കാർ', className: 'ക്ലാസ്', fromHint: 'തുടക്ക സ്റ്റേഷൻ', toHint: 'ലക്ഷ്യ സ്റ്റേഷൻ', tip: 'സൂചന: “മുംബൈ മുതൽ പൂനെ” പരീക്ഷിക്കുക.', nextJourney: 'നിങ്ങളുടെ അടുത്ത യാത്ര', nextJourneyCaption: 'പ്രധാന വിവരങ്ങൾ അടുത്തുതന്നെ ഉണ്ടാകും.', seeAllTrips: 'എല്ലാ യാത്രകളും കാണുക', quickActions: 'വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ', quickActionsCaption: 'സാധാരണ ജോലികൾ, ഒറ്റ ടാപ്പിൽ.', findTrain: 'ട്രെയിൻ തിരയുക', findTrainCaption: 'ഓപ്ഷനുകൾ താരതമ്യം ചെയ്യുക', checkTicket: 'ടിക്കറ്റ് കാണുക', checkTicketCaption: 'യാത്രാ നില കാണുക', viewAlerts: 'അറിയിപ്പുകൾ കാണുക', viewAlertsCaption: 'നിങ്ങൾക്കായി 2 അപ്‌ഡേറ്റുകൾ', built: 'ലളിതമായ യാത്രകൾക്കായി', important: 'റെയിൽവേയിലെ ബുദ്ധിമുട്ടുള്ള പദങ്ങളില്ലാതെ പ്രധാന കാര്യങ്ങൾ.', profileTitle: 'പ്രൊഫൈലും മുൻഗണനകളും', profileLede: 'നിങ്ങളുടെ യാത്രയ്ക്ക് അനുയോജ്യമായി മാറ്റുക.', easyMode: 'എളുപ്പ മോഡ്', easyDescription: 'വലിയ എഴുത്ത്, ലളിതമായ വാക്കുകൾ, വലിയ ബട്ടണുകൾ', language: 'ഭാഷ', languageDescription: 'ഭാഷ തിരഞ്ഞെടുക്കുക', about: 'ഈ വെബ്സൈറ്റിനെക്കുറിച്ച്', aboutText: 'റെയിൽവേ വിവരങ്ങൾ മനസ്സിലാക്കാനും ഉപയോഗിക്കാനും ഈ വെബ്സൈറ്റ് സഹായിക്കുന്നു.', savedPassengers: 'സേവ് ചെയ്ത യാത്രക്കാർ', manage: 'നിയന്ത്രിക്കുക', trustFirst: 'വിശ്വാസം ആദ്യം', trustText: 'ഡെമോ ഡാറ്റ മാത്രം. യഥാർത്ഥ ബുക്കിംഗോ പണമടയ്ക്കലോ ബന്ധിപ്പിച്ചിട്ടില്ല.' },
  odia: { home: 'ମୂଳପୃଷ୍ଠା', search: 'ଟ୍ରେନ ଖୋଜନ୍ତୁ', trips: 'ମୋର ଯାତ୍ରା', alerts: 'ସତର୍କତା', profile: 'ପ୍ରୋଫାଇଲ', where: 'ଆପଣ କୁଆଡ଼େ ଯାଉଛନ୍ତି?', find: 'ଟ୍ରେନ ଖୋଜନ୍ତୁ', companion: 'ସରଳ ଟ୍ରେନ ଯାତ୍ରା', from: 'କେଉଁଠାରୁ', to: 'କୁଆଡ଼େ', date: 'ଯାତ୍ରା ତାରିଖ', passengers: 'ଯାତ୍ରୀ', className: 'ଶ୍ରେଣୀ', fromHint: 'ଆରମ୍ଭ ଷ୍ଟେସନ', toHint: 'ଗନ୍ତବ୍ୟ ଷ୍ଟେସନ', tip: 'ସୂଚନା: “ମୁମ୍ବାଇରୁ ପୁଣେ” ଚେଷ୍ଟା କରନ୍ତୁ।', nextJourney: 'ଆପଣଙ୍କ ପରବର୍ତ୍ତୀ ଯାତ୍ରା', nextJourneyCaption: 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ବିବରଣୀ ପାଖରେ ରହିବ।', seeAllTrips: 'ସମସ୍ତ ଯାତ୍ରା ଦେଖନ୍ତୁ', quickActions: 'ତୁରନ୍ତ କାର୍ଯ୍ୟ', quickActionsCaption: 'ସାଧାରଣ କାମ, ଗୋଟିଏ ଟ୍ୟାପରେ।', findTrain: 'ଟ୍ରେନ ଖୋଜନ୍ତୁ', findTrainCaption: 'ବିକଳ୍ପ ତୁଳନା କରନ୍ତୁ', checkTicket: 'ଟିକେଟ ଦେଖନ୍ତୁ', checkTicketCaption: 'ଯାତ୍ରା ସ୍ଥିତି ଦେଖନ୍ତୁ', viewAlerts: 'ସତର୍କତା ଦେଖନ୍ତୁ', viewAlertsCaption: 'ଆପଣଙ୍କ ପାଇଁ 2ଟି ଅପଡେଟ', built: 'ସରଳ ଯାତ୍ରା ପାଇଁ ତିଆରି', important: 'ରେଳବାଇର କଠିନ ଶବ୍ଦ ବିନା ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କଥା।', profileTitle: 'ପ୍ରୋଫାଇଲ ଏବଂ ପସନ୍ଦ', profileLede: 'ଆପଣଙ୍କ ଯାତ୍ରା ଅନୁସାରେ ବଦଳାନ୍ତୁ।', easyMode: 'ସହଜ ମୋଡ', easyDescription: 'ବଡ଼ ଅକ୍ଷର, ସରଳ ଶବ୍ଦ, ବଡ଼ ବଟନ', language: 'ଭାଷା', languageDescription: 'ଭାଷା ବାଛନ୍ତୁ', about: 'ଏହି ୱେବସାଇଟ ବିଷୟରେ', aboutText: 'ରେଳବାଇ ସୂଚନା ବୁଝିବା ଏବଂ ବ୍ୟବହାର କରିବାକୁ ଏହି ୱେବସାଇଟ ସହଜ କରେ।', savedPassengers: 'ସଞ୍ଚିତ ଯାତ୍ରୀ', manage: 'ପରିଚାଳନା କରନ୍ତୁ', trustFirst: 'ବିଶ୍ୱାସ ପ୍ରଥମେ', trustText: 'କେବଳ ଡେମୋ ଡାଟା। ପ୍ରକୃତ ବୁକିଂ କିମ୍ବା ପେମେଣ୍ଟ ନାହିଁ।' },
  punjabi: { home: 'ਹੋਮ', search: 'ਰੇਲਗੱਡੀ ਲੱਭੋ', trips: 'ਮੇਰੀਆਂ ਯਾਤਰਾਵਾਂ', alerts: 'ਸੂਚਨਾਵਾਂ', profile: 'ਪ੍ਰੋਫ਼ਾਈਲ', where: 'ਤੁਸੀਂ ਕਿੱਥੇ ਜਾ ਰਹੇ ਹੋ?', find: 'ਰੇਲਗੱਡੀ ਲੱਭੋ', companion: 'ਸੌਖੀ ਰੇਲ ਯਾਤਰਾ', from: 'ਕਿੱਥੋਂ', to: 'ਕਿੱਥੇ', date: 'ਯਾਤਰਾ ਦੀ ਮਿਤੀ', passengers: 'ਯਾਤਰੀ', className: 'ਸ਼੍ਰੇਣੀ', fromHint: 'ਸ਼ੁਰੂਆਤੀ ਸਟੇਸ਼ਨ', toHint: 'ਮੰਜ਼ਿਲ ਸਟੇਸ਼ਨ', tip: 'ਸੁਝਾਅ: “ਮੁੰਬਈ ਤੋਂ ਪੁਣੇ” ਅਜ਼ਮਾਓ।', nextJourney: 'ਤੁਹਾਡੀ ਅਗਲੀ ਯਾਤਰਾ', nextJourneyCaption: 'ਜ਼ਰੂਰੀ ਜਾਣਕਾਰੀ ਨੇੜੇ ਰਹੇਗੀ।', seeAllTrips: 'ਸਾਰੀਆਂ ਯਾਤਰਾਵਾਂ', quickActions: 'ਤੁਰੰਤ ਕੰਮ', quickActionsCaption: 'ਆਮ ਕੰਮ, ਇੱਕ ਟੈਪ ਵਿੱਚ।', findTrain: 'ਰੇਲਗੱਡੀ ਲੱਭੋ', findTrainCaption: 'ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ', checkTicket: 'ਟਿਕਟ ਵੇਖੋ', checkTicketCaption: 'ਯਾਤਰਾ ਦੀ ਸਥਿਤੀ ਵੇਖੋ', viewAlerts: 'ਸੂਚਨਾਵਾਂ ਵੇਖੋ', viewAlertsCaption: 'ਤੁਹਾਡੇ ਲਈ 2 ਅੱਪਡੇਟ', built: 'ਸੌਖੀਆਂ ਯਾਤਰਾਵਾਂ ਲਈ ਬਣਾਇਆ', important: 'ਰੇਲਵੇ ਦੀ ਔਖੀ ਭਾਸ਼ਾ ਤੋਂ ਬਿਨਾਂ ਜ਼ਰੂਰੀ ਗੱਲਾਂ।', profileTitle: 'ਪ੍ਰੋਫ਼ਾਈਲ ਅਤੇ ਪਸੰਦਾਂ', profileLede: 'ਆਪਣੀ ਯਾਤਰਾ ਮੁਤਾਬਕ ਤਜਰਬਾ ਬਦਲੋ।', easyMode: 'ਸੌਖਾ ਮੋਡ', easyDescription: 'ਵੱਡਾ ਲਿਖਤ, ਸੌਖੇ ਸ਼ਬਦ, ਵੱਡੇ ਬਟਨ', language: 'ਭਾਸ਼ਾ', languageDescription: 'ਭਾਸ਼ਾ ਚੁਣੋ', about: 'ਇਸ ਵੈੱਬਸਾਈਟ ਬਾਰੇ', aboutText: 'ਇਹ ਵੈੱਬਸਾਈਟ ਰੇਲਵੇ ਜਾਣਕਾਰੀ ਨੂੰ ਸਮਝਣਾ ਅਤੇ ਵਰਤਣਾ ਸੌਖਾ ਬਣਾਉਂਦੀ ਹੈ।', savedPassengers: 'ਸੰਭਾਲੇ ਯਾਤਰੀ', manage: 'ਪ੍ਰਬੰਧ ਕਰੋ', trustFirst: 'ਭਰੋਸਾ ਪਹਿਲਾਂ', trustText: 'ਸਿਰਫ਼ ਡੈਮੋ ਡੇਟਾ। ਅਸਲ ਬੁਕਿੰਗ ਜਾਂ ਭੁਗਤਾਨ ਨਹੀਂ ਹੈ।' },
  assamese: { home: 'হোম', search: 'ৰেল বিচাৰক', trips: 'মোৰ যাত্ৰা', alerts: 'জাননী', profile: 'প্ৰফাইল', where: 'আপুনি ক’লৈ গৈ আছে?', find: 'ৰেল বিচাৰক', companion: 'সহজ ৰেল যাত্ৰা', from: 'ক’ৰ পৰা', to: 'ক’লৈ', date: 'যাত্ৰাৰ তাৰিখ', passengers: 'যাত্ৰী', className: 'শ্ৰেণী', fromHint: 'আৰম্ভণি ষ্টেচন', toHint: 'গন্তব্য ষ্টেচন', tip: 'পৰামৰ্শ: “মুম্বাইৰ পৰা পুনে” চেষ্টা কৰক।', nextJourney: 'আপোনাৰ পৰৱৰ্তী যাত্ৰা', nextJourneyCaption: 'গুৰুত্বপূৰ্ণ তথ্য ওচৰতে থাকিব।', seeAllTrips: 'সকলো যাত্ৰা চাওক', quickActions: 'দ্ৰুত কাম', quickActionsCaption: 'সাধাৰণ কাম, এটা টেপতে।', findTrain: 'ৰেল বিচাৰক', findTrainCaption: 'বিকল্প তুলনা কৰক', checkTicket: 'টিকট চাওক', checkTicketCaption: 'যাত্ৰাৰ অৱস্থা চাওক', viewAlerts: 'জাননী চাওক', viewAlertsCaption: 'আপোনাৰ বাবে 2টা আপডেট', built: 'সহজ যাত্ৰাৰ বাবে নিৰ্মিত', important: 'ৰেলৱেৰ কঠিন শব্দ নোহোৱাকৈ গুৰুত্বপূৰ্ণ কথাবোৰ।', profileTitle: 'প্ৰফাইল আৰু পছন্দ', profileLede: 'আপোনাৰ যাত্ৰা অনুসৰি অভিজ্ঞতা সলনি কৰক।', easyMode: 'সহজ মোড', easyDescription: 'ডাঙৰ লিখনি, সহজ শব্দ, ডাঙৰ বুটাম', language: 'ভাষা', languageDescription: 'ভাষা বাছক', about: 'এই ৱেবছাইটৰ বিষয়ে', aboutText: 'এই ৱেবছাইটে ৰেলৱেৰ তথ্য বুজিবলৈ আৰু ব্যৱহাৰ কৰিবলৈ সহজ কৰে।', savedPassengers: 'সংৰক্ষিত যাত্ৰী', manage: 'পৰিচালনা কৰক', trustFirst: 'বিশ্বাস প্ৰথমে', trustText: 'কেৱল ডেমো তথ্য। কোনো প্ৰকৃত বুকিং বা পেমেণ্ট সংযোগ কৰা হোৱা নাই।' },
}

const languageActions: Record<Language, { update: string; voice: string; tryVoice: string }> = {
  english: { update: 'Update results', voice: 'Search by voice', tryVoice: 'Try speaking' },
  hindi: { update: 'नतीजे अपडेट करें', voice: 'आवाज़ से खोजें', tryVoice: 'बोलकर खोजें' },
  bengali: { update: 'ফলাফল আপডেট করুন', voice: 'কথা বলে খুঁজুন', tryVoice: 'কথা বলে চেষ্টা করুন' },
  telugu: { update: 'ఫలితాలను నవీకరించండి', voice: 'వాయిస్‌తో వెతకండి', tryVoice: 'మాట్లాడి ప్రయత్నించండి' },
  marathi: { update: 'निकाल अपडेट करा', voice: 'आवाजाने शोधा', tryVoice: 'बोलून शोधा' },
  tamil: { update: 'முடிவுகளைப் புதுப்பிக்கவும்', voice: 'குரலில் தேடுங்கள்', tryVoice: 'பேசிப் பார்க்கவும்' },
  gujarati: { update: 'પરિણામ અપડેટ કરો', voice: 'અવાજથી શોધો', tryVoice: 'બોલીને અજમાવો' },
  kannada: { update: 'ಫಲಿತಾಂಶಗಳನ್ನು ನವೀಕರಿಸಿ', voice: 'ಧ್ವನಿಯಿಂದ ಹುಡುಕಿ', tryVoice: 'ಮಾತನಾಡಿ ಪ್ರಯತ್ನಿಸಿ' },
  malayalam: { update: 'ഫലങ്ങൾ പുതുക്കുക', voice: 'ശബ്ദം ഉപയോഗിച്ച് തിരയുക', tryVoice: 'സംസാരിച്ച് ശ്രമിക്കുക' },
  odia: { update: 'ଫଳାଫଳ ଅପଡେଟ କରନ୍ତୁ', voice: 'କଥା କହି ଖୋଜନ୍ତୁ', tryVoice: 'କଥା କହି ଚେଷ୍ଟା କରନ୍ତୁ' },
  punjabi: { update: 'ਨਤੀਜੇ ਅੱਪਡੇਟ ਕਰੋ', voice: 'ਆਵਾਜ਼ ਨਾਲ ਲੱਭੋ', tryVoice: 'ਬੋਲ ਕੇ ਅਜ਼ਮਾਓ' },
  assamese: { update: 'ফলাফল আপডেট কৰক', voice: 'কথা কৈ বিচাৰক', tryVoice: 'কথা কৈ চেষ্টা কৰক' },
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

function formatDate(value: string) {
  if (!value) return 'Choose a date'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const routeAdjustments: Record<string, Array<{ departure: string; arrival: string; duration: string; fareDelta: number }>> = {
  'jaipur|bengaluru': [
    { departure: '06:10', arrival: '13:20', duration: '7h 10m', fareDelta: 140 },
    { departure: '05:20', arrival: '11:45', duration: '6h 25m', fareDelta: 180 },
    { departure: '19:40', arrival: '07:15', duration: '11h 35m', fareDelta: 80 },
    { departure: '14:10', arrival: '21:55', duration: '7h 45m', fareDelta: 110 },
  ],
  'mumbai central|pune': [
    { departure: '06:40', arrival: '10:35', duration: '3h 55m', fareDelta: -90 },
    { departure: '07:15', arrival: '10:20', duration: '3h 05m', fareDelta: -120 },
    { departure: '22:00', arrival: '05:20', duration: '7h 20m', fareDelta: -80 },
    { departure: '15:10', arrival: '19:00', duration: '3h 50m', fareDelta: -70 },
  ],
}

function buildTrainResults(criteria: SearchCriteria) {
  const from = criteria.from.trim() || 'Starting station'
  const to = criteria.to.trim() || 'Destination station'
  const routeKey = `${from.toLowerCase()}|${to.toLowerCase()}`
  const adjustments = routeAdjustments[routeKey]
  return trainResults.map((train, index) => {
    const adjustment = adjustments?.[index]
    const { fareDelta = 0, ...routeDetails } = adjustment ?? {}
    return { ...train, ...routeDetails, fare: train.fare + fareDelta, from, to, className: criteria.className === 'Any class' ? train.className : criteria.className }
  })
}

function App() {
  const [view, setView] = useState<View>('home')
  const [filter, setFilter] = useState<ResultFilter>('best')
  const [selectedTrain, setSelectedTrain] = useState<TrainResult>(trainResults[0])
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(defaultSearchCriteria)
  const [searchedCriteria, setSearchedCriteria] = useState<SearchCriteria>(defaultSearchCriteria)
  const [easyMode, setEasyMode] = useState(false)
  const [language, setLanguage] = useState<Language>('english')
  const [delayed, setDelayed] = useState(false)
  const [seatWatchActive, setSeatWatchActive] = useState(false)
  const [toast, setToast] = useState('')
  const [voiceListening, setVoiceListening] = useState(false)
  const [voiceDraft, setVoiceDraft] = useState('')
  const copy = { ...languageCopy[language], ...languageActions[language] }

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const goTo = (nextView: View) => {
    setView(nextView)
  }

  const visibleResults = useMemo(() => {
    const recommendationResults = getRecommendations({ from: searchedCriteria.from, to: searchedCriteria.to, travelDate: searchedCriteria.date, timePreference: searchedCriteria.timePreference === 'Any time' ? undefined : searchedCriteria.timePreference.toLocaleLowerCase().replace(' ', '-') as 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night', className: searchedCriteria.className, passengers: Number.parseInt(searchedCriteria.passengers, 10) || 1, source: 'typed', language }).results
    const legacyRouteKey = `${searchedCriteria.from.toLowerCase()}|${searchedCriteria.to.toLowerCase()}`
    const sourceResults = routeAdjustments[legacyRouteKey] ? buildTrainResults(searchedCriteria) : recommendationResults.length ? recommendationResults : buildTrainResults(searchedCriteria)
    const results = sourceResults
    if (filter === 'best') return results
    return [...results].sort((first, second) => {
      if (filter === 'cheapest') return first.fare - second.fare
      if (filter === 'fastest') return first.duration.localeCompare(second.duration)
      return Number(second.availability === 'available') - Number(first.availability === 'available')
    })
  }, [filter, searchedCriteria, language])

  const updateSearchField = (field: SearchField, value: string) => {
    setSearchCriteria((current) => ({ ...current, [field]: value }))
  }

  const handleSearch = () => {
    setSearchedCriteria(searchCriteria)
    goTo('search')
    setToast('Showing journeys that fit your travel needs.')
  }

  const updateResults = () => {
    setSearchedCriteria(searchCriteria)
    setToast('Your journey options are updated.')
  }

  const handleVoiceSearch = () => {
    const controller = createVoiceRecognition({ language, onStart: () => setVoiceListening(true), onEnd: () => setVoiceListening(false), onError: () => { setVoiceListening(false); setToast('We could not hear that. Please type your route instead.') }, onTranscript: (transcript) => { const parsed = parseJourneyText(transcript, language, { travelDate: searchCriteria.date, className: searchCriteria.className, passengers: Number.parseInt(searchCriteria.passengers, 10) || 1 }); setVoiceListening(false); if (!parsed.requestPatch.from || !parsed.requestPatch.to) { setVoiceDraft(transcript); setToast('We heard you. Please check the route fields below.'); return } setSearchCriteria((current) => ({ ...current, from: parsed.requestPatch.from ?? current.from, to: parsed.requestPatch.to ?? current.to, date: parsed.requestPatch.travelDate ?? current.date })); setToast(`${parsed.message} Check the fields, then find trains.`) } })
    if (!controller.isSupported) { setToast('Voice input is unavailable here. Type the route below instead.'); return }
    try { controller.start() } catch { setVoiceListening(false); setToast('Voice search could not start. Please type your stations instead.') }
  }

  const applyVoiceDraft = () => {
    const parsed = parseJourneyText(voiceDraft, language, { travelDate: searchCriteria.date, className: searchCriteria.className, passengers: Number.parseInt(searchCriteria.passengers, 10) || 1 })
    if (!parsed.requestPatch.from || !parsed.requestPatch.to) {
      setToast('Try a route like “Mumbai to Pune”.')
      return
    }
    setSearchCriteria((current) => ({ ...current, from: parsed.requestPatch.from ?? current.from, to: parsed.requestPatch.to ?? current.to, date: parsed.requestPatch.travelDate ?? current.date }))
    setVoiceDraft('')
    setToast('Route added. Check the fields, then find trains.')
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
    const selectedLanguage = languageOptions.find((option) => option.id === nextLanguage)?.label ?? 'English'
    setToast(`${selectedLanguage} selected. The current demo stays in English.`)
  }

  return <div className={`app-shell ${easyMode ? 'easy-mode' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="main-column">
      <header className="topbar site-header">
        <div className="site-header-inner"><Brand onNavigate={() => goTo('home')} /><PrimaryNavigation activeView={view} onNavigate={goTo} copy={copy} /><div className="header-actions"><button className="header-help" type="button" onClick={() => setToast('Help centre preview coming next.')}><Info size={15} aria-hidden="true" />Help</button><button className="profile-chip" type="button" onClick={() => goTo('profile')}><span className="avatar">RK</span><span className="profile-name">Riya Kapoor</span><ChevronRight size={15} aria-hidden="true" /></button></div></div>
      </header>
      <main id="main-content" className="content-area">
        {view === 'home' && <HomeView copy={copy} criteria={searchCriteria} voiceListening={voiceListening} voiceDraft={voiceDraft} onVoiceSearch={handleVoiceSearch} onVoiceDraftChange={setVoiceDraft} onApplyVoiceDraft={applyVoiceDraft} onChange={updateSearchField} onSearch={handleSearch} onNavigate={goTo} />}
        {view === 'search' && <SearchView copy={copy} criteria={searchCriteria} resultCriteria={searchedCriteria} voiceListening={voiceListening} voiceDraft={voiceDraft} onVoiceSearch={handleVoiceSearch} onVoiceDraftChange={setVoiceDraft} onApplyVoiceDraft={applyVoiceDraft} visibleResults={visibleResults} onChange={updateSearchField} onUpdate={updateResults} filter={filter} onFilter={setFilter} onChoose={chooseTrain} onAnnounce={setToast} />}
        {view === 'booking' && <BookingView train={selectedTrain} onBack={() => goTo('search')} onComplete={() => { goTo('ticket'); setToast('Booking confirmed in demo mode.') }} />}
        {view === 'ticket' && <TicketView train={selectedTrain} onJourney={() => goTo('journey')} onSave={() => setToast('Ticket saved for offline access on this device.')} />}
        {view === 'trips' && <TripsView train={selectedTrain} seatWatchActive={seatWatchActive} onJourney={() => goTo('journey')} onTicket={() => goTo('ticket')} onSearch={() => goTo('search')} />}
        {view === 'journey' && <JourneyView train={selectedTrain} delayed={delayed} onDelay={() => { setDelayed(true); setToast('Journey updated: a 90-minute delay needs your attention.') }} onAnnounce={setToast} />}
        {view === 'alerts' && <AlertsView train={selectedTrain} delayed={delayed} onJourney={() => goTo('journey')} />}
        {view === 'profile' && <ProfileView copy={copy} easyMode={easyMode} language={language} onEasyMode={() => { setEasyMode((current) => !current); setToast(!easyMode ? 'Easy Mode is on.' : 'Easy Mode is off.') }} onLanguage={chooseLanguage} />}
      </main>
    </div>
    <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
  </div>
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return <a className="brand" href="#main-content" aria-label="Indian Railways home" onClick={(event) => { if (!onNavigate) return; event.preventDefault(); onNavigate() }}><span className="brand-mark"><TrainFront size={20} aria-hidden="true" /></span><span><strong>Indian <span>Railways</span></strong><small>Simple travel, clear choices</small></span></a>
}

function PrimaryNavigation({ activeView, onNavigate, copy }: { activeView: View; onNavigate: (view: View) => void; copy: Record<string, string> }) {
  return <nav className="primary-nav" aria-label="Main website navigation">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={activeView === id ? 'page' : undefined} onClick={() => onNavigate(id)}><Icon size={16} aria-hidden="true" /><span>{copy[id] ?? label}</span>{id === 'alerts' && <em>2</em>}</button>)}</nav>
}

function HomeView({ copy, criteria, voiceListening, voiceDraft, onVoiceSearch, onVoiceDraftChange, onApplyVoiceDraft, onChange, onSearch, onNavigate }: { copy: Record<string, string>; criteria: SearchCriteria; voiceListening: boolean; voiceDraft: string; onVoiceSearch: () => void; onVoiceDraftChange: (value: string) => void; onApplyVoiceDraft: () => void; onChange: (field: SearchField, value: string) => void; onSearch: () => void; onNavigate: (view: View) => void }) {
  return <><section className="home-hero"><div className="eyebrow"><Compass size={14} aria-hidden="true" />{copy.companion}</div><h1>{copy.where}</h1><p className="lede">{copy.important}</p>
    <section className="search-card" aria-label="Find a train"><div className="search-fields"><Field label={copy.from} value={criteria.from} icon={<MapPin size={17} aria-hidden="true" />} ariaLabel="Starting station" suggestions={stationOptions} onChange={(value) => onChange('from', value)} hint={copy.fromHint} /><Field label={copy.to} value={criteria.to} icon={<NavigationIcon size={17} aria-hidden="true" />} ariaLabel="Destination station" suggestions={stationOptions} onChange={(value) => onChange('to', value)} hint={copy.toHint} /><Field label={copy.date} value={criteria.date} icon={<CalendarDays size={17} aria-hidden="true" />} ariaLabel="Travel date" inputType="date" onChange={(value) => onChange('date', value)} /><Field label={copy.passengers} value={criteria.passengers} icon={<UserRound size={17} aria-hidden="true" />} ariaLabel="Passengers" select options={['1 adult', '2 adults', 'Family']} onChange={(value) => onChange('passengers', value)} /><Field label={copy.className} value={criteria.className} icon={<TrainFront size={17} aria-hidden="true" />} ariaLabel="Travel class" select options={classOptions} onChange={(value) => onChange('className', value)} /></div><div className="search-actions"><button className="primary-button" type="button" onClick={onSearch}><Search size={17} aria-hidden="true" />{copy.find}</button><button className={`voice-button ${voiceListening ? 'listening' : ''}`} type="button" aria-pressed={voiceListening} onClick={onVoiceSearch}><Mic size={17} aria-hidden="true" />{voiceListening ? 'Listening…' : copy.tryVoice}</button></div><VoiceFallback draft={voiceDraft} onChange={onVoiceDraftChange} onApply={onApplyVoiceDraft} /><p className="search-hint">{copy.tip}</p></section>
    <SectionHeading title={copy.nextJourney} caption={copy.nextJourneyCaption} action={copy.seeAllTrips} onAction={() => onNavigate('trips')} /><section className="next-trip-card"><div className="next-trip-copy"><span className="small-label">Upcoming · Sat, 29 Aug</span><h2>Chennai Central <ArrowRight size={18} aria-hidden="true" /> Bengaluru</h2><p>Brindavan Express · Coach S3 · Seat 42</p><div className="trip-meta"><span><Clock3 size={14} aria-hidden="true" />Departs 07:40 AM</span><span><MapPin size={14} aria-hidden="true" />Platform 6</span><span className="on-time"><CircleCheck size={14} aria-hidden="true" />On time</span></div></div><div className="countdown"><strong>1 day</strong><span>until departure</span><button className="light-button" type="button" onClick={() => onNavigate('journey')}>Open journey mode <ArrowRight size={15} aria-hidden="true" /></button></div></section>
    <SectionHeading title={copy.quickActions} caption={copy.quickActionsCaption} /><div className="quick-grid"><QuickAction icon={<CalendarSearch size={20} aria-hidden="true" />} title={copy.findTrain} caption={copy.findTrainCaption} onClick={() => onNavigate('search')} /><QuickAction icon={<ScanLine size={20} aria-hidden="true" />} title={copy.checkTicket} caption={copy.checkTicketCaption} onClick={() => onNavigate('ticket')} /><QuickAction icon={<BellRing size={20} aria-hidden="true" />} title={copy.viewAlerts} caption={copy.viewAlertsCaption} onClick={() => onNavigate('alerts')} /></div><div className="info-strip"><Info size={18} aria-hidden="true" /><div><strong>One thing to know</strong><span>Your next journey departs from Platform 6. We’ll tell you if anything changes.</span></div></div>
    </section><WebsiteBenefits copy={copy} onNavigate={onNavigate} />
  </>
}

function WebsiteBenefits({ copy, onNavigate }: { copy: Record<string, string>; onNavigate: (view: View) => void }) {
  return <section className="website-benefits" aria-labelledby="benefits-heading"><div className="benefits-intro"><div><span className="eyebrow"><ShieldCheck size={14} aria-hidden="true" />{copy.built}</span><h2 id="benefits-heading">{copy.important}</h2></div><p>{copy.important}</p></div><div className="benefits-grid"><article><span className="benefit-icon"><Compass size={20} aria-hidden="true" /></span><h3>{copy.findTrain}</h3><p>{copy.findTrainCaption}</p></article><article><span className="benefit-icon"><Accessibility size={20} aria-hidden="true" /></span><h3>{copy.easyMode}</h3><p>{copy.easyDescription}</p></article><article><span className="benefit-icon"><BellRing size={20} aria-hidden="true" /></span><h3>{copy.alerts}</h3><p>{copy.viewAlertsCaption}</p></article></div><div className="website-cta"><div><strong>{copy.checkTicket}</strong><span>{copy.checkTicketCaption}</span></div><button className="secondary-button" type="button" onClick={() => onNavigate('trips')}>{copy.seeAllTrips} <ArrowRight size={15} aria-hidden="true" /></button></div></section>
}

function SearchView({ copy, criteria, resultCriteria, voiceListening, voiceDraft, onVoiceSearch, onVoiceDraftChange, onApplyVoiceDraft, filter, visibleResults, onChange, onUpdate, onFilter, onChoose, onAnnounce }: { copy: Record<string, string>; criteria: SearchCriteria; resultCriteria: SearchCriteria; voiceListening: boolean; voiceDraft: string; onVoiceSearch: () => void; onVoiceDraftChange: (value: string) => void; onApplyVoiceDraft: () => void; filter: ResultFilter; visibleResults: TrainResult[]; onChange: (field: SearchField, value: string) => void; onUpdate: () => void; onFilter: (filter: ResultFilter) => void; onChoose: (train: TrainResult) => void; onAnnounce: (message: string) => void }) {
  return <><div className="eyebrow"><Search size={14} aria-hidden="true" />{copy.search}</div><h1>{copy.resultsTitle ?? copy.search}</h1><p className="lede">{resultCriteria.from || copy.from} to {resultCriteria.to || copy.to} <span className="muted-dot">·</span> {formatDate(resultCriteria.date)} <span className="muted-dot">·</span> {resultCriteria.passengers}</p><section className="search-card compact-search" aria-label="Update train search"><div className="search-fields"><Field label={copy.from} value={criteria.from} ariaLabel="Starting station" suggestions={stationOptions} onChange={(value) => onChange('from', value)} hint={copy.fromHint} /><Field label={copy.to} value={criteria.to} ariaLabel="Destination station" suggestions={stationOptions} onChange={(value) => onChange('to', value)} hint={copy.toHint} /><Field label={copy.date} value={criteria.date} ariaLabel="Travel date" inputType="date" onChange={(value) => onChange('date', value)} /><Field label={copy.className} value={criteria.className} ariaLabel="Travel class" select options={classOptions} onChange={(value) => onChange('className', value)} /></div><div className="search-actions"><button className="primary-button" type="button" onClick={onUpdate}><Search size={17} aria-hidden="true" />{copy.update}</button><button className={`voice-button ${voiceListening ? 'listening' : ''}`} type="button" aria-pressed={voiceListening} onClick={onVoiceSearch}><Mic size={17} aria-hidden="true" />{voiceListening ? 'Listening…' : copy.voice}</button></div><VoiceFallback draft={voiceDraft} onChange={onVoiceDraftChange} onApply={onApplyVoiceDraft} /><p className="search-hint">{copy.tip}</p></section><div className="results-toolbar"><div><strong>{visibleResults.length} journeys</strong> found <span className="muted-dot">·</span> sorted by what fits you</div><div className="filter-tabs" role="tablist" aria-label="Sort journeys">{([['best', 'Best match'], ['cheapest', 'Cheapest'], ['fastest', 'Fastest'], ['comfortable', 'Comfortable']] as const).map(([id, label]) => <button type="button" key={id} role="tab" aria-selected={filter === id} onClick={() => onFilter(id)}>{label}</button>)}</div></div><div className="result-list" aria-live="polite">{visibleResults.map((train, index) => <TrainCard key={train.id} train={train} featured={index === 0 && filter === 'best'} onChoose={() => onChoose(train)} onAnnounce={onAnnounce} />)}</div><p className="prototype-disclaimer"><ShieldCheck size={14} aria-hidden="true" />Availability, fares, and estimates are demo data, not live railway information.</p></>
}

function TrainCard({ train, featured, onChoose, onAnnounce }: { train: TrainResult; featured: boolean; onChoose: () => void; onAnnounce: (message: string) => void }) {
  const availability = train.availability === 'available' ? <span className="status success"><CircleCheck size={13} aria-hidden="true" />{train.seats} seats left</span> : train.availability === 'waitlist' ? <span className="status wait"><Clock3 size={13} aria-hidden="true" />WL {train.waitlist} · {train.probability}% prototype estimate</span> : <span className="status full"><CircleAlert size={13} aria-hidden="true" />Currently full</span>
  return <article aria-label={train.name} className={`train-card ${featured ? 'featured' : ''}`}>{featured && <div className="recommendation-label"><Sparkles size={14} aria-hidden="true" />Best match <strong>92%</strong></div>}{!featured && train.availability === 'waitlist' && <div className="recommendation-label wait-label"><Clock3 size={14} aria-hidden="true" />Waitlist explained</div>}<div className="train-card-main"><div className="train-info"><h2>{train.name} <span>{train.number}</span></h2><div className="time-row"><div><strong>{train.departure}</strong><span>{train.from}</span></div><div className="duration"><span>{train.duration}</span><i /></div><div><strong>{train.arrival}</strong><span>{train.to}</span></div></div><div className="reason"><span>{train.reason}</span><div className="tag-row">{train.tags.map((tag) => <em key={tag}>{tag}</em>)}</div></div></div><div className="train-card-side"><strong className="fare">{formatCurrency(train.fare)}</strong><span className="class-name">{train.className}</span>{availability}<button className={train.availability === 'available' ? 'primary-button' : 'secondary-button'} type="button" onClick={onChoose}>{train.availability === 'full' ? 'Watch for a seat' : train.availability === 'waitlist' ? 'Understand & choose' : 'Choose this train'}<ArrowRight size={15} aria-hidden="true" /></button>{train.availability === 'waitlist' && <button className="text-button" type="button" onClick={() => onAnnounce(`WL ${train.waitlist} means you are ${train.waitlist}th on the waiting list. This is a demo estimate, not an official forecast.`)}>What does WL mean?</button>}</div></div></article>
}

function BookingView({ train, onBack, onComplete }: { train: TrainResult; onBack: () => void; onComplete: () => void }) {
  return <><div className="stepper" aria-label="Booking progress"><span className="done"><b>1</b>Train</span><i /><span className="current"><b>2</b>Passenger</span><i /><span><b>3</b>Review</span><i /><span><b>4</b>Done</span></div><button className="back-button" type="button" onClick={onBack}>← Back to results</button><div className="eyebrow">One clear step at a time</div><h1>Who is travelling?</h1><p className="lede">{train.name} <span className="muted-dot">·</span> {train.from} to {train.to} <span className="muted-dot">·</span> Sat, 29 Aug</p><div className="booking-layout"><div><section className="panel"><div className="panel-heading"><div><h2>Saved passengers</h2><p>Choose who is travelling.</p></div><UserRound size={20} aria-hidden="true" /></div><label className="passenger-option selected"><span className="person-avatar">RK</span><span><strong>Riya Kapoor</strong><small>Adult · Female</small></span><input type="radio" name="passenger" defaultChecked /> <b>Select</b></label><div className="add-passenger"><span className="plus-icon">+</span><span><strong>Add someone else</strong><small>Enter passenger details</small></span><button className="text-button" type="button">Add passenger</button></div></section><section className="panel"><div className="panel-heading"><div><h2>Travel preference</h2><p>We’ll request this when available.</p></div><Compass size={20} aria-hidden="true" /></div><label className="radio-row"><input type="radio" name="berth" defaultChecked />Lower berth, if available</label><label className="radio-row"><input type="radio" name="berth" />No preference</label></section></div><aside className="panel summary-panel"><h2>Your selection</h2><SummaryRow label="Train" value={train.name} /><SummaryRow label="Class" value={train.className} /><SummaryRow label="Passenger" value="1 adult" /><SummaryRow label="Total fare" value={formatCurrency(train.fare)} total /><button className="primary-button full-button" type="button" onClick={onComplete}><CreditCard size={17} aria-hidden="true" />Continue to payment</button><p className="panel-note"><ShieldCheck size={14} aria-hidden="true" />Payment is simulated. No money will be charged.</p></aside></div></>
}

function TicketView({ train, onJourney, onSave }: { train: TrainResult; onJourney: () => void; onSave: () => void }) {
  return <><div className="eyebrow"><CircleCheck size={14} aria-hidden="true" />You’re all set</div><h1>Your ticket is ready</h1><p className="lede">Keep this handy for your journey. We’ll continue to monitor the important details.</p><section className="ticket-card"><div className="ticket-head"><div><h2>{train.name}</h2><p>{train.number} · Confirmed in demo</p></div><div className="pnr"><span>Demo PNR</span><strong>4827 1930</strong></div></div><div className="ticket-route"><StationTime time={train.departure} station={train.from} detail="Platform 6" /><ArrowRight className="route-arrow" size={24} aria-hidden="true" /><StationTime time={train.arrival} station={train.to} /></div><div className="ticket-details"><SummaryRow label="Date" value="Sat, 29 Aug 2026" /><SummaryRow label="Passenger" value="Riya Kapoor" /><SummaryRow label="Coach & seat" value="S3 · 42 Lower" /></div></section><div className="action-row"><button className="primary-button" type="button" onClick={onJourney}><NavigationIcon size={17} aria-hidden="true" />Open journey mode</button><button className="secondary-button" type="button" onClick={onSave}><WalletCards size={17} aria-hidden="true" />Save for offline</button></div><p className="prototype-disclaimer"><ShieldCheck size={14} aria-hidden="true" />Demo ticket · Not valid for travel · Payment and reservation are simulated.</p></>
}

function TripsView({ train, seatWatchActive, onJourney, onTicket, onSearch }: { train: TrainResult; seatWatchActive: boolean; onJourney: () => void; onTicket: () => void; onSearch: () => void }) {
  return <><div className="eyebrow"><Ticket size={14} aria-hidden="true" />Your journeys in one place</div><h1>My trips</h1><p className="lede">Everything you need before, during, and after a journey.</p><SectionHeading title="Upcoming" caption="Sat, 29 Aug · 1 journey" /><section className="trip-list-card"><div className="trip-list-head"><div><h2>{train.from} <ArrowRight size={17} aria-hidden="true" /> {train.to}</h2><p>{train.name} · Confirmed</p></div><span className="status success"><CircleCheck size={13} aria-hidden="true" />On time</span></div><div className="trip-route-row"><StationTime time={train.departure} station={train.from} detail="Platform 6" /><ArrowRight className="route-arrow" size={21} aria-hidden="true" /><StationTime time={train.arrival} station={train.to} /></div><div className="action-row"><button className="primary-button" type="button" onClick={onJourney}><NavigationIcon size={16} aria-hidden="true" />Open journey mode</button><button className="secondary-button" type="button" onClick={onTicket}>View ticket</button></div></section><SectionHeading title="Being monitored" caption="We’ll tell you if a seat opens up." /><section className="panel watch-panel"><div className="watch-icon"><Eye size={20} aria-hidden="true" /></div><div><h2>Kaveri Express · 16021</h2><p>Chennai Egmore → Bengaluru · Sleeper</p><span className="status wait"><Eye size={13} aria-hidden="true" />{seatWatchActive ? 'Seat watch active' : 'Seat watch on'}</span></div><ChevronRight size={18} aria-hidden="true" /></section><p className="watch-note"><Info size={14} aria-hidden="true" />Currently full. We’ll notify you if a seat becomes available.</p><button className="secondary-button browse-button" type="button" onClick={onSearch}><Search size={16} aria-hidden="true" />Find another journey</button></>
}

function JourneyView({ train, delayed, onDelay, onAnnounce }: { train: TrainResult; delayed: boolean; onDelay: () => void; onAnnounce: (message: string) => void }) {
  return <><section className="journey-banner"><div><span className="live-label"><i />Simulated live journey</span><small>{train.name} · {train.number}</small><h2>On the way to {train.to}</h2></div><div className="eta"><small>ETA</small><strong>{delayed ? '15:05' : train.arrival}</strong></div></section><div className="journey-layout"><section className="panel location-panel"><div className="panel-heading"><div><h2>Where your train is</h2><p>Current location · Salem Junction</p></div><LocateFixed size={20} aria-hidden="true" /></div><div className="journey-timeline"><JourneyStop station={train.from} detail={`Departed · ${train.departure}`} time={train.departure} /><JourneyStop station="Salem Junction" detail="Current location" time="11:05" current /><JourneyStop station={train.to} detail="Expected arrival" time={delayed ? '15:05' : train.arrival} /></div></section><section className="panel details-panel"><div className="panel-heading"><div><h2>Today’s details</h2><p>What you need at a glance.</p></div><TrainFront size={20} aria-hidden="true" /></div><div className="journey-metrics"><Metric label="Platform" value="6" /><Metric label="Coach" value="S3 · Zone B" /><Metric label="Delay" value={delayed ? '90 minutes' : 'On time'} danger={delayed} /><Metric label="Connection" value={delayed ? 'At risk' : 'None'} danger={delayed} /></div><button className="secondary-button full-button" type="button" onClick={onDelay} disabled={delayed}>{delayed ? 'Delay simulated' : 'Simulate a 90 min delay'}</button></section></div>{delayed && <section className="recovery-panel" aria-live="polite"><div className="recovery-heading"><div className="recovery-icon"><CircleAlert size={20} aria-hidden="true" /></div><div><h2>Your journey needs attention</h2><p>Your train is delayed by 90 minutes. You may miss the connecting journey planned from {train.to}.</p></div></div><div className="recovery-option"><div><strong>Take the 15:10 Intercity</strong><span>Arrives 1h later · ₹180 extra</span></div><button className="primary-button" type="button" onClick={() => onAnnounce('Intercity option selected in demo mode.')}>Choose</button></div><div className="recovery-option"><div><strong>Keep your current plan</strong><span>Lowest cost · Higher connection risk</span></div><button className="secondary-button" type="button" onClick={() => onAnnounce('Original plan kept in demo mode.')}>Keep plan</button></div></section>}<p className="prototype-disclaimer"><ShieldCheck size={14} aria-hidden="true" />Location, delay, platform, and recovery options are simulated demo states.</p></>
}

function AlertsView({ train, delayed, onJourney }: { train: TrainResult; delayed: boolean; onJourney: () => void }) {
  return <><div className="eyebrow"><Bell size={14} aria-hidden="true" />Only what matters</div><h1>Alerts</h1><p className="lede">Useful updates about your tickets, seats, and journeys.</p><div className="alert-list">{delayed && <AlertItem icon={<CircleAlert size={19} aria-hidden="true" />} title="Your train is delayed by 90 minutes" text="Open Journey Mode to see your options and decide what to do next." time="Just now" tone="danger" action="View journey" onAction={onJourney} />}<AlertItem icon={<BellRing size={19} aria-hidden="true" />} title="Platform 6 confirmed for your journey" text={`${train.name} departs from ${train.from} at ${train.departure} on 29 Aug.`} time="Today · 10:42 AM" /><AlertItem icon={<Eye size={19} aria-hidden="true" />} title="Seat watch is active" text="Kaveri Express is currently full. We’ll notify you if a seat opens up." time="Yesterday · 06:20 PM" tone="blue" /><AlertItem icon={<CircleCheck size={19} aria-hidden="true" />} title="Your booking is confirmed" text={`${train.name} · PNR 4827 1930 · S3, seat 42.`} time="27 Aug · 04:15 PM" tone="green" /></div></>
}

function ProfileView({ copy, easyMode, language, onEasyMode, onLanguage }: { copy: Record<string, string>; easyMode: boolean; language: Language; onEasyMode: () => void; onLanguage: (language: Language) => void }) {
  return <><div className="eyebrow"><Accessibility size={14} aria-hidden="true" />{copy.profile}</div><h1>{copy.profileTitle}</h1><p className="lede">{copy.profileLede}</p><div className="profile-layout"><section className="panel preferences-panel"><PreferenceRow title={copy.easyMode} description={copy.easyDescription}><button className={`toggle ${easyMode ? 'on' : ''}`} type="button" aria-pressed={easyMode} aria-label="Toggle Easy Mode" onClick={onEasyMode}><i /></button></PreferenceRow><PreferenceRow title={copy.language} description={copy.languageDescription}><div className="language-buttons" role="group" aria-label={copy.language}>{languageOptions.map((option) => <button className={language === option.id ? 'selected' : ''} type="button" key={option.id} onClick={() => onLanguage(option.id)}>{option.label}</button>)}</div></PreferenceRow><PreferenceRow title={copy.savedPassengers} description="Riya Kapoor"><button className="text-button" type="button">{copy.manage}</button></PreferenceRow></section><section className="panel about-panel"><div className="about-symbol"><Languages size={21} aria-hidden="true" /></div><h2>{copy.about}</h2><p>{copy.aboutText}</p><div className="trust-box"><ShieldCheck size={18} aria-hidden="true" /><div><strong>{copy.trustFirst}</strong><span>{copy.trustText}</span></div></div></section></div></>
}

function Field({ label, value, icon, ariaLabel, select = false, options = [], suggestions = [], inputType = 'text', onChange, hint }: { label: string; value: string; icon?: ReactNode; ariaLabel: string; select?: boolean; options?: string[]; suggestions?: string[]; inputType?: 'text' | 'date'; onChange?: (value: string) => void; hint?: string }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const matchingSuggestions = suggestions.filter((option) => option.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 5)
  const shouldShowSuggestions = !select && inputType === 'text' && showSuggestions && value.trim().length >= 2 && matchingSuggestions.length > 0

  const handleChange = (nextValue: string) => {
    setShowSuggestions(true)
    onChange?.(nextValue)
  }

  const chooseSuggestion = (suggestion: string) => {
    setShowSuggestions(false)
    onChange?.(suggestion)
  }

  return <label className="field"><span>{label}</span><div className="field-input-wrap"><div className="field-control">{icon}{select ? <select aria-label={ariaLabel} value={value} onChange={(event) => onChange?.(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input type={inputType} aria-label={ariaLabel} value={value} onChange={(event) => handleChange(event.target.value)} onFocus={() => setShowSuggestions(true)} />}</div>{shouldShowSuggestions && <div className="suggestion-list" role="listbox" aria-label={`${ariaLabel} suggestions`}>{matchingSuggestions.map((suggestion) => <button key={suggestion} type="button" role="option" aria-selected={suggestion === value} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(suggestion)}>{suggestion}</button>)}</div>}</div>{hint && <small className="field-hint">{hint}</small>}</label>
}

function VoiceFallback({ draft, onChange, onApply }: { draft: string; onChange: (value: string) => void; onApply: () => void }) {
  return <div className="voice-fallback" role="region" aria-label="Voice route input"><div><strong>Or type your route</strong><span>Example: “Mumbai to Pune”.</span></div><div className="voice-fallback-controls"><input aria-label="Voice route text" value={draft} onChange={(event) => onChange(event.target.value)} placeholder="Mumbai to Pune" /><button className="secondary-button" type="button" onClick={onApply}>Use this route</button></div></div>
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
