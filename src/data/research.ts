import { type CollectionEntry, getCollection } from "astro:content";

export type ResearchEntry = CollectionEntry<"research">;
export type ResearchData = ResearchEntry["data"];
export type ResearchStatus = ResearchData["status"];

/** filter out draft entries based on the environment, then apply the explicit order */
export async function getAllResearch(): Promise<ResearchEntry[]> {
	const entries = await getCollection("research", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
	return entries.sort(
		(a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
	);
}

/**
 * The only place a status is turned into prose. The schema guarantees `venue` is
 * present for the two statuses that name one, so this never renders "undefined".
 */
export function statusLabel({ status, venue }: Pick<ResearchData, "status" | "venue">): string {
	switch (status) {
		case "accepted":
			return `Accepted at ${venue}`;
		case "under-review":
			return `Under review at ${venue}`;
		case "preprint":
			return "Preprint on arXiv";
		case "in-preparation":
			return venue ? `In preparation, targeting ${venue}` : "In preparation";
	}
}

export const statusClass: Record<ResearchStatus, string> = {
	accepted: "border-accent text-accent",
	preprint: "border-link text-link",
	"under-review": "border-link text-link",
	"in-preparation": "border-muted text-muted",
};
