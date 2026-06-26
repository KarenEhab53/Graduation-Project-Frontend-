import React, { useState } from 'react'
import styles from './DocProfile.module.css'

const DocProfile = () => {
  const [price, setPrice] = useState(200)
  const [waitTime, setWaitTime] = useState(18)
  const [consultType, setConsultType] = useState('both')
  const [form, setForm] = useState({
    specialization: 'LASIK surgeries',
    specializationType: '',
    clinicNumber: '19511',
    clinicLocation: 'Cairo',
    issue1: 'LASIK surgeries',
    issue2: 'LASIK surgeries',
    shortExperience: '',
    experience: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ ...form, price, waitTime, consultType })
  }

  return (
    <div className={styles.DocProfile}>
      <h2 className={styles.title}>Update profile</h2>

      <form onSubmit={handleSubmit}>

        <div className={styles.field}>
          <label className={styles.label}>Specialization</label>
          <div className={styles.row}>
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
            />
            <input
              type="text"
              name="specializationType"
              placeholder="Type..."
              value={form.specializationType}
              onChange={handleChange}
            />
            <button type="button" className={styles.addBtn} aria-label="Add specialization">+</button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Clinic number</label>
          <input
            className={styles.short}
            type="text"
            name="clinicNumber"
            value={form.clinicNumber}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Clinic Location</label>
          <input
            type="text"
            name="clinicLocation"
            value={form.clinicLocation}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Issues</label>
          <div className={styles.row}>
            <input
              type="text"
              name="issue1"
              value={form.issue1}
              onChange={handleChange}
            />
            <input
              type="text"
              name="issue2"
              value={form.issue2}
              onChange={handleChange}
            />
            <button type="button" className={styles.addBtn} aria-label="Add issue">+</button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Type</label>
          <div className={styles.radioGroup}>
            {['online', 'offline', 'both'].map((t) => (
              <label key={t} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="consultType"
                  value={t}
                  checked={consultType === t}
                  onChange={() => setConsultType(t)}
                />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Experience</label>
          <input
            type="text"
            name="shortExperience"
            placeholder="Lorem ipsum dolor sit amet consectetur,"
            value={form.shortExperience}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Price</label>
          <div className={styles.spinWrap}>
            <input
              type="number"
              value={price}
              min={0}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div className={styles.spinners}>
              <button type="button" onClick={() => setPrice(p => p + 1)}>▲</button>
              <button type="button" onClick={() => setPrice(p => Math.max(0, p - 1))}>▼</button>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Waiting Time</label>
          <div className={styles.spinRow}>
            <div className={styles.spinWrap}>
              <input
                type="number"
                value={waitTime}
                min={0}
                onChange={(e) => setWaitTime(Number(e.target.value))}
              />
              <div className={styles.spinners}>
                <button type="button" onClick={() => setWaitTime(t => t + 1)}>▲</button>
                <button type="button" onClick={() => setWaitTime(t => Math.max(0, t - 1))}>▼</button>
              </div>
            </div>
            <span className={styles.unit}>min</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Experience</label>
          <textarea
            name="experience"
            placeholder="Lorem ipsum dolor sit amet consectetur,"
            value={form.experience}
            onChange={handleChange}
          />
        </div>

        <div className={styles.footer}>
          <button type="submit" className={styles.saveBtn}>Save</button>
        </div>

      </form>
    </div>
  )
}

export default DocProfile