import { useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Post, usePosts } from "@/store/posts";

type SaveValue = {
  title: string;
  editor: Editor | null;
  delay?: number;
};

export function useAutoSave({ title, editor, delay = 1000 }: SaveValue) {
  const { open_post, setOpenPost, posts, setPosts, addPost } = usePosts();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPostIdRef = useRef<string | null>(null);

  // Track open_post ID
  useEffect(() => {
    if (open_post) {
      currentPostIdRef.current = open_post.id;
    }
  }, [open_post?.id]);

  useEffect(() => {
    const handleTextChange = () => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce the save
      timeoutRef.current = setTimeout(() => {
        const html = editor?.getHTML();
        const trimmedContent = html?.replace(/<[^>]*>/g, "").trim() || "";
        const trimmedTitle = title.trim();

        // Don't save if there's no actual content
        if (!trimmedContent && !trimmedTitle) {
          return;
        }

        const now = new Date().toISOString();

        if (currentPostIdRef.current) {
          // Update existing post
          const updatedPost: Post = {
            id: currentPostIdRef.current,
            title: trimmedTitle || "Untitled",
            content: html || "",
            created_at:
              posts.find((p) => p.id === currentPostIdRef.current)
                ?.created_at || now,
            updated_at: now,
          };

          // Update in posts array
          const updatedPosts = posts.map((p) =>
            p.id === currentPostIdRef.current ? updatedPost : p
          );
          setPosts(updatedPosts);

          // Update open_post if this is the open post
          if (open_post?.id === currentPostIdRef.current) {
            setOpenPost(updatedPost);
          }
        } else {
          // Create new post
          const newPost: Post = {
            id: crypto.randomUUID(),
            title: trimmedTitle || "Untitled",
            content: html || "",
            created_at: now,
            updated_at: now,
          };
          currentPostIdRef.current = newPost.id;
          addPost(newPost);
          setOpenPost(newPost);
        }
      }, delay);
    };

    editor?.on("update", handleTextChange);

    return () => {
      editor?.off("update", handleTextChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, title, delay, posts, open_post, addPost, setPosts, setOpenPost]);
}
