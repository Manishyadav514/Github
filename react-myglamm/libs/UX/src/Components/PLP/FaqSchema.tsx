import React from "react";

import qaToJson from "@libUtils/faqJsonFormat";

export interface FaqSchema {
  data?: any;
  type?: string;
}

function FaqSchema(props: FaqSchema) {
  let data = props.data;
  if (props.type !== "seoFaq") {
    data = qaToJson(data);
  }
  const schema: any = {
    "@context": "https://schema.org/",
    "@type": "FAQPage",
    mainEntity: [],
  };

  data?.map((items: any, key: number) => {
    schema["mainEntity"].push({
      "@type": "Question",
      name: items.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: items.answer,
      },
    });
  });

  if (data?.length > 0) {
    return (
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </section>
    );
  }

  return null;
}

export default FaqSchema;
