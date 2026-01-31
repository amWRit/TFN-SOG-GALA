import React from 'react';
import styles from '../../styles/register.module.css';

export default function RegisterForm({
  form,
  tableOptions,
  seatOptions,
  submitting,
  success,
  error,
  handleChange,
  handleSubmit
}: {
  form: any;
  tableOptions: number[];
  seatOptions: number[];
  submitting: boolean;
  success: boolean;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className={styles['register-form-card']}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <h2 className={styles.gradientText} style={{ fontSize: '2.2rem', marginBottom: '0.5rem', lineHeight: 1.2, textAlign: 'center'  }}>
        Secure Your Spot! <span style={{fontSize: '1.5rem'}}></span>
      </h2>
      <input
        className={styles.input}
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name || ''}
        onChange={handleChange}
        required
      />
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email || ''}
        onChange={handleChange}
        required
      />
      <input
        className={styles.input}
        type="tel"
        name="phone"
        placeholder="Your Phone Number (optional)"
        value={form.phone || ''}
        onChange={handleChange}
      />
      <label style={{display: 'block', fontWeight: 400, color: '#a5a5a5', marginBottom: 4, fontSize: '1rem', textAlign: 'left'}}>Seating Preference (optional)</label>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16}}>
        <select
          className={styles.input}
          name="table"
          value={form.table || ''}
          onChange={handleChange}
          required
          style={{flex: 1, minWidth: 0, color: '#a5a5a5'}}>
          <option value="">Table #</option>
          {tableOptions.map(t => (
            <option key={t} value={t}>Table {t}</option>
          ))}
        </select>
        <select
          className={styles.input}
          name="seat"
          value={form.seat || ''}
          onChange={handleChange}
          required
          disabled={!form.table}
          style={{flex: 1, minWidth: 0, color: '#a5a5a5'}}>
          <option value="">Seat #</option>
          {seatOptions.map(s => (
            <option key={s} value={s}>Seat {s}</option>
          ))}
        </select>
      </div>
      <textarea
        className={styles.input}
        name="testimonial"
        placeholder="Share a quote or testimonial about Teach For Nepal! 💬"
        value={form.testimonial || ''}
        onChange={handleChange}
        rows={3}
      />
      <button
        type="submit"
        disabled={submitting}
        className={styles.primaryButton + ' w-full mt-2'}
      >
        {submitting ? 'Saving...' : 'Reserve My Seat'}
      </button>
      {success && (
        <>
          <div className={styles.confetti} aria-hidden>🎊🎈</div>
          <p style={{ color: '#A78BFA', marginTop: '1rem', fontWeight: 600, fontSize: '1.1rem' }}>
            Thank you for registering! See you at the Gala!
          </p>
        </>
      )}
      {error && <p style={{ color: '#F472B6', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
}
