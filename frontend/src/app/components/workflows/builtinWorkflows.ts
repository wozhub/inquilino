import type { MikeWorkflow } from "../shared/types";

export const BUILT_IN_WORKFLOWS: MikeWorkflow[] = [];

export const BUILT_IN_IDS = new Set(BUILT_IN_WORKFLOWS.map((w) => w.id));
