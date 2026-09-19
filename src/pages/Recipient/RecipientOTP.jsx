import { useState } from 'react'
import { useParams } from 'react-router-dom'

function RecipientOTP() {
    const { deliveryId } = useParams()
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const [txHash, setTxHash] = useState(null)
    const [error, setError] = useState(null)

    function handleOtpChange(index, value) {
        if (!/^\d?$/.test(value)) return

        const next = [...otp]
        next[index] = value
        setOtp(next)

        if (value && index < 5) {
            document.getElementById('otp-' + (index + 1)).focus()
        }
    }

    function handleKeyDown(index, e) {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById('otp-' + (index - 1)).focus()
        }
    }

    async function handleConfirm() {
        const code = otp.join('')

        if (code.length !== 6) {
            setError('Please enter all 6 digits.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/api/otp/verify',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        deliveryId,
                        otp: code,
                    }),
                }
            )

            const data = await res.json()

            if (data.success) {
                setTxHash(data.transactionHash)
                setConfirmed(true)
            } else {
                setError(
                    data.error ||
                    'Invalid or expired OTP. Please try again.'
                )
            }
        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please try again.')
        }

        setLoading(false)
    }

    /* =========================
       CONFIRMED SCREEN
    ========================= */

    if (confirmed) {
        return (
            <div className="min-h-screen bg-[#f8faf9] text-gray-800">

                {/* Header */}
                <header className="border-b border-white/10 bg-[#0a2e1f] text-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

                        <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-400/15">
                                <span className="text-sm">
                                    🔗
                                </span>
                            </div>

                            <span className="font-bold tracking-tight">
                                DeliveryChain
                            </span>

                        </div>

                        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            Recipient
                        </span>

                    </div>
                </header>

                {/* Confirmation */}
                <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-10">

                    <div className="w-full max-w-md">

                        <div className="mb-7 text-center">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                                <span className="text-2xl">
                                    ✓
                                </span>
                            </div>

                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                                Delivery complete
                            </p>

                            <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2e1f]">
                                Delivery confirmed
                                <span className="text-emerald-500">
                                    .
                                </span>
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                                Your confirmation has been recorded permanently
                                on the blockchain. The rider payment has been
                                released automatically.
                            </p>

                        </div>

                        {/* Transaction card */}
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.05)]">

                            <div className="mb-4 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                                    <span className="text-sm">
                                        ⛓
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-800">
                                        Blockchain confirmation
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Your receipt has been recorded.
                                    </p>
                                </div>

                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Transaction hash
                                </p>

                                <p className="break-all text-xs font-semibold leading-5 text-emerald-700">
                                    {txHash}
                                </p>

                            </div>

                            <a
                                href={
                                    'https://sepolia.etherscan.io/tx/' +
                                    txHash
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 block w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                            >
                                View on Sepolia Etherscan →
                            </a>

                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
                            Thank you for using DeliveryChain.
                        </p>

                    </div>

                </main>

            </div>
        )
    }

    /* =========================
       OTP SCREEN
    ========================= */

    return (
        <div className="min-h-screen bg-[#f8faf9] text-gray-800">

            {/* Header */}
            <header className="border-b border-white/10 bg-[#0a2e1f] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

                    <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-400/15">
                            <span className="text-sm">
                                🔗
                            </span>
                        </div>

                        <span className="font-bold tracking-tight">
                            DeliveryChain
                        </span>

                    </div>

                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        Recipient
                    </span>

                </div>
            </header>

            {/* Main */}
            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-10">

                <div className="w-full max-w-md">

                    {/* Intro */}
                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a2e1f] shadow-sm">
                            <span className="text-xl">
                                📦
                            </span>
                        </div>

                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                            Secure confirmation
                        </p>

                        <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2e1f]">
                            Confirm your delivery
                            <span className="text-emerald-500">
                                .
                            </span>
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                            Enter the 6-digit code sent to your email to
                            confirm that you received your package.
                        </p>

                    </div>

                    {/* Main card */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.05)] sm:p-6">

                        {/* Delivery ID */}
                        <div className="mb-7 rounded-xl border border-gray-100 bg-gray-50 p-4">

                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Delivery ID
                            </p>

                            <p className="break-all text-xs font-semibold leading-5 text-gray-600">
                                {deliveryId}
                            </p>

                        </div>

                        {/* OTP label */}
                        <div className="mb-4 text-center">

                            <label className="text-sm font-bold text-gray-700">
                                Delivery code
                            </label>

                            <p className="mt-1 text-xs text-gray-400">
                                Enter all six digits
                            </p>

                        </div>

                        {/* OTP inputs */}
                        <div className="mb-6 flex justify-center gap-2 sm:gap-3">

                            {otp.map((v, i) => (
                                <input
                                    key={i}
                                    id={'otp-' + i}
                                    maxLength={1}
                                    inputMode="numeric"
                                    value={v}
                                    onChange={(e) =>
                                        handleOtpChange(
                                            i,
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) =>
                                        handleKeyDown(i, e)
                                    }
                                    className={[
                                        'h-12 w-10 rounded-xl border-2 bg-white text-center text-lg font-extrabold outline-none transition-all sm:h-14 sm:w-12 sm:text-xl',
                                        v
                                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                            : 'border-gray-200 text-gray-800',
                                        'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100',
                                    ].join(' ')}
                                />
                            ))}

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-medium leading-5 text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Confirm */}
                        <button
                            onClick={handleConfirm}
                            disabled={
                                loading ||
                                otp.join('').length !== 6
                            }
                            className="w-full rounded-xl bg-[#0a2e1f] py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            {loading
                                ? 'Confirming...'
                                : 'Confirm receipt →'}
                        </button>

                    </div>

                    {/* Trust message */}
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">

                        <span className="mt-0.5 text-sm">
                            🔒
                        </span>

                        <p className="text-xs leading-5 text-emerald-800/70">
                            By confirming, you agree that the package was
                            received. This action is recorded permanently
                            on the blockchain.
                        </p>

                    </div>

                    {/* Footer */}
                    <footer className="mt-8 text-center">

                        <p className="text-[11px] text-gray-400">
                            DeliveryChain · Trusted delivery coordination
                        </p>

                    </footer>

                </div>

            </main>

        </div>
    )
}

export default RecipientOTP