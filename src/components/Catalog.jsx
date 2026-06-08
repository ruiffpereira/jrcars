import { useState, useEffect, useRef } from 'react'
import styles from './Catalog.module.css'

const CARS = [
  { tag: 'Importado',  name: 'Porsche 911 Carrera S',  spec: '2021 · 18.000 km · 3.0T',  price: '€ 118.900', cat: 'importado desportivo', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80' },
  { tag: 'Desportivo', name: 'BMW M4 Competition',      spec: '2022 · 12.400 km · 3.0T',  price: '€ 96.500',  cat: 'importado desportivo', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=80' },
  { tag: 'Nacional',   name: 'Mercedes-Benz GLE 400d', spec: '2020 · 62.000 km · Diesel', price: '€ 68.900',  cat: 'nacional',             img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=700&q=80' },
  { tag: 'Importado',  name: 'Ferrari 488 GTB',         spec: '2019 · 9.800 km · 3.9T',   price: '€ 228.000', cat: 'importado desportivo', img: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=700&q=80' },
  { tag: 'Nacional',   name: 'Audi RS6 Avant',          spec: '2021 · 31.000 km · 4.0T',  price: '€ 102.000', cat: 'nacional desportivo',  img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=700&q=80' },
  { tag: 'Importado',  name: 'Lamborghini Urus',         spec: '2022 · 7.200 km · 4.0T',   price: '€ 298.000', cat: 'importado desportivo', img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=700&q=80' },
]

const FILTERS = [
  { key: 'all',        label: 'Todos' },
  { key: 'importado',  label: 'Importados' },
  { key: 'nacional',   label: 'Nacionais' },
  { key: 'desportivo', label: 'Desportivos' },
]

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

function CarCard({ car }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={`${styles.card} ${visible ? styles.in : ''}`}>
      <div className={styles.cardImg}>
        <img src={car.img} alt={car.name} loading="lazy" />
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardTag}>{car.tag}</p>
        <p className={styles.cardName}>{car.name}</p>
        <p className={styles.cardSpec}>{car.spec}</p>
        <div className={styles.cardFoot}>
          <span className={styles.cardPrice}>{car.price}</span>
          <span className={styles.cardCta}>Ver detalhes →</span>
        </div>
      </div>
    </div>
  )
}

export default function Catalog() {
  const [active, setActive] = useState('all')
  const [topRef, topVisible] = useReveal()

  const filtered = CARS.filter(c => active === 'all' || c.cat.includes(active))

  return (
    <section className={styles.section} id="catalogo">
      <div ref={topRef} className={`${styles.top} ${topVisible ? styles.in : ''}`}>
        <div>
          <p className={styles.eyebrow}>Frota Disponível</p>
          <h2 className={styles.sectionH}>Veículos<br />Selecionados</h2>
        </div>
        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`${styles.ftab} ${active === f.key ? styles.on : ''}`}
              onClick={() => setActive(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.grid}>
        {filtered.map(car => <CarCard key={car.name} car={car} />)}
      </div>
    </section>
  )
}
