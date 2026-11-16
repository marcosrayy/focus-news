import { z } from "zod";
import defaults from "@/config/focus-defaults.json";

function safeUrl(value: string) {
  if (/\s|\\/.test(value) || [...value].some(char => char.charCodeAt(0) < 32)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) {
    try { return !decodeURIComponent(value).split("/").includes(".."); } catch { return false; }
  }
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}
const image = z.string().min(1, "Escolha uma imagem").max(2048).refine(safeUrl, "Imagem deve usar um caminho local ou HTTPS");
const link = z.string().max(2048).refine(v => v === "" || safeUrl(v), "Link deve usar um caminho local ou HTTPS");
const id = z.string().min(1).max(80).regex(/^[a-zA-Z0-9-]+$/);
export const bannerSchema = z.object({ id, image, mobileImage: image, title: z.string().trim().min(1).max(200), link, active: z.boolean() }).strict();
export const cardSchema = z.object({
  id, section: z.enum(["events", "workshops"]), title: z.string().trim().min(1).max(200),
  text: z.string().max(2000), image, link, location: z.string().max(200), date: z.string().max(100),
  targetDate: z.string().refine(v => !v || !Number.isNaN(Date.parse(v)), "Data inválida"),
  type: z.string().max(100), typeColor: z.enum(["bg-primary", "bg-emerald-600"]),
  status: z.string().max(100), tags: z.array(z.string().max(60)).max(12), participants: z.number().int().min(0).max(1000000),
}).strict();
export const gallerySchema = z.object({ id, src: image, alt: z.string().trim().min(1).max(300), label: z.string().trim().min(1).max(200),
  span: z.enum(["col-span-1 row-span-1", "col-span-2 row-span-1", "col-span-2 row-span-2"]), fit: z.enum(["cover", "contain"]),
}).strict();
export const focusContentSchema = z.object({ banners: z.array(bannerSchema).max(30), cards: z.array(cardSchema).max(100), gallery: z.array(gallerySchema).max(200) }).strict().superRefine((value, ctx) => {
  for (const items of [value.banners, value.cards, value.gallery]) {
    if (new Set(items.map(i => i.id)).size !== items.length) ctx.addIssue({ code: "custom", message: "Há identificadores duplicados" });
  }
});
export type FocusContent = z.infer<typeof focusContentSchema>;
export type FocusBanner = FocusContent["banners"][number];
export type FocusCard = FocusContent["cards"][number];
export type FocusPhoto = FocusContent["gallery"][number];
export type FocusDocument = { revision: number; publishedAt: string | null; content: FocusContent };
export const defaultFocusContent = focusContentSchema.parse(defaults);
