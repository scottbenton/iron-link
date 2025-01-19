import { createFileRoute } from "@tanstack/react-router";

type AuthSearchParams = {
  continuePath?: string;
};

export const Route = createFileRoute("/_defaultNavLayout/auth")({
  validateSearch: (search: Record<string, unknown>) => {
    const { continuePath } = search as AuthSearchParams;

    if (typeof continuePath !== "string") {
      return {};
    }

    return {
      continuePath: continuePath || undefined,
    };
  },
});
