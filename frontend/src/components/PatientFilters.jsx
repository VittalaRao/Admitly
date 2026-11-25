import { WARDS, DEPARTMENT_NAMES, ALL_DOCTORS } from '../constants'

function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option>All</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

function PatientFilters({ filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="filters">
      <div>
        <label htmlFor="search">Search by name</label>
        <input
          id="search"
          type="search"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          placeholder="Type a name..."
        />
      </div>

      <FilterSelect
        id="ward-filter"
        label="Ward"
        value={filters.ward}
        options={WARDS}
        onChange={(value) => update('ward', value)}
      />

      <FilterSelect
        id="department-filter"
        label="Department"
        value={filters.department}
        options={DEPARTMENT_NAMES}
        onChange={(value) => update('department', value)}
      />

      <FilterSelect
        id="doctor-filter"
        label="Doctor"
        value={filters.doctor}
        options={ALL_DOCTORS}
        onChange={(value) => update('doctor', value)}
      />
    </div>
  )
}

export default PatientFilters