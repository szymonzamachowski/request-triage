const REPO = "https://github.com/szymonzamachowski/request-triage";
const LINKEDIN = "https://www.linkedin.com/in/szymon-zamachowski";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-neutral-500 sm:px-6">
        <p>
          Built by <span className="font-medium text-neutral-800">Szymon Zamachowski</span>
        </p>
        <nav aria-label="Author links" className="flex gap-4">
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">
            GitHub repo
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
