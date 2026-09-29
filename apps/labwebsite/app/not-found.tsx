import { NotFoundView } from "@repo/ui";

export default function NotFound() {
  return (
    <NotFoundView
      portalHref={process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:4000"}
      homeHref={process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}
    />
  );
}
