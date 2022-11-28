import sharp from "sharp";
import crypto from "crypto";

// import { PrismaClient } from "@prisma/client";
import { uploadFile, getFile, deleteFile } from "./s3.js";



const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export async function getPosts() {
  // const posts = ["love", ];
  // const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  // for (let post of posts) {
  //   post.imageUrl = await getObjectSignedUrl(post.imageName)
  // }
  // const posts = await getObjectSignedUrl("4be3be8f3d45d41d4c80a20998c9f2fd57d51ba9782a894718ae07ca22eb7c51");
  const posts = await getFile("4be3be8f3d45d41d4c80a20998c9f2fd57d51ba9782a894718ae07ca22eb7c51")
  console.log( "Get post succesfull.", posts)
  return posts;
}

export async function createPost(file, caption) {
  const imageName = generateFileName();
  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer();

  await uploadFile(fileBuffer, imageName, file.mimetype);

  // const post = await prisma.posts.create({
  //   data: {
  //     imageName,
  //     caption,
  //   }
  // })
  const post = { imageName: imageName, caption: caption };
  return post;
}

export async function deletePost(id) {
  const post = await prisma.posts.findUnique({ where: { id } });

  await deleteFile(post.imageName);

  await prisma.posts.delete({ where: { id: post.id } });

  return post;
}
