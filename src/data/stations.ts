import type { Station } from '../domain/types'

const stationRows: Array<[name: string, city: string, aliases: string[]]> = [
  ['Chennai Central', 'Chennai', ['Chennai', 'MAS']], ['Chennai Egmore', 'Chennai', ['Egmore']], ['Bengaluru', 'Bengaluru', ['Bangalore', 'KSR Bengaluru', 'SBC']],
  ['Mumbai Central', 'Mumbai', ['Mumbai', 'BCT']], ['Pune', 'Pune', ['Pune Junction', 'PUNE']], ['New Delhi', 'Delhi', ['Delhi', 'NDLS']],
  ['Hyderabad Deccan', 'Hyderabad', ['Hyderabad', 'Nampally', 'HYB']], ['Kolkata Howrah', 'Kolkata', ['Howrah', 'HWH']], ['Ahmedabad', 'Ahmedabad', ['ADI']],
  ['Jaipur', 'Jaipur', ['JAI']], ['Lucknow', 'Lucknow', ['LKO']], ['Kochi Ernakulam', 'Kochi', ['Kochi', 'Ernakulam', 'ERS']],
  ['Bhopal', 'Bhopal', ['BPL']], ['Patna', 'Patna', ['PNBE']], ['Visakhapatnam', 'Visakhapatnam', ['Vizag', 'VSKP']],
  ['Goa Madgaon', 'Goa', ['Madgaon', 'Margao', 'MAO']], ['Surat', 'Surat', ['ST']], ['Nagpur', 'Nagpur', ['NGP']],
  ['Varanasi', 'Varanasi', ['Banaras', 'BSBS']], ['Chandigarh', 'Chandigarh', ['CDG']], ['Indore', 'Indore', ['INDB']],
]

export const stations: Station[] = stationRows.map(([name, city, aliases], index) => ({ id: `station-${index + 1}`, name, city, aliases: [name, ...aliases] }))
