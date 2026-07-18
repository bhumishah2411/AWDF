import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="navbar">
      {links.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={location.pathname === path ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}