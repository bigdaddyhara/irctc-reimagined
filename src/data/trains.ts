import type { RouteFamily, Train } from '../domain/types.js'

const direct = (id: string, name: string, number: string, from: string, to: string, departure: string, arrival: string, duration: string, fare: number, className: string, availability: Train['availability'], tags: string[], reason: string, extra: Partial<Train> = {}): Train => ({ id, name, number, from, to, departure, arrival, duration, fare, className, availability, tags, reason, ...extra })

export const routeFamilies: RouteFamily[] = [
  { id: 'chennai-bengaluru', from: 'Chennai Central', to: 'Bengaluru', direct: true },
  { id: 'mumbai-pune', from: 'Mumbai Central', to: 'Pune', direct: true },
  { id: 'delhi-jaipur', from: 'New Delhi', to: 'Jaipur', direct: true },
  { id: 'hyderabad-chennai', from: 'Hyderabad Deccan', to: 'Chennai Central', direct: true },
  { id: 'kolkata-patna', from: 'Kolkata Howrah', to: 'Patna', direct: true },
  { id: 'ahmedabad-mumbai', from: 'Ahmedabad', to: 'Mumbai Central', direct: true },
  { id: 'jaipur-bengaluru', from: 'Jaipur', to: 'Bengaluru', direct: true },
  { id: 'kochi-bengaluru', from: 'Kochi Ernakulam', to: 'Bengaluru', direct: false, nearbyStations: ['Coimbatore'] },
  { id: 'indore-varanasi', from: 'Indore', to: 'Varanasi', direct: false, nearbyStations: ['Bhopal'] },
]

export const trains: Train[] = [
  direct('brindavan', 'Brindavan Express', '12639', 'Chennai Central', 'Bengaluru', '07:40', '13:35', '5h 55m', 620, 'AC 3 Tier', 'available', ['Direct', 'Good availability'], 'Leaves in the morning and has seats available', { seats: 32 }),
  direct('shatabdi', 'Shatabdi Express', '12027', 'Chennai Central', 'Bengaluru', '05:50', '10:30', '4h 40m', 810, 'AC Chair Car', 'waitlist', ['Fastest', 'Direct'], 'Gets you there fastest, but currently has a waiting list', { waitlist: 6, probability: 76 }),
  direct('kaveri', 'Kaveri Express', '16021', 'Chennai Egmore', 'Bengaluru', '21:15', '04:50', '7h 35m', 480, 'Sleeper', 'available', ['Lowest fare', 'Overnight'], 'The lowest-cost option from a nearby station', { seats: 18 }),
  direct('lalbagh', 'Lalbagh Express', '12607', 'Chennai Central', 'Bengaluru', '15:30', '21:45', '6h 15m', 560, 'Sleeper', 'full', ['Direct', 'Seat watch available'], 'A direct evening option that is currently full'),
  direct('deccan-queen', 'Deccan Queen', '12124', 'Mumbai Central', 'Pune', '07:10', '10:25', '3h 15m', 460, 'AC Chair Car', 'available', ['Direct', 'Fastest'], 'A quick morning service with good availability', { seats: 26 }),
  direct('intercity-pune', 'Pune Intercity', '12127', 'Mumbai Central', 'Pune', '06:40', '10:05', '3h 25m', 320, 'Sleeper', 'available', ['Direct', 'Lowest fare'], 'The lowest-cost direct option', { seats: 41 }),
  direct('rajdhani-jaipur', 'Ajmer Shatabdi', '12015', 'New Delhi', 'Jaipur', '06:05', '10:40', '4h 35m', 780, 'AC Chair Car', 'available', ['Direct', 'Morning'], 'Arrives before lunch with reliable availability', { seats: 22 }),
  direct('pink-city', 'Pink City Express', '12986', 'New Delhi', 'Jaipur', '17:20', '22:25', '5h 05m', 540, 'AC 3 Tier', 'waitlist', ['Direct', 'Evening'], 'A convenient evening train with a short waiting list', { waitlist: 4, probability: 82 }),
  direct('charminar', 'Charminar Express', '12760', 'Hyderabad Deccan', 'Chennai Central', '18:00', '08:10', '14h 10m', 690, 'Sleeper', 'available', ['Direct', 'Overnight'], 'A practical overnight journey', { seats: 38 }),
  direct('coromandel', 'Coromandel Express', '12842', 'Kolkata Howrah', 'Patna', '14:00', '20:15', '6h 15m', 520, 'AC 3 Tier', 'available', ['Direct', 'Good availability'], 'A daytime direct option', { seats: 29 }),
  direct('gujarat-mail', 'Gujarat Mail', '12902', 'Ahmedabad', 'Mumbai Central', '22:05', '06:10', '8h 05m', 610, 'AC 3 Tier', 'available', ['Direct', 'Overnight'], 'A comfortable overnight service', { seats: 17 }),
  direct('jaipur-bengaluru-express', 'Jaipur–Bengaluru Express', 'JBE01', 'Jaipur', 'Bengaluru', '06:10', '13:20', '7h 10m', 760, 'AC 3 Tier', 'available', ['Direct', 'Morning'], 'A direct morning option for this route', { seats: 24 }),
  direct('pink-south-express', 'Pink City South Express', 'JBE02', 'Jaipur', 'Bengaluru', '19:40', '07:15', '11h 35m', 680, 'Sleeper', 'waitlist', ['Direct', 'Overnight'], 'A lower-cost overnight option with a waitlist', { waitlist: 5, probability: 71 }),
  direct('kochi-connect', 'Kerala–Bengaluru Connector', 'KBC01', 'Kochi Ernakulam', 'Bengaluru', '06:30', '15:55', '9h 25m', 680, 'AC 3 Tier', 'available', ['1 change', 'Safe transfer'], 'One change at Coimbatore with a protected transfer', { transferStation: 'Coimbatore', legs: [{ from: 'Kochi Ernakulam', to: 'Coimbatore', departure: '06:30', arrival: '11:00', duration: '4h 30m' }, { from: 'Coimbatore', to: 'Bengaluru', departure: '12:00', arrival: '15:55', duration: '3h 55m' }] }),
  direct('indore-connect', 'Malwa–Kashi Connector', 'IMV01', 'Indore', 'Varanasi', '05:45', '20:30', '14h 45m', 860, 'Sleeper', 'waitlist', ['1 change', 'Waitlist explained'], 'One change at Bhopal; best available option for this route', { transferStation: 'Bhopal', waitlist: 9, probability: 64, legs: [{ from: 'Indore', to: 'Bhopal', departure: '05:45', arrival: '09:30', duration: '3h 45m' }, { from: 'Bhopal', to: 'Varanasi', departure: '10:30', arrival: '20:30', duration: '10h' }] }),
]
