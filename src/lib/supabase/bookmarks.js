import { supabase } from "./client";

export const getBookmarks = async () => {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
};

export const addBookmark = async (title, url) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      data: null,
      error: userError || new Error("No authenticated user"),
    };
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert([{ title, url, user_id: userData.user.id }])
    .select();
  return { data, error };
};

export const updateBookmark = async (id, title, url) => {
  const { data, error } = await supabase
    .from("bookmarks")
    .update({ title, url })
    .eq("id", id)
    .select();
  return { data, error };
};

export const deleteBookmark = async (id) => {
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);
  return { data, error };
};

export const subscribeToBookmarks = (callback) => {
  const subscription = supabase
    .channel("bookmarks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      (payload) => {
        callback(payload);
      },
    )
    .subscribe();
  return subscription;
};
