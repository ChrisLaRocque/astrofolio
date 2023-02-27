export default function ogImageURL({ title, subtitle, origin }) {
	return `${origin}/.netlify/functions/og-image?title=${encodeURIComponent(
		title
	)}&subtitle=${encodeURIComponent(subtitle)}`;
}
