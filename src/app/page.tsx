import fs from "fs/promises";
import Link from "next/link";
import { SearchPosts } from "@/components/search";
import { TResponseData, TPost } from "@/types/all";
import { PostList } from "@/components/posts";

type TInputParams = {
  search?: string;
  category?: string;
  from?: string;
  to?: string;
};

const PAGE_SIZE = 3;

async function filterByCategory(posts: TPost[], categoryId?: number) {
  if (typeof categoryId === "number" && !Number.isNaN(categoryId)) {
    return posts.filter(({ categories }) => categories.includes(categoryId));
  }

  return posts;
}

async function filterByName(posts: TPost[], filterStr?: string) {
  if (!filterStr) return posts;

  return posts.filter(
    ({ title, excerpt }) =>
      title.includes(filterStr) || excerpt.includes(filterStr)
  );
}

async function getPostsCategories(input: TInputParams): Promise<TResponseData> {
  const from = input.from ? parseInt(input.from, 10) : 0;
  const category = input.category ? parseInt(input.category, 10) : undefined;

  try {
    const fileContents = await fs.readFile(
      process.cwd() + "/blog.json",
      "utf8"
    );

    const { posts: rawPosts, categories } = JSON.parse(fileContents);

    const posts = await filterByCategory(rawPosts, category).then((posts) =>
      filterByName(posts, input.search)
    );
    const hasNext = posts.length - (from + PAGE_SIZE) > 0;
    const hasPrev = from > 0;

    return {
      categories,
      posts: posts.slice(from, from + PAGE_SIZE),
      hasNext,
      hasPrev,
    };
  } catch (e) {
    throw new Error("Error during reading file.");
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { posts, categories, hasNext, hasPrev } = await getPostsCategories(
    searchParams
  );
  const prevOffset =
    parseInt((searchParams.from as string) ?? PAGE_SIZE, 10) - PAGE_SIZE;
  const nextOffset =
    parseInt((searchParams.from as string) ?? 0, 10) + PAGE_SIZE;
  const categoryCssClassesDefault =
    "hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30";
  const categoryCssClassesActive =
    "bg-gray-200 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800/30";

  return (
    <>
      <div className="relative flex flex-col place-items-center after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-['']  after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 z-10">
        <SearchPosts />

        <PostList posts={posts} categories={categories} />

        <p className="flex my-5 lg:mb-0 lg:mt-4  xl:mt-12 w-full px-5">
          {hasPrev ? (
            <Link
              className="mr-auto button"
              href={{
                pathname: "/",
                query: { ...searchParams, from: prevOffset },
              }}
            >
              Prev
            </Link>
          ) : null}
          {hasNext ? (
            <Link
              className="ml-auto button"
              href={{
                pathname: "/",
                query: {
                  ...searchParams,
                  from: nextOffset,
                },
              }}
            >
              Next
            </Link>
          ) : null}
        </p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/"
          className={`group rounded-lg border border-transparent px-5 py-4 transition-colors ${
            searchParams.category == null
              ? categoryCssClassesActive
              : categoryCssClassesDefault
          }`}
        >
          <h2 className="text-2xl font-semibold whitespace-nowrap">
            All&nbsp;categories&nbsp;
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </Link>
        {categories.map(({ id, name }) => (
          <Link
            key={id}
            href={{
              pathname: "/",
              query: { category: id },
            }}
            className={`group rounded-lg border border-transparent px-5 py-4 transition-colors ${
              searchParams.category === id.toString()
                ? categoryCssClassesActive
                : categoryCssClassesDefault
            }`}
          >
            <h2 className="text-2xl font-semibold whitespace-nowrap">
              {name}&nbsp;
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </Link>
        ))}
      </div>
    </>
  );
}
