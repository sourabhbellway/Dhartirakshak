import React from 'react'

const FileDropzone = ({ label = 'Upload File', accept = 'image/*', value = null, onChange, required = false, heightClass = 'h-40' }) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef(null)

  const handleBrowse = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0] || null
    if (file && onChange) onChange(file)
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
    const file = e.dataTransfer.files?.[0] || null
    if (file && onChange) onChange(file)
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
        {value ? (
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
          required={required && !value}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

export default FileDropzone
