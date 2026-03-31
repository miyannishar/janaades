// ─── Source of truth: Nepal House of Representatives 2082 B.S. (Excel import)
// Auto-derived from: Nepal_House_of_Representatives_2082_Members.xlsx
// Do NOT edit manually — re-run scripts/parse-mps.py to regenerate.

export interface ExcelMP {
  id:            string
  name:          string
  district:      string
  province:      string
  party:         string
  partyShort:    string
  color:         string   // hex for party colour
  gender:        'Male' | 'Female' | 'Unknown'
  electionType:  'FPTP' | 'PR'
  inclusiveGroup: string | null
  lat:           number | null
  lng:           number | null
}

// Lazy-loaded so the JSON isn't bundled into every page
export async function loadExcelMPs(): Promise<ExcelMP[]> {
  const data = await import('../lib/mps-excel.json')
  return data.default as ExcelMP[]
}

// ─── District → centre coordinates (all 77 Nepal districts)
export const DISTRICT_COORDS: Record<string, [number, number]> = {
  Taplejung:    [27.35, 87.67], Panchthar:     [27.14, 87.80], Ilam:           [26.91, 87.93],
  Jhapa:        [26.63, 87.94], Morang:         [26.65, 87.29], Sunsari:        [26.68, 87.17],
  Dhankuta:     [26.98, 87.35], Terhathum:      [27.13, 87.53], Sankhuwasabha:  [27.42, 87.22],
  Solukhumbu:   [27.73, 86.65], Okhaldhunga:    [27.32, 86.50], Khotang:        [27.08, 86.78],
  Bhojpur:      [27.17, 87.05], Udayapur:       [26.92, 86.52],
  Saptari:      [26.60, 86.72], Siraha:         [26.65, 86.21], Dhanusha:       [26.82, 85.93],
  Mahottari:    [26.63, 85.56], Sarlahi:        [27.00, 85.34], Bara:           [27.01, 85.00],
  Parsa:        [27.19, 84.82], Rautahat:       [27.09, 85.15],
  Sindhuli:     [27.26, 85.97], Ramechhap:      [27.33, 86.08], Dolakha:        [27.67, 86.20],
  Dolkha:       [27.67, 86.20], Sindhupalchok:  [27.95, 85.69], Kavrepalanchok: [27.53, 85.62],
  Lalitpur:     [27.67, 85.32], Bhaktapur:      [27.67, 85.43], Kathmandu:      [27.72, 85.32],
  Nuwakot:      [27.92, 85.14], Rasuwa:         [28.11, 85.37], Dhading:        [27.87, 84.92],
  Makwanpur:    [27.41, 85.07], Chitwan:        [27.53, 84.25],
  Gorkha:       [28.33, 84.63], Manang:         [28.67, 84.02], Mustang:        [29.18, 83.97],
  Myagdi:       [28.43, 83.45], Kaski:          [28.21, 83.98], Lamjung:        [28.15, 84.42],
  Tanahu:       [27.93, 84.22], Tanahun:       [27.93, 84.22], Nawalpur:       [27.69, 84.14],
  Syangja:      [28.02, 83.88], Parbat:         [28.23, 83.68], Baglung:        [28.27, 83.60],
  Rupandehi:    [27.55, 83.42], Kapilvastu:     [27.57, 83.02], Arghakhanchi:   [27.93, 83.18],
  Gulmi:        [28.07, 83.27], Palpa:          [27.87, 83.55], Nawalparasi:    [27.69, 83.68],
  'Nawalparasi (Bardaghat Susta East)': [27.69, 83.68],
  'Nawalparasi (Bardaghat Susta West)': [27.69, 83.42],
  Rolpa:        [28.43, 82.67], Pyuthan:        [28.10, 82.87],
  'Rukum (East)': [28.62, 82.87], 'Eastern Rukum': [28.62, 82.87],
  'Rukum (West)': [28.62, 82.30], 'Western Rukum': [28.62, 82.30],
  Dang:         [28.10, 82.30], Banke:          [28.07, 81.65], Bardiya:        [28.33, 81.33],
  Dolpa:        [29.05, 82.97], Mugu:           [29.57, 82.35], Humla:          [30.07, 81.88],
  Jumla:        [29.28, 82.18], Kalikot:        [29.13, 81.65], Dailekh:        [28.87, 81.72],
  Jajarkot:     [28.70, 82.18], Bajarkot:       [28.70, 82.18], Salyan:         [28.38, 82.15],
  Surkhet:      [28.60, 81.63],
  Darchula:     [29.85, 80.55], Baitadi:        [29.53, 80.48], Dadeldhura:     [29.30, 80.58],
  Bajhang:      [29.55, 81.18], Bajura:         [29.43, 81.48], Achham:         [29.10, 81.20],
  Doti:         [29.25, 80.90], Kailali:        [28.72, 81.00], Kanchanpur:     [28.97, 80.35],
}

export const PARTY_COLORS: Record<string, string> = {
  RSP:    '#6366f1',
  NC:     '#3b82f6',
  UML:    '#ef4444',
  MAOIST: '#dc2626',
  RPP:    '#f97316',
  JSP:    '#10b981',
  CPNUS:  '#f59e0b',
  NMKP:  '#8b5cf6',
}
