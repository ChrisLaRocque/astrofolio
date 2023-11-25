export function sortByUpdatedAt(collection) {
  return collection.sort(function (a, b) {
    return new Date(b.data.updatedAt) - new Date(a.data.updatedAt);
  });
}
export function relatedProjects(allTech, allProjects) {
  allTech.forEach((tech) => {
    let relatedProjectCount = 0;
    for (let i = 0; i < allProjects.length; i++) {
      if (allProjects[i]?.data.tech.includes(tech.slug)) {
        relatedProjectCount += 1;
      }
    }
    return (tech.relatedProjectCount = relatedProjectCount);
  });
}
