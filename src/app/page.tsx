import { PAGE_SIZE } from "./simple/route";
import Link from "next/link";
import { SearchPosts } from "@/components/search";
import { TResponseData } from "@/types/all";
import { PostList } from "@/components/posts";

type TInputParams = {
  search?: string;
  categoryId?: number;
  from?: number;
  to?: number;
};

async function getPostsCategories(input: TInputParams): Promise<TResponseData> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    params.set(key, value.toString());
  }

  const response = await fetch(
    `${process.env.HOST}/simple?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Api error.");
  }

  return response.json();
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

        <p className="flex mt-4 w-full px-5 xl:mt-16">
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
          <h2 className={`text-2xl font-semibold`}>
            All categories{" "}
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
            <h2 className={`text-2xl font-semibold`}>
              {name} {}
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
