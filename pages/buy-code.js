// pages/buy-code.js
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { saveTx } from '../utils/storage';

const CODE_PRICE = 5500;
const WA = '+2348136347797';
const ONLINE_LINK = 'https://checkout.nomba.com/payment-link/4109674862';

/* --- Inline SVG icons (crisp, professional) --- */
function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 2h12v18l-2-1-2 1-2-1-2 1-2-1V2z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function BuyCode() {
  const [paymentMethod, setPaymentMethod] = useState(null); // 'online' | 'merchant'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(10 * 60);
  const timerRef = useRef(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | pending | unsuccessful
  const [selected, setSelected] = useState('merchant'); // visual selection ('online' or 'merchant')

  useEffect(() => {
    if (paymentMethod === 'merchant' && step === 2) {
      setCountdown(10 * 60);
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [paymentMethod, step]);

  const proceed = () => {
    if (!name || !phone || !email) return alert('Please fill all fields');
    setStep(2);
  };

  const confirmPayment = () => {
    if (countdown === 0) return alert('⏳ Payment time expired! Restart process.');
    setLoading(true);
    setPaymentStatus('pending');

    setTimeout(() => {
      setLoading(false);
      setPaymentStatus('unsuccessful');

      saveTx({
        type: 'buy_code',
        amount: CODE_PRICE,
        status: 'pending',
        meta: { name, phone, email },
        created_at: new Date().toISOString(),
      });
    }, 1200);
  };

  const handleOnlineBuy = () => {
    window.open(ONLINE_LINK, '_blank', 'noopener');
  };

  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

  return (
    <Layout>
      <style>{`
        /* ===== Compact professional Buy Code (50% smaller cards) ===== */

        :root {
          /* GW palette defaults (falls back to --gt-* if defined elsewhere) */
          --gw-gold: var(--gt-gold, #d4af37);
          --gw-dark: var(--gt-dark, #0b1220);
          --gw-surface: var(--gt-panel, #0f1724);
          --gw-muted: var(--gt-muted, #94a3b8);
          --gw-accent-from: #6b3b15;
          --gw-accent-to: #2a0a3a;
        }

        /* Page */
        .buy-wrap { max-width:880px; margin:18px auto; padding:16px; }
        .hero { text-align:center; margin-bottom:12px; }
        .hero h1 { margin:0; font-size:22px; color:var(--gw-gold); font-weight:800; }
        .hero p { margin-top:6px; color:var(--gw-muted); max-width:720px; margin-left:auto; margin-right:auto; font-size:13px; }

        /* --- Professional 2-column grid, compact (cards ~50% previous size) --- */
        .payment-grid {
          display:grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap:14px;
          align-items:stretch;
          max-width:640px;
          margin: 12px auto 0;
        }
        @media (max-width:680px) {
          .payment-grid { grid-template-columns: 1fr; max-width:420px; padding:0 10px; }
        }

        /* Compact card - smaller dimensions, tighter spacing */
        .card {
          border-radius:10px;
          overflow:hidden;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.03);
          display:flex;
          flex-direction:column;
          justify-content:flex-start;
          transition: box-shadow .22s ease, transform .22s cubic-bezier(.2,.9,.2,1), background .22s ease, color .14s ease;
          min-height: 120px; /* reduced */
        }

        /* Top area with smaller icon */
        .card-top {
          padding:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: transparent;
        }

        .icon-wrap {
          width:38px; height:38px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
          color: inherit;
        }

        /* Body area */
        .card-body {
          padding:8px 10px 12px;
          background: var(--gw-surface);
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          gap:6px;
        }

        .title {
          font-weight:800;
          font-size:14px;
          color: var(--title-default, #071224);
          transition: color .14s ease, text-shadow .14s ease;
        }
        
        color: var(--title-dark, #e6e7ea);
        }

        .price { font-weight:900; font-size:16px; color: var(--gw-gold); }

        .cta-row { display:flex; gap:8px; margin-top:6px; width:100%; justify-content:center; }

        /* Get Started primary button - prominent pill */
        .btn {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          padding:8px 14px; border-radius:999px; font-weight:800; cursor:pointer; border:0;
          transition: transform .12s ease, box-shadow .12s ease, background .14s ease, color .14s ease;
          min-width:120px; font-size:13px;
        }
        .btn.getstarted {
          background: linear-gradient(90deg, var(--gw-gold), #efd78d);
          color: #071224;
          box-shadow: 0 8px 20px rgba(212,175,55,0.08);
        }
        .btn.flat {
          background: transparent;
          border:1px solid rgba(0,0,0,0.06);
          color: var(--gw-muted);
          min-width:90px;
        }

        /* Selected (finger emotion) — brown → purple, title becomes white */
        .card.selected {
          background: linear-gradient(135deg, var(--gw-accent-from), var(--gw-accent-to));
          color: #fff;
          transform: translateY(-6px);
          box-shadow: 0 22px 56px rgba(10,6,10,0.45);
          border-color: rgba(255,255,255,0.06);
        }
        .card.selected .title { color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.28); }
        .card.selected .price { color: rgba(255,255,255,0.95); }
        .card.selected .btn.getstarted { background: #fff; color:#071224; box-shadow: 0 10px 30px rgba(0,0,0,0.28); }
        .card.selected .btn.flat { border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.92); }

        /* finger micro pulse */
        .finger { display:inline-block; transform-origin:center; }
        .card.selected .finger { animation: fp 1s ease-in-out infinite; }
        @keyframes fp { 0%{transform:translateY(0) scale(1)} 50%{transform:translateY(-2px) scale(1.05)} 100%{transform:translateY(0) scale(1)} }

        /* Merchant box */
        .merchant-box { margin:14px auto 30px; max-width:760px; padding:12px; border-radius:10px; background: var(--gw-surface); border:1px solid rgba(255,255,255,0.03); color:inherit; }
        .merchant-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; justify-content:space-between; }
        .merchant-input { width:100%; padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06); background: transparent; color:inherit; margin-bottom:8px; }

        @media (max-width:420px) {
          .card { min-height:110px; }
          .icon-wrap { width:34px; height:34px; }
          .title { font-size:13px; }
          .price { font-size:15px; }
        }

      `}</style>

      <div className="buy-wrap">
        <div className="hero">
          <h1>BUY YOUR WITHDRAWAL CODE </h1>
          <p>Pick a safe payment option — instant card checkout or pay the vendor with manual confirmation.</p>
        </div>

        <div className="payment-grid" role="list" aria-label="Payment methods">
          {/* ONLINE (compact) */}
          <motion.div
            role="listitem"
            tabIndex={0}
            className={`card ${selected === 'online' ? 'selected' : ''}`}
            onMouseEnter={() => setSelected('online')}
            onFocus={() => setSelected('online')}
            onClick={() => { setSelected('online'); setPaymentMethod('online'); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            aria-pressed={selected === 'online'}
          >
            <div className="card-top" aria-hidden>
              <div className="icon-wrap"><CardIcon /></div>
            </div>

            <div className="card-body">
              <div className="title">Online Checkout</div>
              <div className="price">₦6,520</div>

              <div className="cta-row">
                <button
                  className="btn getstarted"
                  onClick={(e) => { e.stopPropagation(); handleOnlineBuy(); }}
                  aria-label="Get started with online checkout"
                >
                  <span className="finger">👉</span> Buy Now
                </button>

                <button
                  className="btn flat"
                  onClick={(e) => { e.stopPropagation(); window.open(ONLINE_LINK, '_blank', 'noopener'); }}
                  aria-label="View gateway details"
                >
                  Gateway
                </button>
              </div>
            </div>
          </motion.div>

          {/* MERCHANT (compact) */}
          <motion.div
            role="listitem"
            tabIndex={0}
            className={`card ${selected === 'merchant' ? 'selected' : ''}`}
            onMouseEnter={() => setSelected('merchant')}
            onFocus={() => setSelected('merchant')}
            onClick={() => { setSelected('merchant'); setPaymentMethod('merchant'); setStep(1); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            aria-pressed={selected === 'merchant'}
          >
            <div className="card-top" aria-hidden>
              <div className="icon-wrap"><ReceiptIcon /></div>
            </div>

            <div className="card-body">
              <div className="title">Pay Vendor</div>
              <div className="price">₦5,500</div>

              <div className="cta-row">
                <button
                  className="btn getstarted"
                  onClick={(e) => { e.stopPropagation(); setPaymentMethod('merchant'); setStep(1); }}
                  aria-label="Get started with merchant payment"
                >
                  <span className="finger">👉</span> Buy Now
                </button>

                <button
                  className="btn flat"
                  onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${WA.replace('+','')}`, '_blank', 'noopener'); }}
                  aria-label="Contact vendor on WhatsApp"
                >
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--gw-muted)' }}>
          Need help?{' '}
          <a
            href={`https://wa.me/${WA.replace('+', '')}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--gw-gold)', fontWeight: 700 }}
          >
            Contact support
          </a>
        </div>

        {/* Merchant flow (keeps your logic, compact layout) */}
        {paymentMethod === 'merchant' && (
          <div className="merchant-box" role="region" aria-labelledby="merchant-heading">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div>
                <div id="merchant-heading" style={{ fontWeight: 800, fontSize: 15 }}>
                  Pay Vendor — Manual Confirmation
                </div>
                <div style={{ color: 'var(--gw-muted)', marginTop: 6, fontSize: 13 }}>Make a bank transfer and submit your receipt to confirm.</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn flat" onClick={() => { setPaymentMethod(null); setPaymentStatus(null); }}>
                  ← Change
                </button>
                <button className="btn getstarted" onClick={() => { window.open(`https://wa.me/${WA.replace('+', '')}`, '_blank', 'noopener'); }}>
                  💬 Contact
                </button>
              </div>
            </div>

            {step === 1 && (
              <div className="merchant-row">
                <div style={{ flex: 1, minWidth: 160 }}>
                  <input className="merchant-input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="merchant-input" placeholder="Phone (e.g. 0803...)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <input className="merchant-input" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div style={{ minWidth: 160, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Amount</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--gw-gold)' }}>₦{CODE_PRICE.toLocaleString()}</div>
                  <div style={{ height: 6 }} />
                  <button className="btn getstarted" onClick={proceed}>👉 Proceed</button>
                  <button className="btn flat" onClick={() => { window.open(`https://wa.me/${WA.replace('+', '')}?text=Hi%20I%20want%20to%20buy%20a%20code`, '_blank', 'noopener'); }}>
                    ℹ️ How to Pay
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ background: 'rgba(0,0,0,0.03)', padding: 10, borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ fontWeight: 800 }}>Payment Instructions</div>
                  <div style={{ color: 'var(--gw-muted)', marginTop: 6, fontSize: 13 }}>Transfer the exact amount to the account below, then confirm with the vendor.</div>

                  <div style={{ marginTop: 10, display: 'grid', gap: 6, fontSize: 13 }}>
                    <div>Account Name: <b>Abdulrahim Usman</b></div>
                    <div>Account Number: <b>6511699109</b></div>
                    <div>Bank: <b>Moniepoint</b></div>
                    <div>Amount: <b>₦{CODE_PRICE.toLocaleString()}</b></div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn getstarted" onClick={confirmPayment} disabled={loading}>
                    {loading ? 'Confirming...' : <>👉 Confirm Payment</>}
                  </button>

                  <a className="btn flat" href={`https://wa.me/${WA.replace('+', '')}`} target="_blank" rel="noreferrer">
                    💬 Send Receipt
                  </a>
                </div>

                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: 22, color: countdown <= 60 ? '#ef4444' : 'var(--gw-gold)' }}>
                    {minutes}:{seconds}
                  </div>
                  <div style={{ color: 'var(--gw-muted)', fontSize: 13 }}>Time left to complete payment</div>
                </div>

                {paymentStatus === 'unsuccessful' && (
                  <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontWeight: 800, color: '#f97316' }}>Payment pending</div>
                    <div style={{ color: 'var(--gw-muted)', marginTop: 6, fontSize: 13 }}>We couldn't auto-verify your payment. Send your receipt to the vendor to confirm.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
