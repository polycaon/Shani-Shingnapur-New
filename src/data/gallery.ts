/**
 * Photo gallery. Add only original photographs or images whose licence you
 * have confirmed. Put files in /public/images/gallery/ with descriptive
 * filenames (e.g. shani-shingnapur-temple-platform.webp).
 */
export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  credit: string;
  licence: string;
  licenceUrl?: string;
}

export const gallerySections: { id: string; title: string; description: string; images: GalleryImage[] }[] = [
  { id: "temple", title: "Temple", description: "The open-air shrine platform and temple complex.", images: [] },
  { id: "shani-dev", title: "Shani Dev", description: "Devotional art and iconography of Shani Dev.", images: [] },
  { id: "village", title: "Village", description: "Everyday life in Shani Shingnapur, including its door-frame houses.", images: [] },
  { id: "surroundings", title: "Surroundings", description: "The countryside of Nevasa taluka.", images: [] },
  { id: "festivals", title: "Festivals", description: "Shani Jayanti and Shani Amavasya at Shingnapur.", images: [] },
  { id: "pilgrimage", title: "Pilgrimage", description: "Pilgrims on the road between Shirdi and Shingnapur.", images: [] },
  { id: "nearby", title: "Nearby attractions", description: "Shirdi, Nashik, Trimbakeshwar and Ellora.", images: [] },
];

export const galleryImageCount = gallerySections.reduce((n, s) => n + s.images.length, 0);
