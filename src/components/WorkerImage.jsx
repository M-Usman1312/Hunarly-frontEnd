import { useEffect, useState } from "react";

function createFallback(name) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase().replace(/[^A-Z0-9]/g, ""))
    .join("") || "H";
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" rx="40" fill="#e5f5f1"/><circle cx="120" cy="90" r="43" fill="#72b9a9"/><path d="M37 226c8-47 38-72 83-72s75 25 83 72" fill="#101d35"/><text x="120" y="221" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(image)}`;
}

function WorkerImage({ name, src, alt, ...imageProps }) {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  return (
    <img
      {...imageProps}
      src={hasError ? createFallback(name) : src}
      alt={alt ?? name}
      onError={() => setHasError(true)}
    />
  );
}

export default WorkerImage;
