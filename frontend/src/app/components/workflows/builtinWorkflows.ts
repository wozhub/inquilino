import type { MikeWorkflow } from "../shared/types";

export const BUILT_IN_WORKFLOWS: MikeWorkflow[] = [
    {
        id: "builtin-rent-review",
        user_id: null,
        is_system: true,
        created_at: "",
        title: "Revisión de Contrato de Alquiler",
        type: "tabular",
        practice: "Alquileres",
        prompt_md:
            "## Revisión de Contrato de Alquiler\n\n" +
            "Revisá el contrato de locación adjunto y generá un análisis de cumplimiento legal contra la legislación argentina vigente.\n\n" +
            "**Legislación aplicable**: Código Civil y Comercial arts. 1187-1226, Ley 27.551 (modificada por DNU 70/2023).\n\n" +
            "Para cada cláusula relevante, determiná si cumple con la ley y explicá cualquier problema.",
        columns_config: [
            {
                index: 0,
                name: "Cláusula",
                prompt: "Describí brevemente la cláusula del contrato que estás analizando.",
                format: "text",
            },
            {
                index: 1,
                name: "Artículo",
                prompt: "Indicá el artículo de ley aplicable (ej: art. 1196 CCyC, art. 3 Ley 27.551).",
                format: "text",
            },
            {
                index: 2,
                name: "Estado",
                prompt: "¿La cláusula cumple con la legislación? Respondé: Cumple, No cumple, o Atención.",
                format: "tag",
                tags: ["Cumple", "No cumple", "Atención"],
            },
            {
                index: 3,
                name: "Observación",
                prompt: "Si no cumple o requiere atención, explicá el problema. Si cumple, dejá una confirmación breve.",
                format: "text",
            },
        ],
    },
    {
        id: "builtin-expense-audit",
        user_id: null,
        is_system: true,
        created_at: "",
        title: "Auditoría de Gastos y Expensas",
        type: "tabular",
        practice: "Expensas",
        prompt_md:
            "## Auditoría de Categorización de Gastos\n\n" +
            "Revisá el documento de gastos/expensas y verificá que cada ítem esté correctamente categorizado según la legislación argentina.",
        columns_config: [
            {
                index: 0,
                name: "Ítem",
                prompt: "Describí el ítem de gasto o expensa.",
                format: "text",
            },
            {
                index: 1,
                name: "Categoría declarada",
                prompt: "¿Cómo está categorizado el gasto en el documento original?",
                format: "text",
            },
            {
                index: 2,
                name: "Categoría correcta",
                prompt: "Según la legislación, ¿cuál es la categoría correcta? (ordinaria, extraordinaria, a cargo locador, a cargo locatario)",
                format: "text",
            },
            {
                index: 3,
                name: "Cumple",
                prompt: "¿La categorización declarada es correcta?",
                format: "yes_no",
            },
            {
                index: 4,
                name: "Base legal",
                prompt: "Citá el fundamento legal (artículo o norma) que sustenta tu clasificación.",
                format: "text",
            },
        ],
    },
    {
        id: "builtin-lease-summary",
        user_id: null,
        is_system: true,
        created_at: "",
        title: "Resumen de Contrato de Locación",
        type: "assistant",
        practice: "Alquileres",
        prompt_md:
            "## Resumen de Contrato de Locación\n\n" +
            "Extraé todos los términos clave del contrato de locación adjunto y presentá un resumen estructurado.\n\n" +
            "Incluí: partes, inmueble, plazo, precio y actualización, depósito, garantías, expensas, rescisión, cláusulas especiales, y alertas legales.\n\n" +
            "Para cada alerta, citá el artículo de ley que la sustenta.",
        columns_config: null,
    },
];

export const BUILT_IN_IDS = new Set(BUILT_IN_WORKFLOWS.map((w) => w.id));
