import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
    const [mode, setMode] = useState('login')
    const [role, setRole] = useState('sender')
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        nin: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    const navigate = useNavigate()
    const BACKEND = import.meta.env.VITE_BACKEND_URL

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleLogin() {
        setError(null)
        setLoading(true)

        try {
            const res = await fetch(BACKEND + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            })

            const data = await res.json()

            if (!data.success) {
                setError(data.error || 'Login failed')
                setLoading(false)
                return
            }

            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('session', JSON.stringify(data.session))

            if (data.user.role === 'admin') navigate('/admin')
            else if (data.user.role === 'sender') navigate('/sender')
            else navigate('/rider')

        } catch (err) {
            setError('Something went wrong. Please try again.')
        }

        setLoading(false)
    }

    async function handleRegister() {
        setError(null)
        setLoading(true)

        if (!form.name || !form.email || !form.password) {
            setError('Name, email and password are required.')
            setLoading(false)
            return
        }

        if (role === 'rider' && !form.nin) {
            setError('NIN is required for rider registration.')
            setLoading(false)
            return
        }

        try {
            const res = await fetch(BACKEND + '/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phone: form.phone,
                    role,
                    nin: form.nin,
                }),
            })

            const data = await res.json()

            if (!data.success) {
                setError(data.error || 'Registration failed')
                setLoading(false)
                return
            }

            setSuccessMsg(
                role === 'rider'
                    ? 'Registration successful. Please wait for admin approval before logging in.'
                    : 'Registration successful. You can now log in.'
            )

            setMode('login')

        } catch (err) {
            setError('Something went wrong. Please try again.')
        }

        setLoading(false)
    }

    const inputClass =
        'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-white transition-all'

    return (
        <div className="min-h-screen bg-emerald-50 flex flex-col">

            {/* NAV */}
            <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-emerald-900/10 bg-emerald-50">

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center">
                        <span className="text-white text-base">🔗</span>
                    </div>

                    <span className="text-emerald-900 text-base font-medium tracking-widest">
                        DeliveryChain
                    </span>
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="text-sm text-emerald-800 hover:text-emerald-600 cursor-pointer"
                >
                    Back to home
                </button>

            </nav>


            {/* MAIN */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">

                <div className="grid md:grid-cols-[1fr_420px] gap-12 md:gap-20 items-center">


                    {/* LEFT SIDE */}
                    <section className="max-w-xl">

                        <div className="text-sm font-medium text-emerald-700 mb-5">
                            {mode === 'login'
                                ? 'Welcome back'
                                : 'Join DeliveryChain'}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight text-emerald-950 mb-6">
                            {mode === 'login'
                                ? 'Access your delivery workspace.'
                                : 'Create your delivery account.'}
                        </h1>

                        <p className="text-gray-600 text-base leading-7 max-w-lg mb-8">
                            {mode === 'login'
                                ? 'Sign in to manage deliveries, follow progress, and access the records associated with your account.'
                                : 'Create an account to coordinate deliveries, manage your work, and keep important delivery events connected.'}
                        </p>


                        {/* TRUST INFORMATION */}
                        <div className="border-l border-emerald-700/30 pl-6">

                            <div className="text-emerald-900 text-lg font-medium mb-3">
                                Built for accountable delivery
                            </div>

                            <p className="text-gray-500 text-sm leading-6 max-w-md mb-5">
                                DeliveryChain uses role-based access so senders,
                                riders, and administrators can focus on the
                                work they are authorized to perform.
                            </p>

                            <div className="flex flex-col gap-3">

                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-gray-500 text-sm">
                                        Secure account access
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-gray-500 text-sm">
                                        Role-based delivery workflows
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-gray-500 text-sm">
                                        Verifiable delivery records
                                    </span>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* AUTH CARD */}
                    <section className="w-full">

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-7">

                            {/* MODE SWITCH */}
                            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">

                                {['login', 'register'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => {
                                            setMode(m)
                                            setError(null)
                                            setSuccessMsg(null)
                                        }}
                                        className={[
                                            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer capitalize',
                                            mode === m
                                                ? 'bg-white text-emerald-800 shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600'
                                        ].join(' ')}
                                    >
                                        {m === 'login' ? 'Sign in' : 'Create account'}
                                    </button>
                                ))}

                            </div>


                            {/* CARD HEADING */}
                            <div className="mb-5">

                                <h2 className="text-xl font-semibold text-gray-900">
                                    {mode === 'login'
                                        ? 'Sign in to DeliveryChain'
                                        : 'Create your account'}
                                </h2>

                                <p className="text-gray-400 text-sm mt-1">
                                    {mode === 'login'
                                        ? 'Enter your account details to continue.'
                                        : 'Choose your role and enter your details.'}
                                </p>

                            </div>


                            {/* MESSAGES */}
                            {successMsg && (
                                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
                                    {successMsg}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                                    {error}
                                </div>
                            )}


                            {/* FORM */}
                            <div className="flex flex-col gap-3">

                                {/* REGISTER FIELDS */}
                                {mode === 'register' && (
                                    <>

                                        {/* ROLE */}
                                        <div className="flex gap-2 mb-1">

                                            {['sender', 'rider'].map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => setRole(r)}
                                                    className={[
                                                        'flex-1 py-3 rounded-xl border text-sm font-medium capitalize cursor-pointer transition-all',
                                                        role === r
                                                            ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                                                            : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                    ].join(' ')}
                                                >
                                                    {r === 'sender'
                                                        ? '📦 Sender'
                                                        : '🏍️ Rider'}
                                                </button>
                                            ))}

                                        </div>


                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone number (optional)"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />

                                        {role === 'rider' && (
                                            <input
                                                type="text"
                                                name="nin"
                                                placeholder="NIN (National ID Number)"
                                                value={form.nin}
                                                onChange={handleChange}
                                                className={inputClass}
                                            />
                                        )}

                                    </>
                                )}


                                {/* EMAIL */}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={inputClass}
                                />


                                {/* PASSWORD */}
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={inputClass}
                                />


                                {/* SUBMIT */}
                                <button
                                    onClick={
                                        mode === 'login'
                                            ? handleLogin
                                            : handleRegister
                                    }
                                    disabled={loading}
                                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-medium py-3.5 rounded-xl text-sm cursor-pointer transition-all disabled:opacity-50 mt-2"
                                >
                                    {loading
                                        ? 'Please wait...'
                                        : mode === 'login'
                                            ? 'Sign in'
                                            : 'Create account'}
                                </button>

                            </div>

                        </div>


                        {/* CARD NOTE */}
                        <p className="text-center text-gray-400 text-xs mt-4 px-4">
                            Your account determines which delivery workspace
                            and actions are available to you.
                        </p>

                    </section>

                </div>

            </main>


            {/* SOFT BLOCKCHAIN FOOTER */}
            <footer className="border-t border-emerald-900/10 px-6 md:px-10 py-4">

                <div className="flex items-center justify-center gap-2">

                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                    <span className="text-xs text-gray-400 text-center">
                        Selected delivery records can be verified through
                        blockchain transaction history on Ethereum Sepolia.
                    </span>

                </div>

            </footer>

        </div>
    )
}

export default Landing