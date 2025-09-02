import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'

const Profile = () => {
  const { token, user, loadProfile, isAuthenticated } = useUserAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return
      const res = await loadProfile()
      if (!res.success) setError(res.message)
    }
    fetchProfile()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-olive p-4">Please sign in to view profile.</div>
  }

  return (
    <div className="min-h-screen bg-olive p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-green/20 p-6">
        <h2 className="text-dark-green text-xl font-semibold mb-4">Your Profile</h2>
        {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
        {user ? (
          <div className="space-y-2">
            <img src={user.image} alt="avatar" className="w-24 h-24 rounded-full object-cover border border-green/30" />
            <div className="text-green"><span className="text-dark-green font-medium">Name:</span> {user.name}</div>
            <div className="text-green"><span className="text-dark-green font-medium">Email:</span> {user.email}</div>
            {user.description && <div className="text-green"><span className="text-dark-green font-medium">About:</span> {user.description}</div>}
            {user.research_type && <div className="text-green"><span className="text-dark-green font-medium">Type:</span> {user.research_type}</div>}
            {user.research_field && <div className="text-green"><span className="text-dark-green font-medium">Field:</span> {user.research_field}</div>}
            {user.institution && <div className="text-green"><span className="text-dark-green font-medium">Institution:</span> {user.institution}</div>}
            {user.qualification && <div className="text-green"><span className="text-dark-green font-medium">Qualification:</span> {user.qualification}</div>}
            {(user.research_start_year || user.research_end_year) && (
              <div className="text-green"><span className="text-dark-green font-medium">Years:</span> {user.research_start_year} - {user.research_end_year}</div>
            )}
          </div>
        ) : (
          <div className="text-green">Loading...</div>
        )}
      </div>
    </div>
  )
}

export default Profile
