"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookmarkCreate from "@/components/bookmarks/BookmarkCreate";
import BookmarkList from "@/components/bookmarks/BookmarkList";
import {
  getBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  subscribeToBookmarks,
} from "@/lib/supabase/bookmarks";
import { getSession, onAuthStateChange, signOut } from "@/lib/supabase/auth";

export default function Dashboard() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadBookmarks = async () => {
    setLoading(true);
    const { data, error } = await getBookmarks();
    if (error) {
      console.error("Error loading bookmarks:", error);
    } else {
      setBookmarks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data } = await getSession();
      if (!active) return;

      const session = data?.session;
      if (!session) {
        setLoading(false);
        router.replace("/signup");
        return;
      }

      setUser(session.user);
      await loadBookmarks();
    };

    init();

    const subscription = onAuthStateChange((session) => {
      if (!session) {
        setUser(null);
        setBookmarks([]);
        router.replace("/signup");
        return;
      }

      setUser(session.user);
      loadBookmarks();
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToBookmarks((payload) => {
      if (payload.eventType === "INSERT") {
        setBookmarks((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setBookmarks((prev) =>
          prev.map((b) => (b.id === payload.new.id ? payload.new : b)),
        );
      } else if (payload.eventType === "DELETE") {
        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
      }
    });

    return () => subscription?.unsubscribe();
  }, [user]);

  const handleAddBookmark = async (newBookmark) => {
    const { data, error } = await addBookmark(
      newBookmark.title,
      newBookmark.url,
    );
    if (error) {
      alert("Error adding bookmark: " + error.message);
    }
  };

  const handleDeleteBookmark = async (id) => {
    const { error } = await deleteBookmark(id);
    if (error) {
      alert("Error deleting bookmark: " + error.message);
    }
  };

  const handleEditBookmark = (id) => {
    setEditingId(id);
  };

  const handleUpdateBookmark = async (updatedBookmark) => {
    const { error } = await updateBookmark(
      updatedBookmark.id,
      updatedBookmark.title,
      updatedBookmark.url,
    );
    if (error) {
      alert("Error updating bookmark: " + error.message);
    }
    setEditingId(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/signup");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Bookmark</CardTitle>
          </CardHeader>
          <CardContent>
            <BookmarkCreate onAdd={handleAddBookmark} />
          </CardContent>
        </Card>
        <BookmarkList
          bookmarks={bookmarks}
          onDelete={handleDeleteBookmark}
          onEdit={handleEditBookmark}
          editingId={editingId}
          onUpdate={handleUpdateBookmark}
        />
      </div>
    </div>
  );
}
