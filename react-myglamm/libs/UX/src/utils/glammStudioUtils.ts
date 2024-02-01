import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { SLUG } from "@libConstants/Slug.constant";

export async function getGlammStudioInitialProps(ctx: any) {
  try {
    const widgetApi = new WidgetAPI();
    const { data } = await widgetApi.getWidgets({
      where: {
        slugOrId: SLUG().GLAMM_STUDIO,
      },
    });
    return { widgets: data?.data?.data.widget };
  } catch (error: any) {
    console.log({ error }, SLUG().GLAMM_STUDIO);

    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Not Found");
    }
    return {
      errorCode: 500,
    };
  }
}
