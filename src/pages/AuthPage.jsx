// ─── AuthPage ─────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, CircleCheck } from 'lucide-react';
import Alert from '../components/ui/Alert';
import { login as apiLogin, register as apiRegister } from '../services/authService';

function PasswordInput({ id, name, value, onChange, placeholder = 'Min. 8 karakter' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-wrapper">
      <input
        id={id} name={name}
        type={show ? 'text' : 'password'}
        className="form-input"
        placeholder={placeholder}
        value={value} onChange={onChange}
        style={{ paddingRight: 40 }}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShow((s) => !s)}
        aria-label="Toggle password"
      >
        {show
          ? <EyeOff style={{ width: 14, height: 14 }} />
          : <Eye    style={{ width: 14, height: 14 }} />
        }
      </button>
    </div>
  );
}

// ─ Login Form ─
function LoginForm({ onSuccess }) {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Email dan kata sandi wajib diisi.'); return; }
    setLoading(true);

    try {
      const res = await apiLogin({ email: form.email, password: form.password });
      setLoading(false);
      onSuccess(res.user);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login gagal. Periksa email dan kata sandi Anda.');
    }
  };

  return (
    <div className="auth-card stack-5">
      <div>
        <p className="auth-title">Masuk ke Akun</p>
        <p className="auth-sub">Gunakan email dan kata sandi Anda</p>
      </div>

      {error && (
        <Alert variant="error" title="Login gagal" desc={error} icon={<span style={{ fontSize: 13 }}>✕</span>} />
      )}

      <form id="login-form" className="stack-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email</label>
          <input
            id="login-email" name="email" type="email"
            className="form-input" placeholder="email@domain.com"
            value={form.email} onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <div className="row-between" style={{ marginBottom: 'var(--space-2)' }}>
            <label className="form-label" htmlFor="login-password">Kata Sandi</label>
            <a className="link-subtle">Lupa sandi?</a>
          </div>
          <PasswordInput
            id="login-password" name="password"
            placeholder="Masukkan kata sandi"
            value={form.password} onChange={handleChange}
          />
        </div>
        <button id="login-submit-btn" type="submit" className="btn btn-primary btn-md btn-full" disabled={loading}>
          <LogIn style={{ width: 13, height: 13 }} />
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

// ─ Register Form ─
function RegisterForm({ onSuccess }) {
  const [form,    setForm]    = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Email dan kata sandi wajib diisi.'); return; }
    setLoading(true);

    try {
      const res = await apiRegister({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      setLoading(false);
      setDone(true);
      setTimeout(() => onSuccess(res.user), 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Pendaftaran gagal.');
    }
  };

  return (
    <div className="auth-card stack-5">
      <div>
        <p className="auth-title">Buat Akun Baru</p>
        <p className="auth-sub">Gratis dan hanya perlu 1 menit</p>
      </div>

      {error && (
        <Alert variant="error" title="Pendaftaran gagal" desc={error} icon={<span style={{ fontSize: 13 }}>✕</span>} />
      )}

      {done && (
        <Alert
          variant="success"
          icon={<CircleCheck style={{ width: 14, height: 14 }} />}
          title="Akun berhasil dibuat"
          desc="Mengalihkan ke halaman utama..."
        />
      )}

      <form id="register-form" className="stack-4" onSubmit={handleSubmit}>
        <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-firstName">Nama Depan</label>
            <input id="reg-firstName" name="firstName" type="text" className="form-input" placeholder="Budi" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-lastName">Nama Belakang</label>
            <input id="reg-lastName" name="lastName" type="text" className="form-input" placeholder="Santoso" value={form.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">Email</label>
          <input id="reg-email" name="email" type="email" className="form-input" placeholder="email@domain.com" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">Kata Sandi</label>
          <PasswordInput id="reg-password" name="password" value={form.password} onChange={handleChange} />
        </div>

        <button id="register-submit-btn" type="submit" className="btn btn-primary btn-md btn-full" disabled={loading || done}>
          <UserPlus style={{ width: 13, height: 13 }} />
          {loading ? 'Memproses...' : 'Buat Akun'}
        </button>
      </form>
    </div>
  );
}

export default function AuthPage({ message, onAuthSuccess, onNavigate }) {
  const [tab, setTab] = useState('login');

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Optional message banner */}
      {message && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Alert variant="warning" title="Perhatian" desc={message} />
        </div>
      )}

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
          {tab === 'login' ? 'Selamat Datang' : 'Bergabung dengan Marketo'}
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {tab === 'login'
            ? 'Masuk untuk melanjutkan belanja.'
            : 'Buat akun gratis dan mulai belanja sekarang.'}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="auth-tabs">
        <button
          id="tab-login"
          className={`auth-tab${tab === 'login' ? ' active' : ''}`}
          onClick={() => setTab('login')}
        >
          <LogIn style={{ width: 13, height: 13 }} />
          Masuk
        </button>
        <button
          id="tab-register"
          className={`auth-tab${tab === 'register' ? ' active' : ''}`}
          onClick={() => setTab('register')}
        >
          <UserPlus style={{ width: 13, height: 13 }} />
          Daftar
        </button>
      </div>

      {tab === 'login'
        ? <LoginForm onSuccess={onAuthSuccess} />
        : <RegisterForm onSuccess={onAuthSuccess} />
      }

      <p className="auth-footer" style={{ marginTop: 'var(--space-5)' }}>
        {tab === 'login'
          ? <> Belum punya akun? <a onClick={() => setTab('register')}>Daftar gratis</a></>
          : <> Sudah punya akun? <a onClick={() => setTab('login')}>Masuk</a></>
        }
      </p>
    </div>
  );
}
