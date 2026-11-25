import {
    GENDERS,
    WARDS,
    STATUSES,
    DEPARTMENTS,
    DEPARTMENT_NAMES,
  } from '../constants'
  import { getToday } from '../utils'
  
  function SelectField({ id, label, value, options, onChange }) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    )
  }
  
  function PatientForm({ form, onChange, onSubmit, onCancel, isEditing, error }) {
    function handleChange(field, value) {
      if (field === 'department') {
        // Changing the department also resets the doctor to match it.
        onChange({ ...form, department: value, doctor: DEPARTMENTS[value][0] })
      } else {
        onChange({ ...form, [field]: value })
      }
    }
  
    return (
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="patient-name">Patient name</label>
          <input
            id="patient-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
  
        <div>
          <label htmlFor="patient-age">Age</label>
          <input
            id="patient-age"
            type="number"
            min="0"
            max="120"
            value={form.age}
            onChange={(e) => handleChange('age', e.target.value)}
            required
          />
        </div>
  
        <SelectField
          id="patient-gender"
          label="Gender"
          value={form.gender}
          options={GENDERS}
          onChange={(value) => handleChange('gender', value)}
        />
  
        <SelectField
          id="patient-ward"
          label="Ward"
          value={form.ward}
          options={WARDS}
          onChange={(value) => handleChange('ward', value)}
        />
  
        <SelectField
          id="patient-department"
          label="Department"
          value={form.department}
          options={DEPARTMENT_NAMES}
          onChange={(value) => handleChange('department', value)}
        />
  
        <SelectField
          id="patient-doctor"
          label="Doctor"
          value={form.doctor}
          options={DEPARTMENTS[form.department]}
          onChange={(value) => handleChange('doctor', value)}
        />
  
        <div>
          <label htmlFor="patient-date">Admission date</label>
          <input
            id="patient-date"
            type="date"
            max={getToday()}
            value={form.admission_date}
            onChange={(e) => handleChange('admission_date', e.target.value)}
            required
          />
        </div>
  
        <SelectField
          id="patient-status"
          label="Status"
          value={form.status}
          options={STATUSES}
          onChange={(value) => handleChange('status', value)}
        />
  
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
  
        <div className="form-buttons">
          <button type="submit">
            {isEditing ? 'Save changes' : 'Admit patient'}
          </button>
          {isEditing && (
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    )
  }
  
  export default PatientForm