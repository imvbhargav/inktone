import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type PostStore = {
  open_post: Post | null;
  posts: Post[];
  setOpenPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  removePost: (post_id: string) => void;
  clearPosts: () => void;
};

export const usePosts = create<PostStore>()(
  persist(
    (set) => ({
      open_post: null,
      posts: [],
      setOpenPost: (post) =>
        set((state) => ({
          open_post: post,
        })),
      setPosts: (posts) => set({ posts }),
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts.filter((p) => p.id !== post.id)],
        })),
      removePost: (post_id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== post_id),
        })),
      clearPosts: () => set({ posts: [] }),
    }),
    {
      name: "posts-storage",
    }
  )
);
