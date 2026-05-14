import React from 'react'

interface NavLink {
  label: string
  href: string
  external?: boolean
}
interface NavColumn {
  title: string
  links: NavLink[]
}

const NAV_COLUMNS: NavColumn[] = [
  {
    title: 'Resources',
    links: [
      { label: 'Insights', href: '/#insights' },
      { label: 'Documentation', href: 'https://docs.credio.network/docs/category/octopos', external: true },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Analytics', href: '/#analytics' },
      { label: 'Oracles', href: '/#oracles' },
      { label: 'Strategy Adapters', href: '/#solutions' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Twitter / X', href: 'https://twitter.com/untangledfi', external: true },
      { label: 'Discord', href: 'https://discord.com/invite/neucRJEWHe', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: 'https://untangled.finance/', external: true },
      { label: 'Privacy Policy', href: 'https://www.untangled.finance/privacy', external: true },
      { label: 'Terms of Service', href: 'https://www.untangled.finance/terms', external: true },
    ],
  },
]

function FooterColumn({ col }: { col: NavColumn }) {
  return (
    <div>
      <h4
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13.5px',
          fontWeight: 500,
          color: '#dedad4',
          margin: '0 0 20px',
        }}
      >
        {col.title}
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {col.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13.5px',
                fontWeight: 400,
                color: '#5e5c58',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#a09d98')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#5e5c58')}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      style={{
        background: '#050c18',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}
    >
      <div
        className="footer-inner"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '40px 56px 0',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Logo column */}
        <div
          className="footer-logo"
          style={{ flex: '0 0 22%', paddingTop: '3px' }}
        >
          <a href="/" aria-label="Credio" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            {(() => {
              const h = 48
              const fullW = Math.round(h * 1426 / 454)  // ≈151px — full wordmark
              const iconW = Math.round(h * 454 / 454)   // ≈48px — icon portion (square)
              return (
                <div style={{
                  width: iconW,
                  height: h,
                  backgroundImage: 'url(/images/credio-logo.png)',
                  backgroundSize: `${fullW}px ${h}px`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 0',
                  flexShrink: 0,
                  opacity: 0.9,
                }} />
              )
            })()}
          </a>
        </div>

        {/* Nav grid */}
        <div
          className="footer-nav"
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {NAV_COLUMNS.map((col) => (
            <FooterColumn key={col.title} col={col} />
          ))}
        </div>
      </div>

      {/* CREDIO watermark */}
      <div className="watermark-wrap">
        <span className="watermark-text">CREDIO</span>
        <div className="watermark-fade" />
      </div>
    </footer>
  )
}
