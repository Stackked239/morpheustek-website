import { revalidateTag } from "next/cache";

/** Next.js 16 requires a cache-life profile as the second argument. */
export function revalidateCms(tag: string) {
  revalidateTag(tag, "default");
}
