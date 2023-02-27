export default function ogImageURL({ title, subtitle }) {
	return `https://larocque.dev/.netlify/functions/og-image?title=${encodeURIComponent(
		title
	)}&subtitle=${encodeURIComponent(subtitle)}`;
}
