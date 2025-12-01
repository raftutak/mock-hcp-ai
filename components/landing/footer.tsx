export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#e5f1ff] via-gray-50 to-[#fff6ef] border-t border-gray-200 py-10 text-sm text-gray-900">
      <div className="max-w-[1180px] mx-auto px-6 flex items-start justify-between gap-12 flex-col md:flex-row">
        {/* Footer left */}
        <div className="max-w-[320px]">
          <div className="flex items-center gap-3 mb-4">
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-md border border-gray-400 flex items-center justify-center text-sm no-underline text-gray-900 hover:bg-black/5"
              aria-label="LinkedIn"
            >
              in
            </a>
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-md border border-gray-400 flex items-center justify-center text-sm no-underline text-gray-900 hover:bg-black/5"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-md border border-gray-400 flex items-center justify-center text-sm no-underline text-gray-900 hover:bg-black/5"
              aria-label="X"
            >
              X
            </a>
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-md border border-gray-400 flex items-center justify-center text-sm no-underline text-gray-900 hover:bg-black/5"
              aria-label="YouTube"
            >
              ▶
            </a>
          </div>
          <p className="text-gray-900">© 2025 F. Hoffmann-La Roche Ltd 26.08.2025</p>
        </div>

        {/* Footer right */}
        <div className="flex-1 max-w-[600px]">
          <nav className="flex flex-wrap gap-6 mb-3 font-medium">
            <a href="#" className="no-underline text-gray-600 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="no-underline text-gray-600 hover:text-gray-900">
              Terms &amp; Conditions
            </a>
            <a href="#" className="no-underline text-gray-600 hover:text-gray-900">
              Contact
            </a>
            <a href="#" className="no-underline text-gray-600 hover:text-gray-900">
              Cookie policy
            </a>
          </nav>
          <p className="text-gray-600 max-w-[560px] leading-relaxed">
            This website contains information on products intended for
            healthcare professionals and may include details that are not
            accessible or appropriate in every country. By continuing, you are
            responsible for ensuring that use of this information complies with
            the laws and regulations of your country of residence.
          </p>
        </div>
      </div>
    </footer>
  );
}
