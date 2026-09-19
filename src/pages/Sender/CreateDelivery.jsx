import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateDelivery() {
    const [form, setForm] = useState({
        recipientName: '',
        recipientEmail: '',
        recipientPhone: '',
        itemDescription: '',
        deliveryAddress: '',
        feeNaira: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const BACKEND = import.meta.env.VITE_BACKEND_URL

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit() {
        setError(null)

        const {
            recipientName,
            recipientEmail,
            recipientPhone,
            itemDescription,
            deliveryAddress,
            feeNaira,
        } = form

        if (
            !recipientName ||
            !recipientEmail ||
            !recipientPhone ||
            !itemDescription ||
            !deliveryAddress ||
            !feeNaira
        ) {
            setError('Please fill in all fields.')
            return
        }

        setLoading(true)

        try {
            const user = JSON.parse(localStorage.getItem('user'))

            const res = await fetch(BACKEND + '/api/delivery/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: user.id,
                    recipientName,
                    recipientEmail,
                    recipientPhone,
                    itemDescription,
                    deliveryAddress,
                    feeNaira: Number(feeNaira),
                }),
            })

            const data = await res.json()

            if (!data.success) {
                setError(data.error || 'Failed to create delivery')
                setLoading(false)
                return
            }

            navigate('/sender')
        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please try again.')
        }

        setLoading(false)
    }

    const fields = [
        {
            name: 'recipientName',
            label: 'Recipient Name',
            placeholder: 'e.g. Amina Yusuf',
            type: 'text',
        },
        {
            name: 'recipientEmail',
            label: 'Recipient Email',
            placeholder: 'e.g. amina@email.com',
            type: 'email',
        },
        {
            name: 'recipientPhone',
            label: 'Recipient Phone',
            placeholder: 'e.g. 08012345678',
            type: 'tel',
        },
        {
            name: 'itemDescription',
            label: 'Item Description',
            placeholder: 'e.g. Laptop charger',
            type: 'text',
        },
        {
            name: 'deliveryAddress',
            label: 'Delivery Address',
            placeholder: 'e.g. No 5 Wuse Market...',
            type: 'text',
        },
        {
            name: 'feeNaira',
            label: 'Delivery Fee (₦ NGN)',
            placeholder: 'e.g. 2500',
            type: 'number',
        },
    ]

    return (
        <div className="min-h-screen bg-[#f8faf9] text-gray-800">

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a2e1f] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

                    <button
                        onClick={() => navigate('/sender')}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <span className="text-lg">←</span>

                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-400/15">
                                <span className="text-sm">🔗</span>
                            </div>

                            <span className="font-bold tracking-tight">
                                DeliveryChain
                            </span>
                        </div>
                    </button>

                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        New Delivery
                    </span>

                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">

                {/* Intro */}
                <section className="mb-8">

                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Delivery request
                    </p>

                    <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2e1f] sm:text-4xl">
                        Create a new delivery
                        <span className="text-emerald-500">.</span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Enter the recipient and delivery details below.
                        Your delivery will be recorded on the blockchain
                        once it is created.
                    </p>

                </section>

                {/* Form card */}
                <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.04)] sm:p-7">

                    <div className="mb-7 border-b border-gray-100 pb-5">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                            Delivery details
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-[#0a2e1f]">
                            Recipient & shipment information
                        </h2>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        {fields.map(f => (
                            <div
                                key={f.name}
                                className={
                                    f.name === 'deliveryAddress' ||
                                        f.name === 'itemDescription'
                                        ? 'sm:col-span-2'
                                        : ''
                                }
                            >
                                <label
                                    htmlFor={f.name}
                                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500"
                                >
                                    {f.label}
                                </label>

                                <input
                                    id={f.name}
                                    type={f.type}
                                    name={f.name}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                    placeholder={f.placeholder}
                                    min={f.type === 'number' ? '0' : undefined}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                                />
                            </div>
                        ))}

                    </div>

                    {/* Blockchain information */}
                    <div className="mt-7 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-5">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                                <span className="text-sm">🔗</span>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-emerald-900">
                                    Transparent delivery record
                                </p>

                                <p className="mt-1 text-xs leading-5 text-emerald-800/70">
                                    Delivery fees are paid directly between you
                                    and the rider in Naira. The blockchain
                                    records delivery events such as creation,
                                    pickup, and confirmation, providing a
                                    permanent audit trail.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            onClick={() => navigate('/sender')}
                            disabled={loading}
                            className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="rounded-xl bg-[#0a2e1f] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                            {loading
                                ? 'Recording on blockchain...'
                                : 'Create Delivery →'}
                        </button>

                    </div>

                </section>

                {/* Footer */}
                <footer className="mt-10 border-t border-gray-200 pt-6">

                    <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                        <span>DeliveryChain</span>

                        <span>
                            Trusted delivery coordination on the blockchain
                        </span>
                    </div>

                </footer>

            </main>
        </div>
    )
}

export default CreateDelivery