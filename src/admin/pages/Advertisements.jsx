import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import adminAds from '../controllers/adminAdvertisementController.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { toast } from 'react-toastify'
import categoryCtrl from '../controllers/categoryController.js'
import FileDropzone from '../components/FileDropzone.jsx'

const fullImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `https://dhartirakshak-backend.carnate.in/${path}`
}

const Advertisements = () => {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(null) // { id, currentImage } or null
  const [openDescription, setOpenDescription] = useState(null) // ad data or null
  const [createValues, setCreateValues] = useState({ title: '', description: '', company: '', link: '', image: null, category_id: '', start_date: '', end_date: '' })
  const [updateValues, setUpdateValues] = useState({ title: '', description: '', company: '', link: '', image: null, category_id: '', start_date: '', end_date: '' })
  const [categories, setCategories] = useState([])
  const [openNewCategory, setOpenNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const res = await adminAds.list(token)
      const data = res?.data || []
      setRows(data)
    } catch (e) {
      setError('Failed to load advertisements')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await categoryCtrl.list(token)
      const data = res?.data || res || []
      setCategories(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      toast.error('Failed to load categories')
    }
  }

  const getCategoryIdByName = (categoryName) => {
    if (!categoryName) return ''
    const cat = categories.find(c => (c.category || c.name || c.title) === categoryName)
    return cat ? String(cat.id || cat._id) : ''
  }

  const getCategoryNameById = (categoryId) => {
    if (!categoryId) return ''
    const cat = categories.find(c => (c.id || c._id) == categoryId)
    return cat ? (cat.category || cat.name || cat.title) : ''
  }

  useEffect(() => { fetchData(); fetchCategories(); }, [])

  // Cleanup image preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  // Update image preview URL when updateValues.image changes
  useEffect(() => {
    if (updateValues.image) {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
      setImagePreviewUrl(URL.createObjectURL(updateValues.image))
    } else {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
        setImagePreviewUrl(null)
      }
    }
  }, [updateValues.image])

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'company', title: 'Company' },
    { key: 'description', title: 'Description', render: (val) => (
      <div className="max-w-xs">
        {val && val.length > 50 ? (
          <div>
            <p className="text-sm text-gray-700 line-clamp-2">{val.substring(0, 50)}...</p>
            <button 
              onClick={() => setOpenDescription(rows.find(r => r.description === val))}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Read more
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-700">{val || '-'}</span>
        )}
      </div>
    ) },
    { key: 'is_active', title: 'Status', render: (val) => (
      <span className={`px-3 py-1 rounded-full text-xs ${val ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>{val ? 'Active' : 'Inactive'}</span>
    ) },
    { key: 'link', title: 'Link', render: (val) => (
      val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline truncate block max-w-xs">
          {val.length > 30 ? val.substring(0, 30) + '...' : val}
        </a>
      ) : (
        <span className="text-sm text-gray-500">-</span>
      )
    ) },
    { key: 'created_at', title: 'Created' },
  ]

  const dateFormat = (value) => {
    if (!value) return '-'
    try {
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return value
      return d.toISOString().slice(0, 10)
    } catch { return value }
  }

  // Insert date columns after description
  columns.splice(4, 0,
    { key: 'start_date', title: 'Start Date', render: (val) => dateFormat(val) },
    { key: 'end_date', title: 'End Date', render: (val) => dateFormat(val) }
  )

  const handleDelete = async (id) => {
    if (!confirm('Delete this advertisement?')) return
    try {
      await adminAds.remove(token, id)
      toast.success('Advertisement deleted')
      fetchData()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  const handleActivate = async (id) => {
    try {
      await adminAds.activate(token, id)
    toast.success('Activated')
      fetchData()
    } catch (e) {
      toast.error('Activate failed')
    }
  }

  const handleDeactivate = async (id) => {
    try {
      await adminAds.deactivate(token, id)
      toast.success('Deactivated')
      fetchData()
    } catch (e) {
      toast.error('Deactivate failed')
    }
  }

  const handleCreateChange = (e) => {
    const { name, value } = e.target
    setCreateValues(v => ({ ...v, [name]: value }))
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!createValues.title || !createValues.image || !createValues.company) {
      toast.error('Title, Company and Image are required')
      return
    }
    try {
      console.log('Creating with values:', createValues)
      await adminAds.create(token, createValues)
      toast.success('Advertisement created')
      setOpenCreate(false)
      setCreateValues({ title: '', description: '', company: '', link: '', image: null, category_id: '', start_date: '', end_date: '' })
      fetchData()
    } catch (e) {
      console.error('Create error:', e)
      toast.error('Create failed')
    }
  }


  const handleOpenUpdate = (row) => {
    // Clean up previous image preview URL
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
    }
    
    setUpdateValues({
      title: row.title || '',
      description: row.description || '',
      company: row.company || '',
      link: row.link || '',
      image: null,
      category_id: getCategoryIdByName(row.category_name),
      start_date: row.start_date ? row.start_date.split('T')[0] : '',
      end_date: row.end_date ? row.end_date.split('T')[0] : ''
    })



    
    setOpenUpdate({ id: row.id, currentImage: row.image })
  }

  const handleUpdateChange = (e) => {
    const { name, value } = e.target
    setUpdateValues(v => ({ ...v, [name]: value }))
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!updateValues.title || !updateValues.company) {
      toast.error('Title and Company are required')
      return
    }
    try {
      console.log('Updating with values:', updateValues)
      await adminAds.update(token, openUpdate.id, updateValues)
      toast.success('Advertisement updated')
      setOpenUpdate(null)
      setUpdateValues({ title: '', description: '', company: '', link: '', image: null, category_id: '', start_date: '', end_date: '' })
      // Clean up image preview URL
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
        setImagePreviewUrl(null)
      }
      fetchData()
    } catch (e) {
      console.error('Update error:', e)
      toast.error('Update failed')
    }
  }

  const handleNewCategorySubmit = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    try {
      await categoryCtrl.create(token, newCategory.trim())
      toast.success('Category created')
      setOpenNewCategory(false)
      setNewCategory('')
      fetchCategories()
    } catch (e) {
      toast.error('Create category failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-dark-green text-xl font-semibold">Advertisements</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenNewCategory(true)} className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-sm">New Category</button>
          <button onClick={() => setOpenCreate(true)} className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm">Create Advertisement</button>
        </div>
      </div>

      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button onClick={() => handleOpenUpdate(row)} className="px-3 py-1 rounded-full text-xs bg-blue-600 text-white hover:bg-blue-700">Update</button>
            {row.is_active ? (
              <button onClick={() => handleDeactivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-amber-500 text-white hover:bg-amber-600">Deactivate</button>
            ) : (
              <button onClick={() => handleActivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white hover:bg-emerald-700">Activate</button>
            )}
            <button onClick={() => handleDelete(row.id)} className="px-3 py-1 rounded-full text-xs bg-rose-600 text-white hover:bg-rose-700">Delete</button>
          </div>
        )}
      />

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Create Advertisement</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              {/* Row 1: Title and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Title *</label>
                  <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={createValues.title} onChange={handleCreateChange} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Company *</label>
                  <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="company" placeholder="Company" value={createValues.company} onChange={handleCreateChange} required />
                </div>
              </div>

              {/* Row 2: Link and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Link</label>
                  <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="link" placeholder="Link (optional)" value={createValues.link} onChange={handleCreateChange} />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Category</label>
                  <select name="category_id" value={createValues.category_id || ''} onChange={handleCreateChange} className="w-full border border-emerald-200 rounded-lg p-2 text-sm">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.category || cat.name || cat.title}</option>
                    ))}
                  </select>
                  {createValues.category_id && (
                    <p className="text-xs text-gray-600 mt-1">Selected: {getCategoryNameById(createValues.category_id)}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Start Date and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="start_date" value={createValues.start_date} onChange={handleCreateChange} />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="end_date" value={createValues.end_date} onChange={handleCreateChange} />
                </div>
              </div>

              {/* Row 4: Description (full width) */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={createValues.description} onChange={handleCreateChange} rows={3} />
              </div>
              {/* Image Dropzone */}
              <FileDropzone label="Image" accept="image/*" value={createValues.image} onChange={(file) => setCreateValues(v => ({ ...v, image: file }))} required heightClass="h-44" />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-emerald-700 text-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openUpdate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => {
          setOpenUpdate(null)
          if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl)
            setImagePreviewUrl(null)
          }
        }}>
          <div className="bg-white rounded-2xl p-5 max-w-2xl w-[92%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Update Advertisement</h3>
            
            {/* Image Section */}
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Image */}
                {openUpdate.currentImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                    <div className="text-center">
                      <img src={fullImageUrl(openUpdate.currentImage)} alt="Current" className="h-50 rounded-lg mx-auto border border-gray-200" />
                    </div>
                  </div>
                )}
                
                {/* New Image (Dropzone) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Image</label>
                  <FileDropzone label="Choose Image" accept="image/*" value={updateValues.image} onChange={(file) => setUpdateValues(v => ({ ...v, image: file }))} heightClass="h-32" />
                </div>
              </div>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              {/* Row 1: Title and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Title *</label>
                  <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={updateValues.title} onChange={handleUpdateChange} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Company *</label>
                  <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="company" placeholder="Company" value={updateValues.company} onChange={handleUpdateChange} required />
                </div>
              </div>

              {/* Row 2: Link and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Link</label>
                  <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="link" placeholder="Link (optional)" value={updateValues.link} onChange={handleUpdateChange} />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Category</label>
                                     <select name="category_id" value={updateValues.category_id || ''} onChange={handleUpdateChange} className="w-full border border-emerald-200 rounded-lg p-2 text-sm">
                     <option value="">Select Category</option>
                     {categories.map((cat) => {
                       const catId = String(cat.id || cat._id)
                       return (
                         <option key={catId} value={catId}>{cat.category || cat.name || cat.title}</option>
                       )
                     })}
                   </select>
                  {updateValues.category_id && (
                    <p className="text-xs text-gray-600 mt-1">Selected: {getCategoryNameById(updateValues.category_id)}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Start Date and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="start_date" value={updateValues.start_date} onChange={handleUpdateChange} />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="end_date" value={updateValues.end_date} onChange={handleUpdateChange} />
                </div>
              </div>

              {/* Row 4: Description (full width) */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={updateValues.description} onChange={handleUpdateChange} rows={3} />
              </div>
              
              
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => {
                  setOpenUpdate(null)
                  if (imagePreviewUrl) {
                    URL.revokeObjectURL(imagePreviewUrl)
                    setImagePreviewUrl(null)
                  }
                }} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-blue-600 text-white">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openDescription && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenDescription(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-2xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Advertisement Details</h3>
            <div className="space-y-4">
              {openDescription.image && (
                <div className="text-center">
                  <img src={fullImageUrl(openDescription.image)} alt={openDescription.title || 'ad'} className="w-full max-w-md h-auto rounded-lg mx-auto" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-sm text-gray-900">{openDescription.title || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <p className="text-sm text-gray-900">{openDescription.company || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-sm text-gray-900">{openDescription.category_name || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{openDescription.description || '-'}</p>
                </div>
                {openDescription.link && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                    <a href={openDescription.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline break-all">
                      {openDescription.link}
                    </a>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <p className="text-sm text-gray-900">{dateFormat(openDescription.start_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <p className="text-sm text-gray-900">{dateFormat(openDescription.end_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs ${openDescription.is_active ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>
                    {openDescription.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-900">{dateFormat(openDescription.created_at)}</p>
                </div>
              </div>
            </div>
            <div className="text-right mt-4">
              <button onClick={() => setOpenDescription(null)} className="px-4 py-2 rounded-full bg-emerald-600 text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {openNewCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenNewCategory(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">New Category</h3>
            <form onSubmit={handleNewCategorySubmit} className="space-y-3">
              <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" placeholder="Category (e.g., Research)" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenNewCategory(false)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-amber-600 text-white">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Advertisements
