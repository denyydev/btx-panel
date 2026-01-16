// app/api/users/metrics/route.ts
import { NextResponse } from "next/server";

const UPSTREAM =
  process.env.NEXT_PUBLIC_API_URL || "https://test-api.live-server.xyz";

type UpUsersResponse = {
  users: any[];
  total: number;
  skip: number;
  limit: number;
};

type UpPostsByUserResponse = {
  posts: { id: number; reactions?: { likes?: number } }[];
  total: number;
  skip: number;
  limit: number;
};

type UpPostCommentsResponse = {
  comments: any[];
  total: number;
  skip: number;
  limit: number;
};

const toNum = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;

async function mapLimit<T, R>(
  arr: T[],
  limit: number,
  fn: (item: T) => Promise<R>
) {
  const ret: R[] = [];
  let i = 0;

  const workers = new Array(Math.min(limit, arr.length))
    .fill(0)
    .map(async () => {
      while (i < arr.length) {
        const idx = i++;
        ret[idx] = await fn(arr[idx]);
      }
    });

  await Promise.all(workers);
  return ret;
}

const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .trim();

const matchesName = (u: any, search: string) => {
  const q = norm(search);
  if (!q) return true;
  const full = `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.toLowerCase();
  return full.includes(q);
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") ?? "10");
  const skip = Number(searchParams.get("skip") ?? "0");
  const search = (searchParams.get("search") ?? "").trim();

  const upstreamLimit = 200;

  const usersRes = await fetch(
    `${UPSTREAM}/users?limit=${upstreamLimit}&skip=0`,
    {
      cache: "no-store",
    }
  );

  if (!usersRes.ok) {
    return NextResponse.json(
      { message: "Upstream users failed" },
      { status: 502 }
    );
  }

  const usersJson = (await usersRes.json()) as UpUsersResponse;

  const filtered = (usersJson.users || []).filter((u) =>
    matchesName(u, search)
  );

  const total = filtered.length;
  const pageUsers = filtered.slice(skip, skip + limit);

  const enriched = await mapLimit(pageUsers, 6, async (u) => {
    const userId = u.id;

    const postsRes = await fetch(
      `${UPSTREAM}/posts/user/${encodeURIComponent(
        String(userId)
      )}?limit=0&select=id,reactions`,
      { cache: "no-store" }
    );

    const postsJson: UpPostsByUserResponse = postsRes.ok
      ? await postsRes.json()
      : { posts: [], total: 0, skip: 0, limit: 0 };

    const postCount = toNum(postsJson.total);
    const likeCount = postsJson.posts.reduce(
      (acc, p) => acc + toNum(p.reactions?.likes),
      0
    );

    const commentTotals = await mapLimit(postsJson.posts, 8, async (p) => {
      const cRes = await fetch(`${UPSTREAM}/posts/${p.id}/comments`, {
        cache: "no-store",
      });
      if (!cRes.ok) return 0;
      const cJson = (await cRes.json()) as UpPostCommentsResponse;
      return toNum(cJson.total);
    });

    const commentCount = commentTotals.reduce((a, b) => a + b, 0);

    return { ...u, postCount, likeCount, commentCount };
  });

  return NextResponse.json({
    users: enriched,
    total,
    skip,
    limit,
  });
}
