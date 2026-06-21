import { getCurrentUser, type CurrentUser } from "@/lib/posts";
import { supabase } from "@/lib/supabase";

export const COMMENT_REACTIONS = ["👍", "❤️", "👀", "🙌"] as const;
export type CommentReaction = (typeof COMMENT_REACTIONS)[number];

export type QaAuthor = {
  name: string;
  department: string;
} | null;

export type QaQuestion = {
  id: string;
  author_id: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  author: QaAuthor;
  comment_count: number;
};

export type QaComment = {
  id: string;
  question_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author: QaAuthor;
  reactions: Record<CommentReaction, number>;
  myReactions: CommentReaction[];
};

export type MyQaComment = Omit<QaComment, "author" | "reactions" | "myReactions"> & {
  question: {
    id: string;
    title: string;
  } | null;
};

type QuestionRow = Omit<QaQuestion, "author" | "comment_count">;
type CommentRow = Omit<QaComment, "author" | "reactions" | "myReactions">;
type ProfileRow = { id: string; name: string; department: string };
type ReactionRow = { comment_id: string; user_id: string; emoji: CommentReaction };

async function getProfiles(authorIds: string[]) {
  if (!supabase || authorIds.length === 0) return new Map<string, ProfileRow>();

  const uniqueAuthorIds = Array.from(new Set(authorIds));
  const { data: publicProfiles, error } = await supabase
    .from("public_profiles")
    .select("id, name, department")
    .in("id", uniqueAuthorIds);
  const data =
    publicProfiles ??
    (error
      ? (
          await supabase
            .from("profiles")
            .select("id, name, department")
            .in("id", uniqueAuthorIds)
        ).data
      : null);

  return new Map((data as ProfileRow[] | null)?.map((profile) => [profile.id, profile]));
}

function emptyReactions(): Record<CommentReaction, number> {
  return { "👍": 0, "❤️": 0, "👀": 0, "🙌": 0 };
}

async function uploadQaImage(userId: string, file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("qna-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  return supabase.storage.from("qna-images").getPublicUrl(path).data.publicUrl;
}

export async function getQaQuestions(): Promise<QaQuestion[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("qa_questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as QuestionRow[];
  const profiles = await getProfiles(rows.map((question) => question.author_id));
  const questionIds = rows.map((question) => question.id);

  const { data: comments } =
    questionIds.length > 0
      ? await supabase.from("qa_comments").select("question_id").in("question_id", questionIds)
      : { data: [] };

  const countMap = new Map<string, number>();
  (comments as { question_id: string }[] | null)?.forEach((comment) => {
    countMap.set(comment.question_id, (countMap.get(comment.question_id) ?? 0) + 1);
  });

  return rows.map((question) => {
    const profile = profiles.get(question.author_id);
    return {
      ...question,
      author: profile ? { name: profile.name, department: profile.department } : null,
      comment_count: countMap.get(question.id) ?? 0,
    };
  });
}

export async function getMyQaQuestions(userId: string): Promise<QaQuestion[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("qa_questions")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as QuestionRow[];
  const questionIds = rows.map((question) => question.id);

  const { data: comments } =
    questionIds.length > 0
      ? await supabase.from("qa_comments").select("question_id").in("question_id", questionIds)
      : { data: [] };

  const countMap = new Map<string, number>();
  (comments as { question_id: string }[] | null)?.forEach((comment) => {
    countMap.set(comment.question_id, (countMap.get(comment.question_id) ?? 0) + 1);
  });

  return rows.map((question) => ({
    ...question,
    author: null,
    comment_count: countMap.get(question.id) ?? 0,
  }));
}

export async function getMyQaComments(userId: string): Promise<MyQaComment[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("qa_comments")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const comments = data as CommentRow[];
  const questionIds = Array.from(new Set(comments.map((comment) => comment.question_id)));

  const { data: questions } =
    questionIds.length > 0
      ? await supabase.from("qa_questions").select("id, title").in("id", questionIds)
      : { data: [] };

  const questionMap = new Map(
    ((questions as { id: string; title: string }[] | null) ?? []).map((question) => [
      question.id,
      question,
    ]),
  );

  return comments.map((comment) => ({
    ...comment,
    question: questionMap.get(comment.question_id) ?? null,
  }));
}

export async function getQaQuestion(id: string): Promise<QaQuestion | null> {
  const questions = await getQaQuestions();
  return questions.find((question) => question.id === id) ?? null;
}

export async function createQaQuestion(values: {
  title: string;
  body: string;
  imageFile?: File | null;
}): Promise<string> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const imageUrl = values.imageFile ? await uploadQaImage(user.id, values.imageFile) : null;
  const { data, error } = await supabase
    .from("qa_questions")
    .insert({
      author_id: user.id,
      title: values.title.trim(),
      body: values.body.trim(),
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error || !data) throw error ?? new Error("질문 저장에 실패했습니다.");
  return (data as { id: string }).id;
}

export async function updateQaQuestion(
  questionId: string,
  values: {
    title: string;
    body: string;
    imageFile?: File | null;
    existingImageUrl?: string | null;
  },
): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const imageUrl = values.imageFile
    ? await uploadQaImage(user.id, values.imageFile)
    : values.existingImageUrl ?? null;

  const { error } = await supabase
    .from("qa_questions")
    .update({
      title: values.title.trim(),
      body: values.body.trim(),
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", questionId);

  if (error) throw error;
}

export async function deleteQaQuestion(questionId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const { error } = await supabase.from("qa_questions").delete().eq("id", questionId);
  if (error) throw error;
}

export async function getQaComments(questionId: string, userId?: string): Promise<QaComment[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("qa_comments")
    .select("*")
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  const comments = data as CommentRow[];
  const profiles = await getProfiles(comments.map((comment) => comment.author_id));
  const commentIds = comments.map((comment) => comment.id);

  const { data: reactions } =
    commentIds.length > 0
      ? await supabase.from("qa_comment_reactions").select("comment_id, user_id, emoji").in("comment_id", commentIds)
      : { data: [] };

  const reactionRows = (reactions as ReactionRow[] | null) ?? [];

  return comments.map((comment) => {
    const profile = profiles.get(comment.author_id);
    const counts = emptyReactions();
    const myReactions: CommentReaction[] = [];

    reactionRows
      .filter((reaction) => reaction.comment_id === comment.id)
      .forEach((reaction) => {
        counts[reaction.emoji] += 1;
        if (userId && reaction.user_id === userId) myReactions.push(reaction.emoji);
      });

    return {
      ...comment,
      author: profile ? { name: profile.name, department: profile.department } : null,
      reactions: counts,
      myReactions,
    };
  });
}

export async function createQaComment(questionId: string, body: string): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase.from("qa_comments").insert({
    question_id: questionId,
    author_id: user.id,
    body: body.trim(),
  });

  if (error) throw error;
}

export async function updateQaComment(commentId: string, body: string): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const { error } = await supabase
    .from("qa_comments")
    .update({
      body: body.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId);

  if (error) throw error;
}

export async function deleteQaComment(commentId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const { error } = await supabase.from("qa_comments").delete().eq("id", commentId);
  if (error) throw error;
}

export async function toggleQaCommentReaction(
  commentId: string,
  user: CurrentUser,
  emoji: CommentReaction,
  isActive: boolean,
): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");

  const { error } = isActive
    ? await supabase
        .from("qa_comment_reactions")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .eq("emoji", emoji)
    : await supabase.from("qa_comment_reactions").insert({
        comment_id: commentId,
        user_id: user.id,
        emoji,
      });

  if (error) throw error;
}
