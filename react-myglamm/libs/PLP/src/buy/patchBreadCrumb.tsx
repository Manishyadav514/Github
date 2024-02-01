export const patchBreadCrumb = (categorySlug: string, catName: string) => {
  const slugs = categorySlug.split("/");

  const navData: { slug: string; name: string }[] = [];
  const catSlugs = slugs.slice(2, slugs.length - 1);

  if (slugs.length > 3) {
    catSlugs.forEach((slug, index) => {
      navData.push({ slug: index ? `${navData[index - 1].slug}/${slug}` : `/buy/${slug}`, name: slug.replace("-", " ") });
    });
  }

  navData.push({ name: catName, slug: "" });

  return navData;
};
