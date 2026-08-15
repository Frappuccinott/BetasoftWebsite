"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function ArticleViewTracker({ articleId }: { articleId: Id<"articles"> }) {
  const trackArticleView = useMutation(api.analytics.trackArticleView);

  useEffect(() => {
    trackArticleView({ articleId }).catch(console.error);
  }, [articleId, trackArticleView]);

  return null;
}
