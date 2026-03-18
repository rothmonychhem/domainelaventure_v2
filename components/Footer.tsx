import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-stone-600">
        <p>© {new Date().getFullYear()} Cozy Cabin Escapes</p>
        <Link href="/login" className="hover:text-stone-900">
          Login
        </Link>
      </div>
    </footer>
  );
}