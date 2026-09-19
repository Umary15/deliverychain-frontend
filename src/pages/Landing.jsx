import { useNavigate } from 'react-router-dom'

function Landing() {
    const navigate = useNavigate()

    return (
        <div
            style={{
                background: '#0a2e1f',
                minHeight: '100vh',
                fontFamily: 'inherit',
                color: '#fff',
            }}
        >
            {/* NAV */}
            <nav
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 40px',
                    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
                }}
            >
                {/* LOGO */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <div
                        style={{
                            width: '34px',
                            height: '34px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                        }}
                    >
                        🔗
                    </div>

                    <span
                        style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#fff',
                            letterSpacing: '1px',
                        }}
                    >
                        DeliveryChain
                    </span>
                </div>

                {/* SIGN IN */}
                <button
                    onClick={() => navigate('/auth')}
                    style={{
                        background: 'transparent',
                        border: '0.5px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.8)',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                    }}
                >
                    Sign in
                </button>
            </nav>

            {/* HERO */}
            <main
                style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '100px 40px 120px',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1.25fr 0.75fr',
                        gap: '70px',
                        alignItems: 'center',
                    }}
                >
                    {/* LEFT SIDE */}
                    <section>
                        {/* SMALL LABEL */}
                        <div
                            style={{
                                fontSize: '13px',
                                color: '#4ade80',
                                fontWeight: '500',
                                marginBottom: '24px',
                            }}
                        >
                            Delivery coordination
                        </div>

                        {/* HEADLINE */}
                        <h1
                            style={{
                                fontSize: '52px',
                                fontWeight: '500',
                                color: '#fff',
                                lineHeight: '1.08',
                                letterSpacing: '-1.5px',
                                margin: '0 0 24px',
                                maxWidth: '620px',
                            }}
                        >
                            Move deliveries with{' '}
                            <span style={{ color: '#4ade80' }}>
                                confidence.
                            </span>
                        </h1>

                        {/* DESCRIPTION */}
                        <p
                            style={{
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.55)',
                                lineHeight: '1.7',
                                maxWidth: '560px',
                                margin: '0 0 36px',
                            }}
                        >
                            DeliveryChain gives senders and riders a clear,
                            accountable place to coordinate delivery work,
                            track progress, and keep important delivery
                            records together.
                        </p>

                        {/* BUTTONS */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <button
                                onClick={() => navigate('/auth')}
                                style={{
                                    background: '#22c55e',
                                    border: 'none',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    padding: '13px 26px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Get started →
                            </button>

                            <button
                                onClick={() => navigate('/auth')}
                                style={{
                                    background: 'transparent',
                                    border: '0.5px solid rgba(255,255,255,0.2)',
                                    color: 'rgba(255,255,255,0.8)',
                                    borderRadius: '10px',
                                    padding: '13px 24px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Create an account
                            </button>
                        </div>
                    </section>

                    {/* RIGHT SIDE */}
                    <section
                        style={{
                            borderLeft:
                                '1px solid rgba(255,255,255,0.18)',
                            paddingLeft: '34px',
                        }}
                    >
                        {/* ICON */}
                        <div
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                border:
                                    '1px solid rgba(74,222,128,0.25)',
                                background:
                                    'rgba(74,222,128,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                marginBottom: '24px',
                            }}
                        >
                            🛡️
                        </div>

                        <h2
                            style={{
                                fontSize: '24px',
                                fontWeight: '500',
                                color: '#fff',
                                margin: '0 0 14px',
                            }}
                        >
                            Built for trusted access
                        </h2>

                        <p
                            style={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.5)',
                                lineHeight: '1.7',
                                margin: '0 0 28px',
                            }}
                        >
                            Secure accounts and role-based access keep each
                            person focused on the delivery work they are
                            approved to do.
                        </p>

                        {/* SMALL FEATURES */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#4ade80',
                                    }}
                                />

                                <span
                                    style={{
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.6)',
                                    }}
                                >
                                    Senders create and track deliveries
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#4ade80',
                                    }}
                                />

                                <span
                                    style={{
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.6)',
                                    }}
                                >
                                    Riders accept and complete delivery jobs
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#4ade80',
                                    }}
                                />

                                <span
                                    style={{
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.6)',
                                    }}
                                >
                                    Delivery events remain verifiable
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* SOFT FOOTER */}
            <footer
                style={{
                    borderTop: '0.5px solid rgba(255,255,255,0.08)',
                    padding: '18px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}
            >
                <div
                    style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#4ade80',
                    }}
                />

                <span
                    style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.35)',
                    }}
                >
                    Delivery records can be verified through a secure blockchain record.
                </span>
            </footer>
        </div>
    )
}

export default Landing