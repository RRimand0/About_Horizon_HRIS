// Edit this file to update website copy, contact details, and product screenshots.
// Never put personal employee or payroll data in public screenshots.
export const contact = {
  email: '',
  phone: '',
  address: '',
  facebook: '',
  messenger: '',
  inquiryUrl: '',
};

export const productImages = {
  overview: '', // e.g. '/images/product-overview.webp'
  scheduling: '', // e.g. '/images/scheduling-attendance.webp'
  payroll: '', // e.g. '/images/payroll-management.webp'
  kiosk: '', // e.g. '/images/mobile-kiosk.webp'
};

export const capabilities = [
  {
    number: '01',
    icon: 'calendar',
    title: 'Workforce management',
    description: 'Plan shifts, track attendance, and set worktime configurations around your daily operations.',
    tags: ['Shift scheduling', 'Attendance', 'Worktime rules'],
  },
  {
    number: '02',
    icon: 'building',
    title: 'Organization management',
    description: 'Keep companies, brands, branches, and position-based access organized in one system.',
    tags: ['Companies & brands', 'Branches', 'Role access'],
  },
  {
    number: '03',
    icon: 'phone',
    title: 'Employee self-service',
    description: 'Give employees a mobile kiosk for leave and overtime requests.',
    tags: ['Mobile kiosk', 'Leave requests', 'Overtime requests'],
  },
  {
    number: '04',
    icon: 'wallet',
    title: 'Payroll & notifications',
    description: 'Manage payroll and payslips, with SMS notifications for shift-related workflows.',
    tags: ['Payroll', 'Payslips', 'SMS notifications'],
  },
];

export const showcases = [
  {
    number: '01 / SCHEDULING',
    title: 'A clearer view of the workweek.',
    description: 'Build schedules and manage attendance with worktime settings that fit the way your teams operate.',
    bullets: ['Shift and schedule management', 'Attendance monitoring', 'Worktime configurations'],
    image: productImages.scheduling,
    imageLabel: 'Scheduling & attendance screenshot',
    alt: 'Horizon HRIS scheduling and attendance interface',
    variant: 'wide',
  },
  {
    number: '02 / PAYROLL',
    title: 'Payroll, without the scattered files.',
    description: 'Keep payroll information organized and make payslips easier to access from the same HR platform.',
    bullets: ['Payroll management', 'Employee payslips', 'Centralized payroll information'],
    image: productImages.payroll,
    imageLabel: 'Payroll management screenshot',
    alt: 'Horizon HRIS payroll management interface',
    variant: 'wide',
  },
  {
    number: '03 / SELF-SERVICE',
    title: 'Everyday requests, within reach.',
    description: 'Employees can submit leave and overtime requests through the mobile kiosk instead of relying on paper forms.',
    bullets: ['Mobile-accessible kiosk', 'Leave requests', 'Overtime requests'],
    image: productImages.kiosk,
    imageLabel: 'Mobile kiosk screenshot',
    alt: 'Horizon HRIS mobile kiosk interface',
    variant: 'portrait',
  },
];
