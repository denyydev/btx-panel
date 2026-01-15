import { NextResponse } from "next/server";

const UPSTREAM =
  process.env.NEXT_PUBLIC_API_URL || "https://test-api.live-server.xyz";

const mapSort = (sort?: string) => {
  if (!sort) return {};
  const [fieldRaw, dirRaw] = sort.split(":");
  const order = dirRaw === "desc" ? "desc" : "asc";
  const field = (fieldRaw || "").trim();

  if (field === "name") return { sortBy: "firstName", order };
  if (field === "email") return { sortBy: "email", order };
  if (field === "birthDate") return { sortBy: "birthDate", order };
  if (field === "role") return { sortBy: "role", order };
  if (field === "firstName") return { sortBy: "firstName", order };
  if (field === "lastName") return { sortBy: "lastName", order };

  return {};
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") ?? "10");
  const skip = Number(searchParams.get("skip") ?? "0");
  const search = (searchParams.get("search") ?? "").trim();
  const sort = searchParams.get("sort") ?? "";

  const upstreamLimit = 200;

  const qs = new URLSearchParams();
  qs.set("limit", String(upstreamLimit));
  qs.set("skip", "0");

  const { sortBy, order } = mapSort(sort);
  if (sortBy) qs.set("sortBy", sortBy);
  if (order) qs.set("order", order);

  const url = search
    ? `${UPSTREAM}/users/search?q=${encodeURIComponent(
        search
      )}&${qs.toString()}`
    : `${UPSTREAM}/users?${qs.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    return NextResponse.json(
      { message: "Upstream users failed" },
      { status: 502 }
    );
  }

  const json = (await res.json()) as { users: any[] };

  const admins = (json.users || []).filter((u) => u?.role === "admin");
  const total = admins.length;
  const page = admins.slice(skip, skip + limit);

  return NextResponse.json({
    users: page,
    total,
    skip,
    limit,
  });
}
