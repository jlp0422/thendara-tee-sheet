'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flag, CalendarDays, User } from 'lucide-react';

const tabs = [
  { href: '/tee-sheet', label: 'Tee Sheet', Icon: Flag },
  { href: '/my-times', label: 'My Times', Icon: CalendarDays },
  { href: '/profile', label: 'Profile', Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="bg-white border-t border-stone-200 flex shrink-0"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center pt-3 pb-1 gap-1 text-xs font-medium transition-colors ${
              active ? 'text-forest-900' : 'text-stone-400'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
