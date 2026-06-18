export default function BuildFooter() {
  return (
    <footer className="build-footer" aria-label="Build info">
      {__BUILD_ENV__} · {__BUILD_VERSION__}
    </footer>
  );
}
