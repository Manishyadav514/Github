export const getCategoryDetails = (categories: any, relationalData: any) => {
  try {
    const child = categories.filter((category: any) => category.type === "child");
    const subChild = categories.filter((category: any) => category.type === "subChild");
    const ddlChildCategory = relationalData?.categories[child[0]?.id]?.cms[0]?.content?.name;
    const ddlSubChildCategory = relationalData?.categories[subChild[0]?.id]?.cms[0]?.content?.name;
    return {
      child,
      subChild,
      ddlChildCategory,
      ddlSubChildCategory,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const isShadeUIv2 = (productTag: string, data: any) => {
  const shadeUIData = data?.find((x: any) => x?.tags?.includes(productTag))?.data;
  return shadeUIData;
};
