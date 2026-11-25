import { statusClass } from '../utils'

function PatientCard({ patient, onEdit, onDischarge, onDelete }) {
  const status = patient.status || 'Admitted'

  const details = [
    ['Gender', patient.gender],
    ['Ward', patient.ward],
    ['Department', patient.department],
    ['Doctor', patient.doctor],
    ['Admission date', patient.admission_date],
  ]

  return (
    <details className="patient-item">
      <summary>
        <span className="patient-summary">
          <strong>{patient.name}</strong>, {patient.age}
        </span>
        <span className={statusClass(status)}>{status}</span>
      </summary>

      <div className="patient-body">
        <dl>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || 'Not recorded'}</dd>
            </div>
          ))}
        </dl>

        <div className="patient-actions">
          {status !== 'Discharged' && (
            <button
              type="button"
              className="discharge-button"
              onClick={() => onDischarge(patient.id)}
            >
              Discharge
            </button>
          )}
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(patient)}
          >
            Edit
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(patient.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </details>
  )
}

export default PatientCard