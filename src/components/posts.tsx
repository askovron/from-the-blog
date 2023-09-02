import { FC } from "react";
import { TCategory, TPost } from "@/types/all";
import Link from "next/link";
import Image from "next/image";

export const PostList: FC<{ posts: TPost[]; categories: TCategory[] }> = ({
  posts,
  categories,
}) => {
  if (posts.length === 0) {
    return (
      <div className="flex">
        <p className="font-xl font-bold underline underline-offset-8">No results.</p>
      </div>
    );
  }

  return (
    <div className="flex">
      {posts.map(
        ({ id, title, imageUrl, excerpt, slug, categories: categoryIds }) => (
          <Link
            key={id}
            className="flex flex-col border dark:border-none bg-white dark:bg-slate-900 w-[250px] mx-5 rounded shadow-xl hover:translate-y-[-4px] transition-transform translate-z-360 subpixel-antialiased overflow-hidden"
            href={`/posts/${slug}-${id}`}
          >
            <div className="h-[190px] w-full relative">
              <Image src={imageUrl} alt={title} fill />
            </div>
            <div className="p-3 text-sm">
              <div className="mb-2">
                {categoryIds.map((categoryId) => (
                  <span
                    key={categoryId}
                    className="py-0.5 px-1 text-xs mr-1 rounded text-white dark:text-zinc-200 bg-purple-400 dark:bg-purple-800 [text-shadow:_0_1px_0_#0005]"
                  >
                    {categories.find(({ id }) => id === categoryId)?.name}
                  </span>
                ))}
              </div>
              <h2 className="flex mb-2 text-black dark:text-slate-300 text-base font-bold">
                {title}
              </h2>
              <p className="text-gray-500 dark:text-slate-400">{excerpt}</p>
            </div>
          </Link>
        )
      )}
    </div>
  );
};
