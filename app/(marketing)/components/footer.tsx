import Link from 'next/link'
import { Wallet } from 'lucide-react'

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Product tour', href: '#product' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy policy', href: '#' },
      { label: 'Terms of service', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0c12] px-6 pt-16 pb-8">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <span className="font-semibold tracking-tight text-white">Xpense</span>
            </div>
            <p className="text-sm text-(--sidebar-text) max-w-xs">
              Track what comes in, what goes out, and everything in between.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-medium text-(--sidebar-text) mb-4 tracking-wide uppercase">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-(--sidebar-text) hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-(--sidebar-text)">
            © {new Date().getFullYear()} Xpense. All rights reserved.
          </p>
          <p className="text-xs text-(--sidebar-text)">
            Built with Next.js · PostgreSQL · Prisma
          </p>
        </div>
      </div>
    </footer>
  )
}