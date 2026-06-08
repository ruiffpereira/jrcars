import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a href="#" className={styles.logo}>JR<span className={styles.dot}>.</span>cars</a>
      <p className={styles.copy}>© 2026 JRcars — Lisboa, Portugal</p>
      <p className={styles.copy}>Todos os direitos reservados</p>
    </footer>
  )
}
