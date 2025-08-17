'use client';

import { redirect, usePathname } from 'next/navigation';

export default function GlobalNotFound() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  redirect(`/${locale}/not-found`);
}
