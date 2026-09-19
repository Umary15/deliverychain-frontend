import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SenderDashboard() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const BACKEND = import.meta.env.VITE_BACKEND_URL

  const STATUS_STYLES = {
    CREATED: {
      label: 'Awaiting Rider',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
    },
    ASSIGNED: {
      label: 'Rider Assigned',
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

  const PAYMENT_STYLES = {
    PENDING: {
      label: 'Payment Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
    SETTLED: {
      label: 'Payment Settled',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    REFUNDED: {
      label: 'Refunded',
      bg: 'bg-gray-50',
      text: 'text-gray-600',
    },
  }

  useEffect(() => {
    const stored = localStorage.getItem('user')

    if (!stored) {
      navigate('/')
      return
    }

    const u = JSON.parse(stored)

    if (u.role !== 'sender') {
      navigate('/')
      return
    }

    setUser(u)
    fetchDeliveries(u.id)
  }, [])

  async function fetchDeliveries(senderId) {
    setLoading(true)

    const res = await fetch(BACKEND + '/api/admin/deliveries')
    const data = await res.json()

    if (data.success) {
      const mine = data.deliveries.filter(
        d => d.sender_id === senderId
      )

      setDeliveries(mine)
    }

    setLoading(false)
  }

  async function raiseDispute(delivery) {
    const reason = window.prompt('Briefly describe the issue:')

    if (!reason) return

    try {
      const res = await fetch(
        BACKEND + '/api/delivery/' + delivery.id + '/dispute',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raisedBy: user.id,
            reason,
          }),
        }
      )

      const data = await res.json()

      if (data.success) {
        alert('Dispute raised and recorded on blockchain.')
        fetchDeliveries(user.id)
      } else {
        alert(data.error || 'Failed to raise dispute.')
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
      label: 'Total deliveries',
      value: deliveries.length,
    },
    {
      label: 'Delivered',
      value: deliveries.filter(
        d => d.status === 'DELIVERED'
      ).length,
    },
    {
      label: 'Disputed',
      value: deliveries.filter(
        d => d.status === 'DISPUTED'
      ).length,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800">

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a2e1f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <button
            onClick={() => navigate('/sender')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/15 border border-emerald-300/20">
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
              Sender
            </span>

            <button
              onClick={logout}
              className="text-xs font-medium text-white/60 transition hover:text-white cursor-pointer"
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
          <div className="max-w-2xl">

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Sender dashboard
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2e1f] sm:text-4xl">
              Manage your deliveries
              <span className="text-emerald-500">.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Create deliveries, track their progress, and keep
              your delivery records securely coordinated.
            </p>

          </div>
        </section>

        {/* Stats */}
        <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.04)]"
            >
              <div className="mb-4 flex items-center justify-between">

                <span className="text-xs font-medium text-gray-400">
                  {stat.label}
                </span>

                <div
                  className={[
                    'h-2 w-2 rounded-full',
                    index === 0
                      ? 'bg-emerald-500'
                      : index === 1
                        ? 'bg-blue-500'
                        : 'bg-red-400',
                  ].join(' ')}
                />
              </div>

              <div className="text-3xl font-extrabold tracking-tight text-[#0a2e1f]">
                {stat.value}
              </div>
            </div>
          ))}

        </section>

        {/* Create delivery */}
        <section className="mb-9 overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#0a2e1f] shadow-[0_12px_35px_rgba(10,46,31,0.10)]">

          <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                New delivery
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Need to send something?
              </h2>

              <p className="mt-1 max-w-lg text-sm leading-5 text-white/55">
                Create a delivery request and let the network
                coordinate the rest.
              </p>
            </div>

            <button
              onClick={() => navigate('/sender/create')}
              className="shrink-0 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#0a2e1f] transition hover:bg-emerald-300 cursor-pointer"
            >
              Create new delivery
              <span className="ml-2">→</span>
            </button>

          </div>
        </section>

        {/* Deliveries heading */}
        <section>

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Activity
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#0a2e1f]">
                Your deliveries
              </h2>
            </div>

            {deliveries.length > 0 && (
              <span className="text-xs text-gray-400">
                {deliveries.length}{' '}
                {deliveries.length === 1
                  ? 'delivery'
                  : 'deliveries'}
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-[0_8px_30px_rgba(10,46,31,0.04)]">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-600" />

              <p className="text-sm text-gray-400">
                Loading deliveries...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && deliveries.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                <span className="text-xl">📦</span>
              </div>

              <h3 className="font-semibold text-gray-700">
                No deliveries yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
                Create your first delivery to start tracking
                your shipments here.
              </p>

              <button
                onClick={() => navigate('/sender/create')}
                className="mt-5 rounded-xl bg-[#0a2e1f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 cursor-pointer"
              >
                Create your first delivery →
              </button>

            </div>
          )}

          {/* Delivery list */}
          {!loading && deliveries.length > 0 && (
            <div className="space-y-3">

              {deliveries.map(d => {
                const s =
                  STATUS_STYLES[d.status] ||
                  STATUS_STYLES.CREATED

                const p =
                  PAYMENT_STYLES[d.payment_status] ||
                  PAYMENT_STYLES.PENDING

                return (
                  <article
                    key={d.id}
                    className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(10,46,31,0.04)] transition hover:border-emerald-200"
                  >

                    {/* Top row */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                          <h3 className="truncate text-sm font-bold text-gray-800">
                            {d.item_description}
                          </h3>
                        </div>

                        <div className="mt-2 space-y-1 text-xs text-gray-400">

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

                      <span
                        className={[
                          'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
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

                    {/* Bottom information */}
                    <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-6">

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Delivery fee
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-emerald-700">
                            ₦{Number(d.fee_naira).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Payment
                          </p>

                          <span
                            className={[
                              'mt-1 inline-block rounded-lg px-2 py-1 text-[11px] font-semibold',
                              p.bg,
                              p.text,
                            ].join(' ')}
                          >
                            {p.label}
                          </span>
                        </div>

                      </div>

                      {d.blockchain_tx_ids &&
                        d.blockchain_tx_ids.created && (
                          <a
                            href={
                              'https://sepolia.etherscan.io/tx/' +
                              d.blockchain_tx_ids.created
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-blue-500 underline underline-offset-2 hover:text-blue-600"
                          >
                            View blockchain record →
                          </a>
                        )}

                    </div>

                    {/* Actions */}
                    {(d.status === 'PICKED_UP' ||
                      d.ipfs_hash) && (
                        <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">

                          {d.status === 'PICKED_UP' && (
                            <button
                              onClick={() => raiseDispute(d)}
                              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 cursor-pointer"
                            >
                              Raise dispute
                            </button>
                          )}

                          {d.ipfs_hash && (
                            <a
                              href={
                                'https://gateway.pinata.cloud/ipfs/' +
                                d.ipfs_hash
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-center text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                            >
                              View proof of delivery
                            </a>
                          )}

                        </div>
                      )}

                  </article>
                )
              })}

            </div>
          )}

        </section>

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

export default SenderDashboard