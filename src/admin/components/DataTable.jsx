import React from 'react'

const DataTable = ({ columns, data, loading, actions }) => {
  return (
    <div className="bg-white rounded-2xl  shadow-sm overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className=" text-emerald-900 text-left">
            {columns.map(col => (
              <th key={col.key} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{col.title}</th>
            ))}
            {actions && <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-8 text-center text-emerald-700">Loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-8 text-center text-emerald-700">No records found</td>
            </tr>
          ) : (
            data.map(row => (
              <tr key={row.id} className="border-t border-emerald-100 hover:bg-emerald-50/50">
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3 text-sm text-emerald-900 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
