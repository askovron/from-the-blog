"use client";
import { useRouter, useSearchParams } from "next/navigation";

export const SearchPosts = () => {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const currentSearchValue = searchParams.get("search")?.toString();

  return (
    <form
      className="flex mb-16 relative"
      onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          search: { value: string };
        };
        const nextSearchValue = target.search.value;
        const url = new URL(window.location.origin + window.location.pathname);

        for (const [key, value] of searchParams.entries()) {
          url.searchParams.append(key, value);
        }

        url.searchParams.delete("from");
        if (nextSearchValue?.length > 0) {
          url.searchParams.set("search", nextSearchValue);
        } else {
          url.searchParams.delete("search");
        }

        router.push(url.toString());
      }}
    >
      <input
        className="px-2 rounded-l border dark:border-slate-300 dark:bg-slate-400 dark:text-slate-900"
        type="text"
        name="search"
        minLength={3}
        defaultValue={currentSearchValue}
      />
      <button className="button !rounded-none !rounded-r" type="submit">
        Search
      </button>
    </form>
  );
};
