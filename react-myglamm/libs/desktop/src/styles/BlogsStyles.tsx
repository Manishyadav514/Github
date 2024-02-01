export const BlogsStyles = () => (
  <style jsx global>
    {`
      .blog-products {
        max-width: 600px;
      }
      .blog-products .blog-btn {
        width: 130px;
        padding: 7px;
      }
      .blog {
        margin: 25px auto 0;
      }
      .blog.blog-aricle {
        margin-top: 27px;
        padding-bottom: 20px;
      }
      .blog.blog-aricle .blog-aricle-head {
        margin-bottom: 24px;
      }
      .blog.blog-aricle .blog-aricle-head .date {
        font-size: 18px;
        color: #909090;
      }
      .blog.blog-aricle .blog-aricle-head h1 {
        font-weight: 600;
      }
      .blog.blog-aricle .box figure {
        margin-bottom: 24px;
      }
      .blog.blog-aricle .box {
        font-size: 16px;
        line-height: 26px;
        font-weight: 300;
      }
      .blog.blog-aricle .box p {
        font-size: 16px;
        line-height: 26px;
        font-weight: 300;
        margin-bottom: 30px;
      }
      .blog.blog-aricle .box p .firstcharacter {
        font-weight: 600;
        float: left;
        font-size: 56px;
        padding-top: 0;
      }
      .blog.blog-aricle .box ul,
      .blog.blog-aricle .box ol {
        padding-left: 15px;
      }
      .blog.blog-aricle .box ul li {
        margin-bottom: 12px;
      }
      .blog.blog-aricle .box ul > ol,
      .blog.blog-aricle .box ul > ul,
      .blog.blog-aricle .box ol > ol,
      .blog.blog-aricle .box ol > ol {
        padding-left: 15px;
        margin-top: 12px;
      }
      .blog.blog-aricle .box img {
        margin-bottom: 15px;
      }

      .blog.blog-aricle .blog-left .box {
        width: 100%;
      }
      .blog.blog-aricle .blog-left iframe {
        width: 100% !important;
        height: 415px !important;
      }
    `}
  </style>
);
