export function slugify(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD') // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .replace(/đ/g, 'd') // replace vietnamese d
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric chars (keep spaces and hyphens)
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}
