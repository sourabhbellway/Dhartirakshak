import React from 'react'

const FileDropzone = ({ label = 'Upload File', accept = 'image/*', value = null, onChange, required = false, heightClass = 'h-40', multiple = false }) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef(null)

  const handleBrowse = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.click()
    }
  }

  const handleInputChange = (e) => {
    const fileList = Array.from(e.target.files || [])
    if (multiple) {
      const current = Array.isArray(value) ? value : []
      const merged = [...current, ...fileList]
      const unique = []
      const seen = new Set()
      for (const f of merged) {
        const key = `${f.name}|${f.size}|${f.lastModified}`
        if (!seen.has(key)) { seen.add(key); unique.push(f) }
      }
      onChange && onChange(unique)
    } else {
      const file = fileList[0] || null
      if (onChange) onChange(file)
    }
    // Reset input so selecting the same file(s) triggers change again
    if (e.target) e.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const fileList = Array.from(e.dataTransfer.files || [])
    if (multiple) {
      const current = Array.isArray(value) ? value : []
      const merged = [...current, ...fileList]
      const unique = []
      const seen = new Set()
      for (const f of merged) {
        const key = `${f.name}|${f.size}|${f.lastModified}`
        if (!seen.has(key)) { seen.add(key); unique.push(f) }
      }
      onChange && onChange(unique)
    } else {
      const file = fileList[0] || null
      if (onChange) onChange(file)
    }
  }

  const borderClass = isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-white'

  return (
    <div>
      {label && <div className="mb-1 text-sm text-gray-700 font-medium">{label}{required && <span className="text-rose-600"> *</span>}</div>}
      <div
        className={`flex flex-col items-center justify-center ${heightClass} border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${borderClass}`}
        onClick={handleBrowse}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrowse() }}
      >
        {multiple ? (
          Array.isArray(value) && value.length > 0 ? (
            <div className="w-full">
              <div className="text-sm text-gray-700 mb-2 text-center">{value.length} file{value.length > 1 ? 's' : ''} selected</div>
              <ul className="max-h-28 overflow-auto text-xs text-gray-600 mb-3 space-y-1">
                {value.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-50 rounded-md px-2 py-1">
                    <span className="truncate mr-2">{file.name}</span>
                    <button type="button" className="text-rose-600" onClick={(e) => {
                      e.stopPropagation()
                      const next = value.filter((_, i) => i !== idx)
                      onChange && onChange(next)
                    }}>Remove</button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-center gap-2">
                <button type="button" className="px-3 py-1.5 rounded-full text-xs bg-emerald-600 text-white" onClick={handleBrowse}>Add more</button>
                <button type="button" className="px-3 py-1.5 rounded-full text-xs bg-rose-600 text-white" onClick={(e) => { e.stopPropagation(); onChange && onChange([]) }}>Clear all</button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl mb-2">📤</div>
              <div className="text-sm text-gray-700">Drag & drop to upload</div>
              <div className="text-xs text-gray-500 mb-3">or click to browse</div>
              <div className="px-3 py-1.5 inline-block rounded-full text-xs bg-emerald-600 text-white">Browse Files</div>
            </div>
          )
        ) : value ? (
          <div className="text-center">
            <div className="text-sm text-gray-700 mb-2">{value.name}</div>
            <div className="text-xs text-gray-500 mb-3">{Math.round((value.size || 0) / 1024)} KB</div>
            <div className="flex items-center gap-2">
              <button type="button" className="px-3 py-1.5 rounded-full text-xs bg-emerald-600 text-white" onClick={handleBrowse}>Change</button>
              <button type="button" className="px-3 py-1.5 rounded-full text-xs bg-rose-600 text-white" onClick={(e) => { e.stopPropagation(); onChange && onChange(null) }}>Remove</button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-3xl mb-2">📤</div>
            <div className="text-sm text-gray-700">Drag & drop to upload</div>
            <div className="text-xs text-gray-500 mb-3">or click to browse</div>
            <div className="px-3 py-1.5 inline-block rounded-full text-xs bg-emerald-600 text-white">Browse Files</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          multiple={multiple}
          required={required && (multiple ? !(Array.isArray(value) && value.length > 0) : !value)}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

export default FileDropzone
