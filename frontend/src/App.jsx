import { useEffect, useState } from 'react'
import './App.css'
import {
  getPatients,
  createPatient,
  updatePatient,
  dischargePatient,
  deletePatient,
} from './api'
import {
  emptyForm,
  formFromPatient,
  validatePatient,
  filterPatients,
} from './utils'
import PatientForm from './components/PatientForm'
import PatientFilters from './components/PatientFilters'
import PatientCard from './components/PatientCard'

const NO_FILTERS = { search: '', ward: 'All', department: 'All', doctor: 'All' }

function App() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [patients, setPatients] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showList, setShowList] = useState(false)
  const [filters, setFilters] = useState(NO_FILTERS)

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function resetForm() {
    setForm(emptyForm())
    setEditingId(null)
    setError('')
  }

  function handleEdit(patient) {
    setEditingId(patient.id)
    setForm(formFromPatient(patient))
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError = validatePatient(form)
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = { ...form, name: form.name.trim(), age: Number(form.age) }

    try {
      if (editingId) {
        const updated = await updatePatient(editingId, payload)
        setPatients((current) =>
          current.map((p) => (p.id === editingId ? updated : p))
        )
      } else {
        const created = await createPatient(payload)
        setPatients((current) => [...current, created])
      }
      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDischarge(id) {
    if (!window.confirm('Mark this patient as discharged?')) return

    try {
      const updated = await dischargePatient(id)
      setPatients((current) => current.map((p) => (p.id === id ? updated : p)))
      if (id === editingId) {
        setForm((current) => ({ ...current, status: 'Discharged' }))
      }
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this patient record?')) return

    try {
      await deletePatient(id)
      setPatients((current) => current.filter((p) => p.id !== id))
      if (id === editingId) resetForm()
      else setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const visiblePatients = filterPatients(patients, filters)

  return (
    <main className="app">
      <header className="class-header">
        <div>
          <p className="app-label">Admitly</p>
          <h1>The quiet start to care</h1>
        </div>
      </header>

      <section className="patient-details">
        <h2>{editingId ? 'Edit patient' : 'Patient Admissions'}</h2>

        <PatientForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={editingId !== null}
          error={error}
        />

        <button
          type="button"
          className="list-toggle"
          onClick={() => setShowList(!showList)}
          disabled={loading}
          aria-expanded={showList}
        >
          {loading
            ? 'Loading patients...'
            : showList
              ? 'Hide patients'
              : `View patients (${patients.length})`}
        </button>

        {showList && !loading && (
          <div className="list-section">
            <PatientFilters filters={filters} onChange={setFilters} />

            {patients.length === 0 ? (
              <p>No patients admitted yet.</p>
            ) : visiblePatients.length === 0 ? (
              <p>No patients match your search.</p>
            ) : (
              <>
                <p className="result-count">
                  Showing {visiblePatients.length} of {patients.length}
                </p>
                <div className="patient-list">
                  {visiblePatients.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onEdit={handleEdit}
                      onDischarge={handleDischarge}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default App