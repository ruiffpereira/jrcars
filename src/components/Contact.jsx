import { useState, useEffect, useRef } from 'react'
import styles from './Contact.module.css'

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

export default function Contact() {
  const [leftRef,  leftVisible]  = useReveal()
  const [rightRef, rightVisible] = useReveal()
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className={styles.section} id="contacto">
      <div className={styles.wrap}>
        <div ref={leftRef} className={`${styles.left} ${leftVisible ? styles.in : ''}`}>
          <p className={styles.eyebrow}>Fale Connosco</p>
          <h2 className={styles.sectionH}>
            Pronto para o<br />seu próximo<br /><em>automóvel?</em>
          </h2>
          <div className={styles.info}>
            <div><p className={styles.ciLabel}>Telefone</p><p className={styles.ciVal}>+351 912 345 678</p></div>
            <div><p className={styles.ciLabel}>Email</p><p className={styles.ciVal}>info@jrcars.pt</p></div>
            <div><p className={styles.ciLabel}>Morada</p><p className={styles.ciVal}>Av. da Liberdade, Lisboa</p></div>
          </div>
        </div>
        <div ref={rightRef} className={`${styles.right} ${rightVisible ? styles.in : ''}`} style={{ transitionDelay: '.13s' }}>
          {sent ? (
            <div className={styles.thanks}>
              <p className={styles.eyebrow}>Mensagem enviada</p>
              <p className={styles.thanksText}>Obrigado pelo contacto. Entraremos em contacto brevemente.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fgrp}>
                <label className={styles.flabel}>Nome</label>
                <input className={styles.finput} type="text" placeholder="O seu nome" required />
              </div>
              <div className={styles.fgrp}>
                <label className={styles.flabel}>Email</label>
                <input className={styles.finput} type="email" placeholder="email@exemplo.pt" required />
              </div>
              <div className={styles.fgrp}>
                <label className={styles.flabel}>Mensagem</label>
                <textarea className={styles.finput} placeholder="Como podemos ajudar?" rows={5} required></textarea>
              </div>
              <button className={styles.submit} type="submit">Enviar Mensagem</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
