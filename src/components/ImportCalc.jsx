import { useState, useRef, useEffect } from 'react'
import styles from './ImportCalc.module.css'

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

const fmt = n => n.toLocaleString('pt-PT')

export default function ImportCalc() {
  const [leftRef, leftVisible]   = useReveal()
  const [rightRef, rightVisible] = useReveal()

  const [brand,  setBrand]  = useState('')
  const [model,  setModel]  = useState('')
  const [year,   setYear]   = useState('')
  const [km,     setKm]     = useState('')
  const [origin, setOrigin] = useState('eu')
  const [price,  setPrice]  = useState('')
  const [result, setResult] = useState(null)
  const [error,  setError]  = useState('')

  function calculate() {
    if (!brand || !model || !price) { setError('Por favor preencha a marca, modelo e preço.'); return }
    setError('')
    const base      = parseFloat(price)
    const transport = { eu: 900, uk: 1400, us: 3200, jp: 4800, other: 2500 }[origin]
    const customs   = ['us','jp','other'].includes(origin) ? Math.round(base * 0.065) : 0
    const age       = 2026 - (parseInt(year) || 2020)
    const isv       = Math.round(base * 0.28 * Math.max(0.5, 1 - age * 0.08))
    const reg       = 260
    const total     = Math.round(base + transport + customs + isv + reg)
    const delivery  = { eu:'3–5 semanas', uk:'4–6 semanas', us:'8–12 semanas', jp:'10–14 semanas', other:'6–10 semanas' }[origin]
    setResult({ base, transport, customs, isv, reg, total, delivery, brand, model })
  }

  return (
    <section className={styles.section} id="importacao">
      <div className={styles.wrap}>

        <div ref={leftRef} className={`${styles.left} ${leftVisible ? styles.in : ''}`}>
          <p className={styles.eyebrow}>Serviço Exclusivo</p>
          <h2 className={styles.sectionH}>Calcule a sua<br /><em>importação</em></h2>
          <p className={styles.desc}>
            Tratamos de todo o processo — da pesquisa no país de origem até à entrega em Portugal. Transparência total em cada etapa.
          </p>
          <div className={styles.steps}>
            {[
              ['01', 'Pesquisa e Negociação',   'Encontramos o veículo certo no mercado europeu ou global ao melhor preço.'],
              ['02', 'Logística e Transporte',   'Coordenamos o transporte marítimo ou rodoviário com seguros incluídos.'],
              ['03', 'Desalfandegamento e ISV',  'Toda a documentação legal, fiscal e de matrícula tratada por nós.'],
            ].map(([n, title, text]) => (
              <div key={n} className={styles.step}>
                <span className={styles.stepN}>{n}</span>
                <div>
                  <p className={styles.stepTitle}>{title}</p>
                  <p className={styles.stepText}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={rightRef} className={`${styles.calc} ${rightVisible ? styles.in : ''}`} style={{ transitionDelay: '.13s' }}>
          <p className={styles.calcH}>Simulador de Importação</p>

          <div className={styles.frow}>
            <div className={styles.fgrp}>
              <label className={styles.flabel}>Marca</label>
              <input className={styles.finput} type="text" placeholder="ex. Porsche" value={brand} onChange={e => setBrand(e.target.value)} />
            </div>
            <div className={styles.fgrp}>
              <label className={styles.flabel}>Modelo</label>
              <input className={styles.finput} type="text" placeholder="ex. 911 Carrera" value={model} onChange={e => setModel(e.target.value)} />
            </div>
          </div>
          <div className={styles.frow}>
            <div className={styles.fgrp}>
              <label className={styles.flabel}>Ano</label>
              <input className={styles.finput} type="number" placeholder="ex. 2022" min="2000" max="2026" value={year} onChange={e => setYear(e.target.value)} />
            </div>
            <div className={styles.fgrp}>
              <label className={styles.flabel}>Quilometragem</label>
              <input className={styles.finput} type="number" placeholder="ex. 25 000" value={km} onChange={e => setKm(e.target.value)} />
            </div>
          </div>
          <div className={styles.frow}>
            <div className={styles.fgrp}>
              <label className={styles.flabel}>País de Origem</label>
              <div className={styles.selWrap}>
                <select className={styles.fselect} value={origin} onChange={e => setOrigin(e.target.value)}>
                  <option value="eu">Alemanha / UE</option>
                  <option value="uk">Reino Unido</option>
                  <option value="us">Estados Unidos</option>
                  <option value="jp">Japão</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
            <div className={styles.fgrp}>
              <label className={styles.flabel}>Preço de Origem (€)</label>
              <input className={styles.finput} type="number" placeholder="ex. 45 000" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.submit} onClick={calculate}>Calcular Estimativa</button>

          {result && (
            <div className={styles.result}>
              <p className={styles.resLabel}>Estimativa Total</p>
              <p className={styles.resTotal}>€ {fmt(result.total)}</p>
              <p className={styles.resTime}>Prazo estimado: {result.delivery}</p>
              <div className={styles.resLines}>
                <div className={styles.resLine}><span>Valor do veículo</span><span>€ {fmt(result.base)}</span></div>
                <div className={styles.resLine}><span>Transporte</span><span>€ {fmt(result.transport)}</span></div>
                {result.customs > 0 && <div className={styles.resLine}><span>Direitos aduaneiros</span><span>€ {fmt(result.customs)}</span></div>}
                <div className={styles.resLine}><span>ISV estimado</span><span>€ {fmt(result.isv)}</span></div>
                <div className={styles.resLine}><span>Matrícula e taxas</span><span>€ {fmt(result.reg)}</span></div>
                <div className={`${styles.resLine} ${styles.resSum}`}><span>{result.brand} {result.model}</span><span>€ {fmt(result.total)}</span></div>
              </div>
              <p className={styles.resNote}>* Valores estimados. Sujeitos a confirmação após análise detalhada.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
