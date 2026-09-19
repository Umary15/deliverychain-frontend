import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
    const [tab, setTab] = useState('applications')
    const [applications, setApplications] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [disputes, setDisputes] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    // KEEP ORIGINAL ENV VARIABLE
    const BACKEND = import.meta.env.VITE_BACKEND_URL

    // KEEP ORIGINAL STATUS DATA
    const STATUS_STYLES = {
        CREATED: {
            label: 'Awaiting Rider',
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
        },
        ASSIGNED: {
            label: 'Rider Assigned',
            bg: 'bg-blue-100',
            text: 'text-blue-700',
        },
        PICKED_UP: {
            label: 'In Transit',
            bg: 'bg-blue-100',
            text: 'text-blue-700',
        },
        DELIVERED: {
            label: 'Delivered',
            bg: 'bg-green-100',
            text: 'text-green-700',
        },
        DISPUTED: {
            label: 'Disputed',
            bg: 'bg-red-100',
            text: 'text-red-700',
        },
    }

    const PAYMENT_STYLES = {
        PENDING: {
            label: 'Payment Pending',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
        },
        SETTLED: {
            label: 'Settled',
            bg: 'bg-green-50',
            text: 'text-green-600',
        },
        REFUNDED: {
            label: 'Refunded',
            bg: 'bg-gray-50',
            text: 'text-gray-600',
        },
    }

    // KEEP ORIGINAL AUTH CHECK
    useEffect(() => {
        const stored = localStorage.getItem('user')

        if (!stored) {
            navigate('/')
            return
        }

        const u = JSON.parse(stored)

        // IMPORTANT: original app uses lowercase 'admin'
        if (u.role !== 'admin') {
            navigate('/')
            return
        }

        setUser(u)
        fetchAll()
    }, [])

    // KEEP ORIGINAL API LOGIC
    async function fetchAll() {
        setLoading(true)

        const [appRes, delRes, disRes] = await Promise.all([
            fetch(BACKEND + '/api/admin/applications'),
            fetch(BACKEND + '/api/admin/deliveries'),
            fetch(BACKEND + '/api/admin/disputes'),
        ])

        const [appData, delData, disData] = await Promise.all([
            appRes.json(),
            delRes.json(),
            disRes.json(),
        ])

        if (appData.success) setApplications(appData.applications)
        if (delData.success) setDeliveries(delData.deliveries)
        if (disData.success) setDisputes(disData.disputes)

        setLoading(false)
    }

    async function approveRider(id) {
        const res = await fetch(
            BACKEND + '/api/admin/applications/' + id + '/approve',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id }),
            }
        )

        const data = await res.json()

        if (data.success) {
            alert('Rider approved.')
            fetchAll()
        } else {
            alert(data.error || 'Failed to approve rider.')
        }
    }

    async function rejectRider(id) {
        const res = await fetch(
            BACKEND + '/api/admin/applications/' + id + '/reject',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id }),
            }
        )

        const data = await res.json()

        if (data.success) {
            alert('Rider rejected.')
            fetchAll()
        } else {
            alert(data.error || 'Failed to reject rider.')
        }
    }

    async function resolveDispute(dispute) {
        const resolution = window.prompt('Enter resolution notes:')

        if (!resolution) return

        const res = await fetch(
            BACKEND + '/api/admin/disputes/' + dispute.id + '/resolve',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id,
                    resolution,
                }),
            }
        )

        const data = await res.json()

        if (data.success) {
            alert('Dispute resolved and recorded on blockchain.')
            fetchAll()
        } else {
            alert(data.error || 'Failed to resolve dispute.')
        }
    }

    async function recordSettlement(delivery, settled) {
        const res = await fetch(
            BACKEND + '/api/admin/deliveries/' + delivery.id + '/settle',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settled }),
            }
        )

        const data = await res.json()

        if (data.success) {
            alert('Settlement recorded on blockchain.')
            fetchAll()
        } else {
            alert(data.error || 'Failed to record settlement.')
        }
    }

    function logout() {
        localStorage.removeItem('user')
        localStorage.removeItem('session')
        navigate('/')
    }

    const tabs = [
        {
            key: 'applications',
            label: 'Applications',
            count: applications.length,
        },
        {
            key: 'deliveries',
            label: 'Deliveries',
            count: deliveries.length,
        },
        {
            key: 'disputes',
            label: 'Disputes',
            count: disputes.length,
        },
    ]

    return (
        <div className="min-h-screen bg-[#f7faf8] text-gray-800">

            {/* HEADER */}
            <header className="bg-white border-b border-emerald-900/10 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0a2e1f] flex items-center justify-center text-white">
                            🔗
                        </div>

                        <div>
                            <div className="font-bold text-[#0a2e1f] text-sm sm:text-base">
                                DeliveryChain
                            </div>

                            <div className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                                Admin Console
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full">
                            Admin
                        </span>

                        <button
                            onClick={logout}
                            className="text-xs font-medium text-gray-500 hover:text-[#0a2e1f] transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto flex">

                {/* SIDEBAR */}
                <aside className="hidden md:block w-56 shrink-0 border-r border-emerald-900/10 min-h-[calc(100vh-4rem)] bg-white px-4 py-7">

                    <div className="px-3 mb-6">
                        <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-gray-400">
                            Control Panel
                        </p>

                        <p className="text-xs text-gray-400 mt-1 leading-5">
                            Manage the delivery network.
                        </p>
                    </div>

                    <nav className="space-y-1">
                        {tabs.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={[
                                    'w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer',
                                    tab === t.key
                                        ? 'bg-[#0a2e1f] text-white'
                                        : 'text-gray-500 hover:bg-emerald-50 hover:text-[#0a2e1f]',
                                ].join(' ')}
                            >
                                <span>{t.label}</span>

                                <span
                                    className={[
                                        'text-[11px] px-2 py-0.5 rounded-full',
                                        tab === t.key
                                            ? 'bg-white/15 text-white'
                                            : 'bg-gray-100 text-gray-500',
                                    ].join(' ')}
                                >
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </nav>

                    <div className="mt-10 rounded-2xl bg-emerald-50 border border-emerald-900/10 p-4">
                        <div className="w-8 h-8 rounded-lg bg-[#0a2e1f] text-white flex items-center justify-center text-sm mb-3">
                            ✓
                        </div>

                        <p className="font-semibold text-sm text-[#0a2e1f]">
                            Secure records
                        </p>

                        <p className="text-xs text-gray-500 leading-5 mt-1">
                            Important delivery actions are recorded through the blockchain workflow.
                        </p>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-7 pb-20">

                    {/* MOBILE TABS */}
                    <div className="md:hidden mb-7 overflow-x-auto">
                        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1.5 min-w-max">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={[
                                        'px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all',
                                        tab === t.key
                                            ? 'bg-[#0a2e1f] text-white'
                                            : 'text-gray-500 hover:bg-gray-50',
                                    ].join(' ')}
                                >
                                    {t.label} ({t.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PAGE INTRO */}
                    <div className="mb-8">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 font-bold mb-2">
                            Admin Dashboard
                        </p>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a2e1f]">
                            Good morning, {user?.name || 'Admin'}.
                        </h1>

                        <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-6">
                            Manage rider applications, monitor deliveries, and resolve delivery disputes from one place.
                        </p>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-400">
                                Applications
                            </p>

                            <p className="text-3xl font-bold text-[#0a2e1f] mt-2">
                                {applications.length}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Rider requests
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-400">
                                Deliveries
                            </p>

                            <p className="text-3xl font-bold text-[#0a2e1f] mt-2">
                                {deliveries.length}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Platform deliveries
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-400">
                                Disputes
                            </p>

                            <p className="text-3xl font-bold text-[#0a2e1f] mt-2">
                                {disputes.length}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Open issues
                            </p>
                        </div>

                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="bg-white border border-gray-200 rounded-2xl py-14 text-center shadow-sm">
                            <div className="w-8 h-8 border-2 border-emerald-100 border-t-emerald-700 rounded-full animate-spin mx-auto mb-4" />

                            <p className="text-sm font-medium text-gray-600">
                                Loading dashboard...
                            </p>
                        </div>
                    )}

                    {/* APPLICATIONS */}
                    {!loading && tab === 'applications' && (
                        <>
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-[#0a2e1f]">
                                    Rider applications
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Review and manage requests from new riders.
                                </p>
                            </div>

                            {applications.length === 0 && (
                                <div className="bg-white border border-dashed border-gray-300 rounded-2xl text-center py-14">
                                    <div className="text-3xl mb-3">📋</div>

                                    <p className="text-gray-400 text-sm">
                                        No pending rider applications.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {applications.map(a => (
                                    <div
                                        key={a.id}
                                        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                            <div className="flex items-start gap-4">
                                                <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 text-[#0a2e1f] flex items-center justify-center font-bold">
                                                    {(a.users?.name || 'R').charAt(0).toUpperCase()}
                                                </div>

                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">
                                                        {a.users?.name}
                                                    </div>

                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {a.users?.email}
                                                    </div>

                                                    {a.users?.phone && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            📞 {a.users?.phone}
                                                        </div>
                                                    )}

                                                    <div className="text-xs text-gray-500 mt-2">
                                                        NIN:{' '}
                                                        <span className="font-semibold">
                                                            {a.users?.nin || a.nin}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Applied: {new Date(a.applied_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 lg:w-48">
                                                <button
                                                    onClick={() => rejectRider(a.id)}
                                                    className="flex-1 bg-red-50 border border-red-200 text-red-600 text-xs font-bold py-2.5 rounded-xl cursor-pointer hover:bg-red-100 transition-all"
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() => approveRider(a.id)}
                                                    className="flex-1 bg-[#0a2e1f] hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                                                >
                                                    Approve
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* DELIVERIES */}
                    {!loading && tab === 'deliveries' && (
                        <>
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-[#0a2e1f]">
                                    Delivery activity
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Monitor deliveries and manage completed payments.
                                </p>
                            </div>

                            {deliveries.length === 0 && (
                                <div className="bg-white border border-dashed border-gray-300 rounded-2xl text-center py-14">
                                    <div className="text-3xl mb-3">📦</div>

                                    <p className="text-gray-400 text-sm">
                                        No deliveries yet.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {deliveries.map(d => {
                                    const s =
                                        STATUS_STYLES[d.status] ||
                                        STATUS_STYLES.CREATED

                                    const p =
                                        PAYMENT_STYLES[d.payment_status] ||
                                        PAYMENT_STYLES.PENDING

                                    return (
                                        <div
                                            key={d.id}
                                            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
                                        >

                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">

                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <div className="font-bold text-gray-800 text-sm">
                                                            {d.item_description}
                                                        </div>

                                                        <span
                                                            className={[
                                                                'text-[11px] font-semibold px-2.5 py-1 rounded-full',
                                                                s.bg,
                                                                s.text,
                                                            ].join(' ')}
                                                        >
                                                            {s.label}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-gray-400 mt-2">
                                                        From: {d.sender?.name}
                                                    </div>

                                                    <div className="text-xs text-gray-400 mt-1">
                                                        To: {d.recipient_name} — {d.delivery_address}
                                                    </div>

                                                    {d.rider && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Rider: {d.rider?.name}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-left sm:text-right">
                                                    <div className="text-lg font-bold text-emerald-700">
                                                        ₦{Number(d.fee_naira).toLocaleString()}
                                                    </div>

                                                    <span
                                                        className={[
                                                            'inline-block text-[11px] font-medium px-2.5 py-1 rounded-lg mt-1',
                                                            p.bg,
                                                            p.text,
                                                        ].join(' ')}
                                                    >
                                                        {p.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {d.status === 'DELIVERED' &&
                                                d.payment_status === 'PENDING' && (
                                                    <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                                                        <button
                                                            onClick={() => recordSettlement(d, true)}
                                                            className="flex-1 bg-[#0a2e1f] hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                                                        >
                                                            Mark Settled
                                                        </button>

                                                        <button
                                                            onClick={() => recordSettlement(d, false)}
                                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                                                        >
                                                            Mark Refunded
                                                        </button>
                                                    </div>
                                                )}

                                            {d.blockchain_tx_ids &&
                                                d.blockchain_tx_ids.created && (
                                                    <a
                                                        href={
                                                            'https://sepolia.etherscan.io/tx/' +
                                                            d.blockchain_tx_ids.created
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-4 pt-3 border-t border-gray-100 block text-xs text-blue-500 hover:text-blue-700 underline"
                                                    >
                                                        View blockchain record ↗
                                                    </a>
                                                )}

                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}

                    {/* DISPUTES */}
                    {!loading && tab === 'disputes' && (
                        <>
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-[#0a2e1f]">
                                    Delivery disputes
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Review reported problems and record resolutions.
                                </p>
                            </div>

                            {disputes.length === 0 && (
                                <div className="bg-white border border-dashed border-gray-300 rounded-2xl text-center py-14">
                                    <div className="text-3xl mb-3">✅</div>

                                    <p className="text-gray-400 text-sm">
                                        No open disputes.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {disputes.map(d => (
                                    <div
                                        key={d.id}
                                        className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                                                    !
                                                </div>

                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">
                                                        {d.delivery?.item_description}
                                                    </div>

                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Raised by: {d.raised_by?.name}
                                                    </div>

                                                    {d.reason && (
                                                        <div className="text-xs text-gray-500 mt-2">
                                                            Reason: {d.reason}
                                                        </div>
                                                    )}

                                                    <div className="text-xs text-gray-400 mt-2">
                                                        {new Date(d.raised_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => resolveDispute(d)}
                                                className="lg:w-44 bg-[#0a2e1f] hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                                            >
                                                Resolve Dispute
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* FOOTER */}
                    <footer className="mt-12 pt-6 border-t border-emerald-900/10">
                        <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-400">
                            <span>
                                DeliveryChain Admin Console
                            </span>

                            <span>
                                Delivery records can be verified through blockchain transaction history.
                            </span>
                        </div>
                    </footer>

                </main>
            </div>
        </div>
    )
}

export default AdminDashboard