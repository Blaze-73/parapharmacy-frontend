import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="hover:text-vert-600 transition-colors flex-shrink-0">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          {item.to ? (
            <Link to={item.to} className="hover:text-vert-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
