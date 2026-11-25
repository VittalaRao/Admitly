export const GENDERS = ['Male', 'Female', 'Other']
export const WARDS = ['General', 'Emergency', 'Pediatrics', 'ICU']
export const STATUSES = ['Admitted', 'Discharged']

export const DEPARTMENTS = {
  Cardiology: ['Dr. Anil Sharma', 'Dr. Meera Nair'],
  Orthopedics: ['Dr. Rahul Verma', 'Dr. Sneha Iyer'],
  Pediatrics: ['Dr. Kavita Rao', 'Dr. Arjun Menon'],
  Neurology: ['Dr. Priya Das', 'Dr. Vikram Singh'],
}

export const DEPARTMENT_NAMES = Object.keys(DEPARTMENTS)
export const ALL_DOCTORS = Object.values(DEPARTMENTS).flat()