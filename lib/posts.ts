import { supabase } from "@/lib/supabase";

export type PostSort = "newest" | "popular";

export type BoardPost = {
  id: string;
  author_id: string;
  title: string;
  description: string;
  app_url: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  like_count: number;
  author: {
    name: string;
    department: string;
  } | null;
};

export type PostFormValues = {
  title: string;
  description: string;
  appUrl: string;
  imageFile?: File | null;
  existingImageUrl?: string | null;
};

export type CurrentUser = {
  id: string;
  isAdmin: boolean;
};

type PostRow = Omit<BoardPost, "author" | "like_count"> & {
  like_count: number | string;
};

type ProfileRow = {
  id: string;
  name: string;
  department: string;
};

async function attachAuthors(posts: PostRow[]): Promise<BoardPost[]> {
  if (!supabase || posts.length === 0) return posts.map(toBoardPost);

  const authorIds = Array.from(new Set(posts.map((post) => post.author_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, department")
    .in("id", authorIds);

  const profileMap = new Map((profiles as ProfileRow[] | null)?.map((profile) => [profile.id, profile]));

  return posts.map((post) => {
    const profile = profileMap.get(post.author_id);
    return {
      ...toBoardPost(post),
      author: profile ? { name: profile.name, department: profile.department } : null,
    };
  });
}

function toBoardPost(post: PostRow): BoardPost {
  return {
    ...post,
    like_count: Number(post.like_count),
    author: null,
  };
}

export async function getBoardPosts(sort: PostSort): Promise<BoardPost[]> {
  if (!supabase) return [];

  const query = supabase.from("posts_with_likes").select("*");
  const { data, error } =
    sort === "popular"
      ? await query.order("like_count", { ascending: false }).order("created_at", { ascending: false })
      : await query.order("created_at", { ascending: false });

  if (error || !data) return [];

  return attachAuthors(data as PostRow[]);
}

export async function getMyBoardPosts(userId: string): Promise<BoardPost[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts_with_likes")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return attachAuthors(data as PostRow[]);
}

export async function getBoardPost(id: string): Promise<BoardPost | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from("posts_with_likes").select("*").eq("id", id).single();

  if (error || !data) return null;

  const [post] = await attachAuthors([data as PostRow]);
  return post ?? null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .single();

  return {
    id: data.user.id,
    isAdmin: Boolean((profile as { is_admin?: boolean } | null)?.is_admin),
  };
}

async function uploadPostImage(userId: string, file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const safeName = `${crypto.randomUUID()}.${extension}`;
  const path = `${userId}/${safeName}`;

  const { error } = await supabase.storage.from("post-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

function normalizeAppUrl(appUrl: string) {
  const value = appUrl.trim();
  if (!value) return value;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export async function createBoardPost(values: PostFormValues): Promise<string> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const imageUrl = values.imageFile ? await uploadPostImage(user.id, values.imageFile) : null;
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: values.title.trim(),
      description: values.description.trim(),
      app_url: normalizeAppUrl(values.appUrl),
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error || !data) throw error ?? new Error("게시글 저장에 실패했습니다.");

  return (data as { id: string }).id;
}

export async function updateBoardPost(postId: string, values: PostFormValues): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const imageUrl = values.imageFile
    ? await uploadPostImage(user.id, values.imageFile)
    : values.existingImageUrl ?? null;

  const { error } = await supabase
    .from("posts")
    .update({
      title: values.title.trim(),
      description: values.description.trim(),
      app_url: normalizeAppUrl(values.appUrl),
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) throw error;
}

export async function deleteBoardPost(postId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
}

export async function getLikeState(postId: string, userId: string): Promise<boolean> {
  if (!supabase) return false;

  const { data } = await supabase
    .from("likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
}

export async function togglePostLike(postId: string, userId: string, isLiked: boolean): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const { error } = isLiked
    ? await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", userId)
    : await supabase.from("likes").insert({ post_id: postId, user_id: userId });

  if (error) throw error;
}
