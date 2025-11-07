import type { CollectionEntry } from 'astro:content';

export function sortByUpdatedAt(collection: CollectionEntry<'projects'>[]) {
  return collection.sort(function (a, b) {
    return (
      new Date(b.data.updatedAt).getTime() -
      new Date(a.data.updatedAt).getTime()
    );
  });
}

export function relatedProjects(
  allTech: CollectionEntry<'tech'>[],
  allProjects: CollectionEntry<'projects'>[]
): Array<CollectionEntry<'tech'> & { relatedProjectCount: number }> {
  type ProjectTech = CollectionEntry<'projects'>['data']['tech'][number];

  return allTech.map((tech) => {
    const techSlug = tech.slug as ProjectTech;

    const relatedProjectCount = allProjects.reduce((count, project) => {
      return project.data.tech.includes(techSlug) ? count + 1 : count;
    }, 0);

    return { ...tech, relatedProjectCount };
  });
}
