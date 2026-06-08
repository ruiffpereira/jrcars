import { useState, useEffect, useRef } from 'react'
import styles from './About.module.css'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

export default function About() {
  const [leftRef, leftVisible]   = useReveal()
  const [rightRef, rightVisible] = useReveal()

  return (
    <section className={styles.section} id="sobre">
      <div className={styles.wrap}>
        <div ref={leftRef} className={`${styles.text} ${leftVisible ? styles.in : ''}`}>
          <p className={styles.eyebrow}>A Nossa História</p>
          <h2 className={styles.sectionH}>
            JRcars —<br />paixão por<br /><em>automóveis</em>
          </h2>
          <p>Fundada em Lisboa por entusiastas do automóvel, a JRcars nasceu da convicção de que cada cliente merece um serviço verdadeiramente personalizado.</p>
          <p>Especializamo-nos em veículos importados de alta qualidade, usados nacionais cuidadosamente selecionados e automóveis desportivos para os mais exigentes.</p>
          <div className={styles.stats}>
            <div><p className={styles.statN}>8+</p><p className={styles.statL}>Anos de experiência</p></div>
            <div><p className={styles.statN}>340</p><p className={styles.statL}>Veículos entregues</p></div>
            <div><p className={styles.statN}>98%</p><p className={styles.statL}>Clientes satisfeitos</p></div>
          </div>
        </div>
        <div ref={rightRef} className={`${styles.imgWrap} ${rightVisible ? styles.in : ''}`} style={{ transitionDelay: '.13s' }}>
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80" alt="JRcars" />
        </div>
      </div>
    </section>
  )
}
