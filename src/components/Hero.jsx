import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

function navTo(id) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' })
}

export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => heroRef.current?.classList.add(styles.loaded), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.hero} ref={heroRef} id="hero">
      <div className={styles.bg}></div>
      <div className={styles.grad}></div>
      <div className={styles.body}>
        <p className={styles.eyebrow}>Lisboa, Portugal</p>
        <h1>
          A sua próxima<br />
          <em>viagem</em><br />
          começa aqui.
        </h1>
        <p className={styles.sub}>
          Veículos de importação e carros nacionais criteriosamente selecionados para quem não faz concessões.
        </p>
        <div className={styles.actions}>
          <button className={styles.btnFill} onClick={() => navTo('catalogo')}>
            Ver Catálogo
          </button>
          <button className={styles.btnText} onClick={() => navTo('importacao')}>
            Calcular Importação
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.scroll}>Scroll</div>
    </div>
  )
}
