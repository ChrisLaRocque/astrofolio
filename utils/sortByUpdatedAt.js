export default function sortByUpdatedAt(collection) {
	return collection.sort(function (a, b) {
		return new Date(b.data.updatedAt) - new Date(a.data.updatedAt);
	});
}
