// Edit copy, screenshots and contact details here. Never upload real employee/payroll data.
export const contact = {
  email: 'horizonhris.centraljuan@gmail.com',
  phone: '',
  address: '',
  facebook: '',
  messenger: '',
  inquiryUrl: '',
};

export const productImages = {
  overview: '', // Keep the connected-workflow illustration in the hero.
  dashboard: '/images/dashboard-calendar.webp',
  employees: '/images/employee-management.webp',
  scheduling: '/images/scheduling-attendance.webp',
  payroll: '/images/payroll-management.webp',
  kiosk: '', // No approved mobile screenshot yet.
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
    number: '01 / DASHBOARD',
    tabTitle: 'Dashboard',
    title: 'Your HR at a glance.',
    description: 'Keep track of everyday tasks and workforce schedules in one workspace.',
    bullets: ['Calendar', 'Tasks', 'Shift overview'],
    image: productImages.dashboard,
    imageLabel: 'Dashboard calendar',
    alt: 'Cropped Horizon HRIS calendar and tasks interface',
    variant: 'wide',
  },
  {
    number: '02 / EMPLOYEE MANAGEMENT',
    tabTitle: 'Employees',
    title: 'Keep employee records organized.',
    description: 'View employee profiles, positions, and employment status in one place.',
    bullets: ['Employee records', 'Positions', 'Employment status'],
    image: productImages.employees,
    imageLabel: 'Employee management',
    alt: 'Cropped employee profile with fictional sample details',
    variant: 'wide',
  },
  {
    number: '03 / SCHEDULING & ATTENDANCE',
    tabTitle: 'Attendance',
    title: 'Plan the workweek.',
    description: 'Manage shifts, attendance, and worktime configurations in one workflow.',
    bullets: ['Shift scheduling', 'Attendance', 'Worktime rules'],
    image: productImages.scheduling,
    imageLabel: 'Scheduling & attendance',
    alt: 'Cropped attendance time fields with illustrative punch times',
    variant: 'wide',
  },
  {
    number: '04 / PAYROLL',
    tabTitle: 'Payroll',
    title: 'Payroll and payslips.',
    description: 'Keep payroll information and employee payslips in the same HR system.',
    bullets: ['Payroll management', 'Payslips', 'Employee records'],
    image: productImages.payroll,
    imageLabel: 'Payroll management',
    alt: 'Cropped payroll summary with illustrative amounts',
    variant: 'wide',
  },
  {
    number: '05 / EMPLOYEE SELF-SERVICE',
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
