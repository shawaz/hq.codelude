export const VENTURES = [
  { name: 'Roborns',     color: '#5DCAA5' },
  { name: 'Franchiseen', color: '#7F77DD' },
  { name: 'HubCV',       color: '#FAC775' },
  { name: 'Cuestay',     color: '#85B7EB' },
  { name: 'Dextrip',     color: '#F0997B' },
] as const;

export type VentureName = typeof VENTURES[number]['name'];
