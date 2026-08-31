import { redirect } from 'next/navigation';

/**
 * Superseded by /dashboard/users, which is what the sidebar's "Team" link
 * points at and now renders live members plus the access matrix. Kept as a
 * redirect so any existing bookmark still lands somewhere useful.
 */
export default function TeamPageRedirect() {
  redirect('/dashboard/users');
}
