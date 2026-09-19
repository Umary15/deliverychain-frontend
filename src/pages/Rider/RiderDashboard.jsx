import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RiderDashboard() {
    const [availableJobs, setAvailableJobs] = useState([])
    const [myJobs, setMyJobs] = useState([])
    const [tab, setTab] = useState('available')
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [uploadingId, setUploadingId] = useState(null)
    const [processingId, setProcessingId] = useState(null)
    const navigate = useNavigate()

    const BACKEND = import.meta.env.VITE_BACKEND_URL

    const STATUS_STYLES = {
        ASSIGNED: {
            label: 'Assigned',
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            dot: 'bg-blue-500',
        },
        PICKED_UP: {
            label: 'In Transit',
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            dot: 'bg-blue-500',
        },
        DELIVERED: {
            label: 'Delivered',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            dot: 'bg-emerald-500',
        },
        DISPUTED: {
            label: 'Disputed',
            bg: 'bg-red-50',
            text: 'text-red-700',
            dot: 'bg-red-500',
        },
    }

    useEffect(() => {
        const stored = localStorage.getItem('user')

        if (!stored) {
            navigate('/')
            return
        }

        const u = JSON.parse(stored)

        if (u.role !== 'rider') {
            navigate('/')
            return
        }

        if (!u.is_approved) {
            alert('Your account is pending admin approval. Please check back later.')
            navigate('/')
            return
        }

        setUser(u)
        fetchJobs(u.id)
    }, [])

    async function fetchJobs(riderId) {
        setLoading(true)

        const res = await fetch(BACKEND + '/api/admin/deliveries')
        const data = await res.json()

        if (data.success) {
            const available = data.deliveries.filter(
                d => d.status === 'CREATED'
            )

            const mine = data.deliveries.filter(
                d => d.rider_id === riderId
            )

            setAvailableJobs(available)
            setMyJobs(mine)
        }

        setLoading(false)
    }

    async function acceptJob(delivery) {
        setProcessingId(delivery.id)

        try {
            const res = await fetch(
                BACKEND + '/api/delivery/' + delivery.id + '/assign',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ riderId: user.id }),
                }
            )

            const data = await res.json()

            if (data.success) {
                alert('Job accepted and recorded on blockchain.')
                fetchJobs(user.id)
                setTab('myjobs')
            } else {
                alert(data.error || 'Failed to accept job.')
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong.')
        }

        setProcessingId(null)
    }

    async function confirmPickup(delivery) {
        setProcessingId(delivery.id)

        try {
            const res = await fetch(
                BACKEND + '/api/delivery/' + delivery.id + '/pickup',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ riderId: user.id }),
                }
            )

            const data = await res.json()

            if (data.success) {
                alert('Pickup confirmed and recorded on blockchain.')
                fetchJobs(user.id)
            } else {
                alert(data.error || 'Failed to confirm pickup.')
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong.')
        }

        setProcessingId(null)
    }

    async function uploadPhotoAndSendOTP(delivery) {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'

        input.onchange = async (e) => {
            const file = e.target.files[0]

            if (!file) return

            setUploadingId(delivery.id)

            try {
                const formData = new FormData()
                formData.append('photo', file)
                formData.append('deliveryId', delivery.id)

                const uploadRes = await fetch(
                    BACKEND + '/api/delivery/upload-photo',
                    {
                        method: 'POST',
                        body: formData,
                    }
                )

                const uploadData = await uploadRes.json()

                if (!uploadData.success) {
                    alert('Photo upload failed. Please try again.')
                    setUploadingId(null)
                    return
                }

                const otpRes = await fetch(
                    BACKEND + '/api/otp/send',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            deliveryId: delivery.id,
                        }),
                    }
                )

                const otpData = await otpRes.json()

                if (otpData.success) {
                    alert(
                        'Photo uploaded to IPFS and OTP sent to recipient email.'
                    )
                    fetchJobs(user.id)
                } else {
                    alert(
                        'Photo uploaded but OTP failed to send. Try resending.'
                    )
                }
            } catch (err) {
                console.error(err)
                alert('Something went wrong.')
            }

            setUploadingId(null)
        }

        input.click()
    }

    async function resendOTP(delivery) {
        try {
            const res = await fetch(
                BACKEND + '/api/otp/send',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        deliveryId: delivery.id,
                    }),
                }
            )

            const data = await res.json()

            if (data.success) {
                alert('OTP resent to recipient email.')
            } else {
                alert('Failed to resend OTP.')
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong.')
        }
    }

    function logout() {
        localStorage.removeItem('user')
        localStorage.removeItem('session')
        navigate('/')
    }

    const stats = [
        {
            label: 'Available jobs',
            value: availableJobs.length,
            dot: 'bg-emerald-500',
        },
        {
            label: 'My jobs',
            value: myJobs.length,
            dot: 'bg-blue-500',
        },
        {
            label: 'Delivered',
            value: myJobs.filter(
                d => d.status === 'DELIVERED'
            ).length,
            dot: 'bg-emerald-500',
        },
    ]

    return (
        <div className="min-h-screen bg-[#f8faf9] text-gray-800">

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a2e1f] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

                    <button
                        onClick={() => navigate('/rider')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-400/15">
                            <span className="text-sm">🔗</span>
                        </div>

                        <span className="font-bold tracking-tight">
                            DeliveryChain
                        </span>
                    </button>

                    <div className="flex items-center gap-4">

                        <div className="hidden text-right sm:block">
                            <p className="text-xs text-white/50">
                                Signed in as
                            </p>

                            <p className="text-sm font-medium text-white/90">
                                {user?.name}
                            </p>
                        </div>

                        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            Rider
                        </span>

                        <button
                            onClick={logout}
                            className="text-xs font-medium text-white/60 hover:text-white cursor-pointer"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">

                {/* Intro */}
                <section className="mb-8">

                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Rider dashboard
                    </p>

                    <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2e1f] sm:text-4xl">
                        Find and manage jobs
                        <span className="text-emerald-500">.</span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Browse available deliveries, manage accepted jobs,
                        and securely confirm each stage of the delivery.
                    </p>

                </section>

                {/* Stats */}
                <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    {stats.map(stat => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.04)]"
                        >
                            <div className="mb-4 flex items-center justify-between">

                                <span className="text-xs font-medium text-gray-400">
                                    {stat.label}
                                </span>

                                <span
                                    className={[
                                        'h-2 w-2 rounded-full',
                                        stat.dot,
                                    ].join(' ')}
                                />

                            </div>

                            <div className="text-3xl font-extrabold tracking-tight text-[#0a2e1f]">
                                {stat.value}
                            </div>
                        </div>
                    ))}

                </section>

                {/* Tabs */}
                <section className="mb-7 rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-[0_8px_30px_rgba(10,46,31,0.04)]">

                    <div className="grid grid-cols-2 gap-1">

                        {[
                            [
                                'available',
                                'Available jobs',
                                availableJobs.length,
                            ],
                            [
                                'myjobs',
                                'My jobs',
                                myJobs.length,
                            ],
                        ].map(([t, label, count]) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={[
                                    'rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer',
                                    tab === t
                                        ? 'bg-[#0a2e1f] text-white shadow-sm'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600',
                                ].join(' ')}
                            >
                                {label}

                                <span
                                    className={[
                                        'ml-2 rounded-full px-2 py-0.5 text-[10px]',
                                        tab === t
                                            ? 'bg-white/10 text-emerald-200'
                                            : 'bg-gray-100 text-gray-400',
                                    ].join(' ')}
                                >
                                    {count}
                                </span>
                            </button>
                        ))}

                    </div>

                </section>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-[0_8px_30px_rgba(10,46,31,0.04)]">

                        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-600" />

                        <p className="text-sm text-gray-400">
                            Loading jobs...
                        </p>

                    </div>
                )}

                {/* Available jobs */}
                {!loading && tab === 'available' && (
                    <section>

                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                                Open opportunities
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-[#0a2e1f]">
                                Available deliveries
                            </h2>
                        </div>

                        {availableJobs.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">

                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                                    <span className="text-xl">🏍️</span>
                                </div>

                                <h3 className="font-semibold text-gray-700">
                                    No available jobs
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    There are no delivery requests waiting
                                    for a rider right now.
                                </p>

                            </div>
                        )}

                        <div className="space-y-3">

                            {availableJobs.map(d => (
                                <article
                                    key={d.id}
                                    className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.04)] transition hover:border-emerald-200"
                                >

                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                        <div className="min-w-0">

                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                                                <h3 className="text-sm font-bold text-gray-800">
                                                    {d.item_description}
                                                </h3>
                                            </div>

                                            <div className="mt-3 space-y-1.5 text-xs text-gray-400">

                                                <p>
                                                    To:{' '}
                                                    <span className="font-medium text-gray-600">
                                                        {d.recipient_name}
                                                    </span>
                                                </p>

                                                <p>
                                                    📍 {d.delivery_address}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="shrink-0 rounded-xl bg-emerald-50 px-4 py-3 sm:text-right">

                                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/60">
                                                Delivery fee
                                            </p>

                                            <p className="mt-1 text-lg font-extrabold text-emerald-700">
                                                ₦{Number(d.fee_naira).toLocaleString()}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-5 border-t border-gray-100 pt-4">

                                        <button
                                            onClick={() => acceptJob(d)}
                                            disabled={processingId === d.id}
                                            className="w-full rounded-xl bg-[#0a2e1f] py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
                                        >
                                            {processingId === d.id
                                                ? 'Processing...'
                                                : 'Accept job →'}
                                        </button>

                                    </div>

                                </article>
                            ))}

                        </div>

                    </section>
                )}

                {/* My jobs */}
                {!loading && tab === 'myjobs' && (
                    <section>

                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                                Your workload
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-[#0a2e1f]">
                                My jobs
                            </h2>
                        </div>

                        {myJobs.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">

                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                                    <span className="text-xl">📋</span>
                                </div>

                                <h3 className="font-semibold text-gray-700">
                                    No jobs accepted yet
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    Accepted deliveries will appear here.
                                </p>

                                <button
                                    onClick={() => setTab('available')}
                                    className="mt-5 rounded-xl bg-[#0a2e1f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 cursor-pointer"
                                >
                                    Browse available jobs →
                                </button>

                            </div>
                        )}

                        <div className="space-y-3">

                            {myJobs.map(d => {
                                const s =
                                    STATUS_STYLES[d.status] ||
                                    STATUS_STYLES.ASSIGNED

                                return (
                                    <article
                                        key={d.id}
                                        className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.04)]"
                                    >

                                        {/* Job header */}
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                            <div className="min-w-0">

                                                <div className="flex items-center gap-2">

                                                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                                                    <h3 className="text-sm font-bold text-gray-800">
                                                        {d.item_description}
                                                    </h3>

                                                </div>

                                                <div className="mt-3 space-y-1.5 text-xs text-gray-400">

                                                    <p>
                                                        To:{' '}
                                                        <span className="font-medium text-gray-600">
                                                            {d.recipient_name}
                                                        </span>
                                                    </p>

                                                    <p>
                                                        📍 {d.delivery_address}
                                                    </p>

                                                    <p>
                                                        📞 {d.recipient_phone}
                                                    </p>

                                                </div>

                                            </div>

                                            <span
                                                className={[
                                                    'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
                                                    s.bg,
                                                    s.text,
                                                ].join(' ')}
                                            >
                                                <span
                                                    className={[
                                                        'h-1.5 w-1.5 rounded-full',
                                                        s.dot,
                                                    ].join(' ')}
                                                />

                                                {s.label}
                                            </span>

                                        </div>

                                        {/* Fee */}
                                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                    Delivery fee
                                                </p>

                                                <p className="mt-1 text-sm font-extrabold text-emerald-700">
                                                    ₦{Number(d.fee_naira).toLocaleString()}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Assigned */}
                                        {d.status === 'ASSIGNED' && (
                                            <div className="mt-4">

                                                <button
                                                    onClick={() => confirmPickup(d)}
                                                    disabled={processingId === d.id}
                                                    className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                                >
                                                    {processingId === d.id
                                                        ? 'Processing...'
                                                        : 'Confirm pickup →'}
                                                </button>

                                            </div>
                                        )}

                                        {/* Picked up */}
                                        {d.status === 'PICKED_UP' && (
                                            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">

                                                <div className="mb-3">
                                                    <p className="text-sm font-bold text-blue-900">
                                                        Delivery in transit
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-blue-800/60">
                                                        Upload a delivery photo to IPFS
                                                        and send the confirmation OTP
                                                        to the recipient.
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-2">

                                                    <button
                                                        onClick={() => uploadPhotoAndSendOTP(d)}
                                                        disabled={uploadingId === d.id}
                                                        className="w-full rounded-xl bg-[#0a2e1f] py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {uploadingId === d.id
                                                            ? 'Uploading to IPFS...'
                                                            : 'Upload photo & send OTP'}
                                                    </button>

                                                    {d.ipfs_hash && (
                                                        <button
                                                            onClick={() => resendOTP(d)}
                                                            className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            Resend OTP
                                                        </button>
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                        {/* Delivered */}
                                        {d.status === 'DELIVERED' && (
                                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                                                <div className="flex items-start gap-3">

                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                                                        <span className="text-sm">✓</span>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold text-emerald-800">
                                                            Delivery confirmed
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-emerald-700/70">
                                                            Delivery confirmation has
                                                            been recorded on the
                                                            blockchain.
                                                        </p>

                                                        <p className="mt-2 text-xs font-semibold text-emerald-700">
                                                            Collect your ₦
                                                            {Number(d.fee_naira).toLocaleString()}
                                                            {' '}payment from the sender.
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>
                                        )}

                                        {/* Blockchain */}
                                        {d.blockchain_tx_ids &&
                                            d.blockchain_tx_ids.delivered && (
                                                <a
                                                    href={
                                                        'https://sepolia.etherscan.io/tx/' +
                                                        d.blockchain_tx_ids.delivered
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-4 block text-xs font-semibold text-blue-500 underline underline-offset-2 hover:text-blue-600"
                                                >
                                                    View confirmation on Etherscan →
                                                </a>
                                            )}

                                    </article>
                                )
                            })}

                        </div>

                    </section>
                )}

                {/* Footer */}
                <footer className="mt-14 border-t border-gray-200 pt-6">

                    <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">

                        <span>
                            DeliveryChain
                        </span>

                        <span>
                            Trusted delivery coordination on the blockchain
                        </span>

                    </div>

                </footer>

            </main>
        </div>
    )
}

export default RiderDashboard