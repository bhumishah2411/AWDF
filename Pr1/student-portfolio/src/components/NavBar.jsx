import { useState, useEffect } from 'react';

export default function NavBar() {
  const [active, setActive] = useState('header');

  useEffect(() => {
    const onScroll = () => {
      ['header', 'about', 'skills'].forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 150) setActive(id);
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="navbar">
      {['header', 'about', 'skills'].map(id => (
        <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </a>
      ))}
    </nav>
  );
}
