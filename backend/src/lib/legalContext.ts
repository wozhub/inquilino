import { searchLaws, getLawContent, isLegalizeConfigured } from "./legalize";

export type ReviewIntent = "rent_review" | "expense_audit" | "lease_summary";

const SEARCH_QUERIES: Record<ReviewIntent, string[]> = {
    rent_review: [
        "locación urbana vivienda",
        "contrato alquiler ley 27551",
        "código civil comercial locación",
    ],
    expense_audit: [
        "expensas comunes extraordinarias",
        "obligaciones locador locatario",
    ],
    lease_summary: [
        "contrato locación plazo precio",
        "ley alquileres DNU 70/2023",
    ],
};

const MAX_LAWS = 3;
const MAX_CONTENT_CHARS = 12_000;

/**
 * Build a legal context block for injection into AI prompts.
 *
 * Returns formatted markdown of relevant Argentine law text, or empty string
 * if Legalize is not configured or all searches fail.
 */
export async function buildLegalContext(
    intent: ReviewIntent,
): Promise<string> {
    if (!isLegalizeConfigured()) return "";

    const queries = SEARCH_QUERIES[intent];
    const searchResults = await Promise.all(
        queries.map((q) => searchLaws(q, { perPage: 3 })),
    );

    const seen = new Set<string>();
    const uniqueHits: { id: string; title: string }[] = [];
    for (const hits of searchResults) {
        for (const hit of hits) {
            if (seen.has(hit.id)) continue;
            seen.add(hit.id);
            uniqueHits.push(hit);
            if (uniqueHits.length >= MAX_LAWS) break;
        }
        if (uniqueHits.length >= MAX_LAWS) break;
    }

    if (uniqueHits.length === 0) return "";

    const laws = await Promise.all(
        uniqueHits.map((h) => getLawContent(h.id)),
    );

    let totalChars = 0;
    const blocks: string[] = [];
    for (const law of laws) {
        if (!law) continue;
        let text = law.contentMd;
        if (totalChars + text.length > MAX_CONTENT_CHARS) {
            text = text.slice(0, MAX_CONTENT_CHARS - totalChars) + "\n\n[...truncado]";
        }
        blocks.push(`## ${law.title} (${law.id})\n\n${text}`);
        totalChars += text.length;
        if (totalChars >= MAX_CONTENT_CHARS) break;
    }

    if (blocks.length === 0) return "";

    return (
        "LEGISLACIÓN ARGENTINA DE REFERENCIA:\n" +
        "Usá estos artículos como base legal para tu análisis. " +
        "Citá artículos específicos cuando señales problemas.\n\n" +
        blocks.join("\n\n---\n\n")
    );
}
