const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://heal-away-stays.onrender.com";

export default function Image({ src, ...rest }) {
  if (!src) return null;

  const fullSrc = src.includes("http") ? src : `${BASE_URL}/uploads/${src}`;

  return <img {...rest} src={fullSrc} alt="" />;
}
