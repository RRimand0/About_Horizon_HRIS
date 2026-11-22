// Edit copy, screenshots and contact details here. Never upload real employee/payroll data.
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
    title: 'Workforce scheduling',
    description: 'Plan shifts, manage attendance, and set worktime rules.',
  },
  {
    number: '02',
    icon: 'building',
    title: 'Brands & branches',
    description: 'Organize companies, locations, and position-based access.',
  },
  {
    number: '03',
    icon: 'phone',
    title: 'Mobile kiosk',
    description: 'Make leave and overtime requests accessible to employees.',
  },
  {
    number: '04',
    icon: 'wallet',
    title: 'Payroll & payslips',
    description: 'Manage payroll records and employee payslips together.',
  },
];

export const showcases = [
  {
    number: '01 / SCHEDULING & ATTENDANCE',
    tabTitle: 'Scheduling',
    title: 'Plan the workweek.',
    description: 'Manage shifts, attendance, and worktime configurations in one workflow.',
    bullets: ['Shift scheduling', 'Attendance', 'Worktime rules'],
    image: productImages.scheduling,
    imageLabel: 'Scheduling & attendance',
    alt: 'Horizon HRIS scheduling and attendance interface',
    variant: 'wide',
  },
  {
    number: '02 / PAYROLL',
    tabTitle: 'Payroll',
    title: 'Payroll and payslips.',
    description: 'Keep payroll information and employee payslips in the same HR system.',
    bullets: ['Payroll management', 'Payslips', 'Employee records'],
    image: productImages.payroll,
    imageLabel: 'Payroll management',
    alt: 'Horizon HRIS payroll management interface',
    variant: 'wide',
  },
  {
    number: '03 / EMPLOYEE SELF-SERVICE',
    tabTitle: 'Mobile kiosk',
    title: 'Requests on mobile.',
    description: 'Let employees submit leave and overtime requests through the mobile kiosk.',
    bullets: ['Leave requests', 'Overtime requests', 'Mobile-accessible'],
    image: productImages.kiosk,
    imageLabel: 'Mobile kiosk',
    alt: 'Horizon HRIS mobile kiosk interface',
    variant: 'portrait',
  },
];
