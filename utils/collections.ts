import type { CollectionEntry, z } from 'astro:content';
import type { techItem } from '../src/content/config';

export function sortByUpdatedAt(collection: CollectionEntry<'projects'>[]) {
  return collection.sort(function (a, b) {
    return (
      new Date(b.data.updatedAt).getTime() -
      new Date(a.data.updatedAt).getTime()
    );
  });
}

export function relatedProjects(
  allTech: (CollectionEntry<'tech'> & { relatedProjectCount: number })[],
  allProjects: CollectionEntry<'projects'>[]
) {
  allTech.forEach((tech) => {
    let relatedProjectCount = 0;
    for (let i = 0; i < allProjects.length; i++) {
      if (
        allProjects[i]?.data.tech.includes(
          tech.slug as z.infer<typeof techItem>
        )
      ) {
        relatedProjectCount += 1;
      }
    }
    return (tech.relatedProjectCount = relatedProjectCount);
  });
}
