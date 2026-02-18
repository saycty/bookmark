"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ExternalLink, Edit } from "lucide-react";
import BookmarkUpdate from "./BookmarkUpdate";

export default function BookmarkList({
  bookmarks,
  onDelete,
  onEdit,
  editingId,
  onUpdate,
}) {
  return (
    <div className="space-y-4">
      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No bookmarks yet. Add one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        bookmarks.map((bookmark) => (
          <Card
            key={bookmark.id}
            className={editingId === bookmark.id ? "border-blue-500" : ""}
          >
            {editingId === bookmark.id ? (
              <CardContent className="pt-6">
                <BookmarkUpdate
                  bookmark={bookmark}
                  onUpdate={(updated) => {
                    onUpdate(updated);
                  }}
                  onCancel={() => onEdit(null)}
                />
              </CardContent>
            ) : (
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words">
                      {bookmark.title}
                    </CardTitle>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1 break-all"
                    >
                      {bookmark.url}
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(bookmark.id)}
                      title="Edit bookmark"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(bookmark.id)}
                      title="Delete bookmark"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
