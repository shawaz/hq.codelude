export type UploadFileCategory = 'Financial Model' | 'Pitch Deck' | 'Legal' | 'Brand' | 'Technical' | 'Research' | 'Internal';

export const UPLOAD_CATEGORIES: UploadFileCategory[] = [
  'Financial Model', 'Pitch Deck', 'Legal', 'Brand', 'Technical', 'Research', 'Internal',
];

export const VENTURES = ['Codelude', 'Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'];

/** Sidebar hierarchy — department → sub-categories (pages) */
export const FILE_DEPARTMENTS: { dept: string; pages: string[] }[] = [
  { dept: 'Home',       pages: ['Overview', 'Tasks', 'Events', 'News', 'Travels', 'Files', 'Handbook'] },
  { dept: 'Management', pages: ['Plan', 'Strategy', 'Partners', 'Activity', 'Channel', 'Resources', 'Relations'] },
  { dept: 'Operations', pages: ['Projects', 'Office', 'Departments', 'Franchise', 'Properties'] },
  { dept: 'Finance',    pages: ['Model', 'Fundraise', 'Budget', 'Expenses', 'Accounts', 'Wallets', 'Invoice', 'Payee', 'Shares', 'Investors'] },
  { dept: 'People',     pages: ['Attendance', 'Application', 'Positions', 'Onboarding', 'Team', 'Payroll', 'Training', 'Offboarding'] },
  { dept: 'Legal',      pages: ['NDA', 'Contracts', 'Govt'] },
  { dept: 'Marketing',  pages: ['Brand', 'Market', 'Competition', 'Campaign', 'Content'] },
  { dept: 'Sales',      pages: ['Prospects', 'Leads', 'Deals', 'Clients'] },
  { dept: 'Software',   pages: ['Platform', 'Features', 'Bugs'] },
  { dept: 'Support',    pages: ['Tickets', 'Help Desk'] },
];

export const ALL_DEPARTMENTS = FILE_DEPARTMENTS.map(d => d.dept);

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  venture: string;
  department: string;
  category: string;
  format: string;
  size: number;
  date: string;
  notes: string;
  mimeType: string;
  storagePath: string;
}
