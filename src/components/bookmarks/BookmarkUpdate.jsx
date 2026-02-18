"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BookmarkUpdate({ bookmark, onUpdate, onCancel }) {
  const [title, setTitle] = useState(bookmark?.title || "");
  const [url, setUrl] = useState(bookmark?.url || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      alert("Please fill in both fields");
      return;
    }

    onUpdate({
      ...bookmark,
      title,
      url,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="edit-title">Bookmark Title</Label>
        <Input
          id="edit-title"
          type="text"
          placeholder="e.g., My Favorite Blog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="edit-url">URL</Label>
        <Input
          id="edit-url"
          type="url"
          placeholder="e.g., https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
