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
  const [previewSrc, setPreviewSrc] = useState(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdateImage, setOpenUpdateImage] = useState(null) // id or null
  const [createValues, setCreateValues] = useState({ title: '', description: '', company: '', image: null, is_active: 1, category_id: '' })
  const [updateFile, setUpdateFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [openNewCategory, setOpenNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')

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

  useEffect(() => { fetchData(); fetchCategories(); }, [])

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'company', title: 'Company' },
    { key: 'description', title: 'Description' },
    { key: 'image', title: 'Image', render: (val) => (
      val ? (
        <button onClick={() => setPreviewSrc(fullImageUrl(val))} className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-900 hover:bg-emerald-200">Preview</button>
      ) : (
        <span className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-700">No Image</span>
      )
    ) },
    { key: 'is_active', title: 'Status', render: (val) => (
      <span className={`px-3 py-1 rounded-full text-xs ${val ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>{val ? 'Active' : 'Inactive'}</span>
    ) },
    { key: 'created_at', title: 'Created' },
  ]

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
      await adminAds.create(token, createValues)
      toast.success('Advertisement created')
      setOpenCreate(false)
      setCreateValues({ title: '', description: '', company: '', image: null, is_active: 1, category_id: '' })
      fetchData()
    } catch (e) {
      toast.error('Create failed')
    }
  }

  const handleUpdateImage = async (e) => {
    e.preventDefault()
    if (!openUpdateImage || !updateFile) return
    try {
      await adminAds.updateImage(token, openUpdateImage, updateFile)
      toast.success('Image updated')
      setOpenUpdateImage(null)
      setUpdateFile(null)
      fetchData()
    } catch (e) {
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
            <button onClick={() => setOpenUpdateImage(row.id)} className="px-3 py-1 rounded-full text-xs bg-sky-600 text-white hover:bg-sky-700">Update Image</button>
            <button onClick={() => handleActivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white hover:bg-emerald-700">Activate</button>
            <button onClick={() => handleDeactivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-amber-500 text-white hover:bg-amber-600">Deactivate</button>
            <button onClick={() => handleDelete(row.id)} className="px-3 py-1 rounded-full text-xs bg-rose-600 text-white hover:bg-rose-700">Delete</button>
          </div>
        )}
      />

      {previewSrc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setPreviewSrc(null)}>
          <div className="bg-white rounded-2xl p-3 max-w-3xl w-[90%]" onClick={(e) => e.stopPropagation()}>
            <img src={previewSrc} alt="preview" className="w-full h-auto rounded-xl" />
            <div className="text-right mt-3">
              <button onClick={() => setPreviewSrc(null)} className="px-4 py-1.5 rounded-full bg-emerald-600 text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Create Advertisement</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={createValues.title} onChange={handleCreateChange} required />
              <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="company" placeholder="Company" value={createValues.company} onChange={handleCreateChange} required />
              <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={createValues.description} onChange={handleCreateChange} />
              {/* Category Dropdown (saves category_id) */}
              <select name="category_id" value={createValues.category_id} onChange={handleCreateChange} className="w-full border border-emerald-200 rounded-lg p-2 text-sm">
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.category || cat.name || cat.title}</option>
                ))}
              </select>
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

      {openUpdateImage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenUpdateImage(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-md w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Update Image</h3>
            <form onSubmit={handleUpdateImage} className="space-y-3">
              <FileDropzone label="New Image" accept="image/*" value={updateFile} onChange={(file) => setUpdateFile(file)} required heightClass="h-40" />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenUpdateImage(null)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-sky-600 text-white">Update</button>
              </div>
            </form>
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
