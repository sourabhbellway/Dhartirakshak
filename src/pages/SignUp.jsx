import React, { useState } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'

const initialState = {
  name: '',
  email: '',
  password: '',
  image: null,
  description: '',
  documents: null,
  research_type: '',
  research_field: '',
  institution: '',
  qualification: '',
  research_start_year: '',
  research_end_year: '',
  research_description: ''
}

const SignUp = () => {
  const { signup } = useUserAuth()
  const [values, setValues] = useState(initialState)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setValues(v => ({ ...v, [name]: files[0] }))
    } else {
      setValues(v => ({ ...v, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const res = await signup(values)
    if (res.success) {
      setSuccess(res.message || 'Signup successful')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen bg-olive p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-green/20 p-6">
        <h2 className="text-dark-green text-xl font-semibold mb-4">User Sign Up</h2>
        {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
        {success && <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded mb-3">{success}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border border-green/30 rounded p-2" name="name" placeholder="Name" value={values.name} onChange={handleChange} required />
          <input className="border border-green/30 rounded p-2" name="email" type="email" placeholder="Email" value={values.email} onChange={handleChange} required />
          <input className="border border-green/30 rounded p-2" name="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} required />
          <input className="border border-green/30 rounded p-2" name="image" type="file" accept="image/*" onChange={handleChange} />
          <input className="border border-green/30 rounded p-2 md:col-span-2" name="description" placeholder="Description" value={values.description} onChange={handleChange} />
          <input className="border border-green/30 rounded p-2" name="documents" type="file" onChange={handleChange} />
          <input className="border border-green/30 rounded p-2" name="research_type" placeholder="Research Type" value={values.research_type} onChange={handleChange} />
          <input className="border border-green/30 rounded p-2" name="research_field" placeholder="Research Field" value={values.research_field} onChange={handleChange} />
          <input className="border border-green/30 rounded p-2" name="institution" placeholder="Institution" value={values.institution} onChange={handleChange} />
          <input className="border border-green/30 rounded p-2" name="qualification" placeholder="Qualification" value={values.qualification} onChange={handleChange} />
          <input className="border border-green/30 rounded p-2" name="research_start_year" placeholder="Start Year" value={values.research_start_year} onChange={handleChange} />
          <input className="border border-green/30 rounded p-2" name="research_end_year" placeholder="End Year" value={values.research_end_year} onChange={handleChange} />
          <input className="border border-green/30 rounded p-2 md:col-span-2" name="research_description" placeholder="Research Description" value={values.research_description} onChange={handleChange} />
          <button className="md:col-span-2 bg-green hover:bg-dark-green text-olive rounded p-2">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
