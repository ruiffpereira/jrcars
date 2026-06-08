import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

function navTo(id) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' })
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#" className={styles.logo}>
          JR<span className={styles.dot}>.</span>cars
        </a>
        <ul className={styles.links}>
          <li><a href="#catalogo">Catálogo</a></li>
          <li><a href="#importacao">Importação</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <button className={styles.cta} onClick={() => navTo('contacto')}>Contactar</button>
        <button className={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="Menu">&#9776;</button>
      </nav>

      {menuOpen && (
        <div className={styles.mobMenu}>
          <button className={styles.mobClose} onClick={() => setMenuOpen(false)}>&#10005;</button>
          <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a>
          <a href="#importacao" onClick={() => setMenuOpen(false)}>Importação</a>
          <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
        </div>
      )}
    </>
  )
}
