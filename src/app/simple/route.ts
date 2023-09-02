import fs from "fs/promises";
import { NextResponse } from "next/server";
import { TPost, TResponseData } from "@/types/all";

export const PAGE_SIZE = 3;

async function filterByCategory(posts: TPost[], categoryId: number) {
  if (typeof categoryId === "number" && !Number.isNaN(categoryId)) {
    return posts.filter(({ categories }) => categories.includes(categoryId));
  }

  return posts;
}

async function filterByName(posts: TPost[], filterStr: string | null) {
  if (!filterStr) return posts;

  return posts.filter(
    ({ title, excerpt }) =>
      title.includes(filterStr) || excerpt.includes(filterStr)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const from = parseInt((searchParams.get("from") as string) ?? 0, 10);
  const category = parseInt(searchParams.get("category") as string, 10);

  try {
    const fileContents = await fs.readFile(
      process.cwd() + "/blog.json",
      "utf8"
    );

    const { posts: rawPosts, categories } = JSON.parse(fileContents);

    const posts = await filterByCategory(rawPosts, category).then((posts) =>
      filterByName(posts, search)
    );
    const hasNext = posts.length - (from + PAGE_SIZE) > 0;
    const hasPrev = from > 0;

    return NextResponse.json<TResponseData>({
      categories,
      posts: posts.slice(from, from + PAGE_SIZE),
      hasNext,
      hasPrev,
    });
  } catch (e) {
    return NextResponse.json({ error: "Error during reading file." });
  }
}
