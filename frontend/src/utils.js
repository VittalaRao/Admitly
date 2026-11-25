import {
    GENDERS,
    WARDS,
    DEPARTMENTS,
    DEPARTMENT_NAMES,
  } from './constants'
  
  const NAME_PATTERN = /^[A-Za-z]+( [A-Za-z]+)*$/
  
  export function getToday() {
    return new Date().toLocaleDateString('en-CA')
  }
  
  export function statusClass(status) {
    return `status-badge status-${status.toLowerCase()}`
  }
  
  export function emptyForm() {
    const department = DEPARTMENT_NAMES[0]
    return {
      name: '',
      age: '',
      gender: GENDERS[0],
      ward: WARDS[0],
      department,
      doctor: DEPARTMENTS[department][0],
      status: 'Admitted',
      admission_date: getToday(),
    }
  }
  
  // Fills the form from a saved patient. Older records may have missing fields.
  export function formFromPatient(patient) {
    const department = DEPARTMENT_NAMES.includes(patient.department)
      ? patient.department
      : DEPARTMENT_NAMES[0]
  
    return {
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender || GENDERS[0],
      ward: patient.ward || WARDS[0],
      department,
      doctor: DEPARTMENTS[department].includes(patient.doctor)
        ? patient.doctor
        : DEPARTMENTS[department][0],
      status: patient.status || 'Admitted',
      admission_date: patient.admission_date || getToday(),
    }
  }
  
  // Returns an error message, or '' when the form is valid.
  export function validatePatient(form) {
    const age = Number(form.age)
  
    if (!NAME_PATTERN.test(form.name.trim())) {
      return 'Name is required and must contain letters only.'
    }
    if (form.age === '' || !Number.isInteger(age) || age < 0 || age > 120) {
      return 'Age must be a whole number between 0 and 120.'
    }
    if (!GENDERS.includes(form.gender)) {
      return 'Please choose a valid gender.'
    }
    if (!WARDS.includes(form.ward)) {
      return 'Please choose a valid ward.'
    }
    if (!DEPARTMENT_NAMES.includes(form.department)) {
      return 'Please choose a valid department.'
    }
    if (!DEPARTMENTS[form.department].includes(form.doctor)) {
      return 'Please choose a valid doctor from the selected department.'
    }
    if (form.admission_date === '' || form.admission_date > getToday()) {
      return 'Please enter an admission date that is not in the future.'
    }
    return ''
  }
  
  export function filterPatients(patients, filters) {
    const search = filters.search.trim().toLowerCase()
  
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(search) &&
        (filters.ward === 'All' || patient.ward === filters.ward) &&
        (filters.department === 'All' ||
          patient.department === filters.department) &&
        (filters.doctor === 'All' || patient.doctor === filters.doctor)
    )
  }