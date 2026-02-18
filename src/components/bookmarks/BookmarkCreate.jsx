"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BookmarkCreate({ onAdd }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      alert("Please fill in both fields");
      return;
    }

    onAdd({ title, url });
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Bookmark Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., My Favorite Blog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="e.g., https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Add Bookmark
      </Button>
    </form>
  );
}
