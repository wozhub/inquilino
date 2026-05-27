import { Router, raw } from "express";
import { Webhook, WebhookVerificationError } from "@legalize-dev/sdk";
import { createServerSupabase } from "../lib/supabase";
import { invalidateLawCache } from "../lib/legalize";

export const webhooksRouter = Router();

webhooksRouter.post(
    "/legalize",
    raw({ type: "application/json" }),
    async (req, res) => {
        const secret = process.env.LEGALIZE_WEBHOOK_SECRET;
        if (!secret) {
            return void res.status(500).json({ detail: "Webhook secret not configured" });
        }

        try {
            const event = Webhook.verify({
                payload: req.body,
                sigHeader: req.header("X-Legalize-Signature") ?? "",
                timestamp: req.header("X-Legalize-Timestamp") ?? "",
                secret,
            });

            if (event.type === "law.updated" || event.type === "law.repealed") {
                const lawId = (event.data as { law_id?: string }).law_id;
                if (lawId) {
                    invalidateLawCache(lawId);
                    await notifyAffectedUsers(lawId, event.type);
                }
            }

            res.status(204).send();
        } catch (err) {
            if (err instanceof WebhookVerificationError) {
                console.warn("[webhooks] verification failed:", err.reason);
                return void res.status(400).json({ detail: "Invalid signature" });
            }
            console.error("[webhooks] unexpected error:", err);
            res.status(500).json({ detail: "Internal error" });
        }
    },
);

async function notifyAffectedUsers(lawId: string, eventType: string): Promise<void> {
    const db = createServerSupabase();

    const { data: notifications } = await db
        .from("notifications")
        .select("user_id")
        .eq("law_id", lawId)
        .eq("dismissed", false);

    if (notifications && notifications.length > 0) {
        return;
    }

    const { data: profiles } = await db
        .from("user_profiles")
        .select("user_id");

    if (!profiles?.length) return;

    const rows = profiles.map((p) => ({
        user_id: p.user_id,
        type: "law_change" as const,
        law_id: lawId,
        event_type: eventType,
        dismissed: false,
    }));

    await db.from("notifications").insert(rows);
}
