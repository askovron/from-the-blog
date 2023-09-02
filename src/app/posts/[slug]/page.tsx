import fs from "fs/promises";
import { TCategory, TPost } from "@/types/all";
import Image from "next/image";
import Link from "next/link";

type TErrNotFound = { error: string };
type TDetailedPost = Omit<TPost, "categories"> & {
  categories: TCategory[];
};
type TPostResponse = TDetailedPost | TErrNotFound;

const getPost = async (slug: string): Promise<TPostResponse> => {
  const postId = parseInt(slug.split("-").slice(-1)[0], 10);

  if (Number.isNaN(postId)) {
    throw new Error("Incorrect post id provided.");
  }

  try {
    const fileContents = await fs.readFile(
      process.cwd() + "/blog.json",
      "utf8"
    );

    const { posts, categories }: { posts: TPost[]; categories: TCategory[] } =
      JSON.parse(fileContents);
    const targetPost = posts.find(({ id }) => id === postId);

    if (targetPost) {
      return {
        ...targetPost,
        categories: targetPost.categories.map((categoryId) =>
          categories.find(({ id }) => id === categoryId)
        ),
      } as TDetailedPost;
    }

    return { error: "Post not found" } as TErrNotFound;
  } catch (e) {
    throw new Error("Error during reading file.");
  }
};

export default async function Page({ params }: { params: { slug: string } }) {
  const postOrError = await getPost(params.slug);

  if ((postOrError as TErrNotFound).error) return <p>Post not found.</p>;

  const { imageUrl, title, categories, excerpt } = postOrError as TDetailedPost;

  return (
    <div className="my-auto flex flex-col border dark:border-none bg-white dark:bg-slate-900 w-[300px] p-7 mx-5 rounded-lg shadow-xl subpixel-antialiased">
      <div className="h-[190px] w-full relative">
        <Image src={imageUrl} alt={title} fill />
      </div>
      <div className="pt-3 text-sm">
        <div className="mb-2">
          {categories.map(({ id, name }) => (
            <Link
              key={id}
              className="py-0.5 px-1 text-xs mr-1 rounded text-white dark:text-zinc-200 bg-purple-400 hover:bg-purple-500 dark:bg-purple-800 dark:hover:bg-purple-700 [text-shadow:_0_1px_0_#0005]"
              href={{
                pathname: "/",
                query: { category: id },
              }}
            >
              {name}
            </Link>
          ))}
        </div>
        <h2 className="flex mb-2 text-black dark:text-slate-300 text-base font-bold">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-slate-400">{excerpt}</p>
      </div>
    </div>
  );
}
