export const BUILTIN_WORKFLOWS: { id: string; title: string; prompt_md: string }[] = [
    {
        id: "builtin-rent-review",
        title: "Revisión de Contrato de Alquiler",
        prompt_md:
            "## Revisión de Contrato de Alquiler\n\n" +
            "Revisá el contrato de locación adjunto y generá un análisis de cumplimiento legal contra la legislación argentina vigente.\n\n" +
            "**Legislación aplicable**: Código Civil y Comercial arts. 1187-1226, Ley 27.551 (modificada por DNU 70/2023).\n\n" +
            "Para cada cláusula relevante del contrato:\n" +
            "1. Identificá la cláusula y su contenido\n" +
            "2. Referenciá el artículo de ley aplicable\n" +
            "3. Determiná si cumple, no cumple, o requiere atención\n" +
            "4. Explicá el problema si no cumple\n\n" +
            "Prestá especial atención a:\n" +
            "- Plazo mínimo legal\n" +
            "- Cláusula de actualización del precio (índice, periodicidad)\n" +
            "- Depósito de garantía (monto máximo legal)\n" +
            "- Gastos a cargo del locador vs locatario\n" +
            "- Expensas extraordinarias\n" +
            "- Rescisión anticipada y penalidades\n" +
            "- Garantías exigidas (límites legales)\n\n" +
            "Generá un documento Word con la tabla de cumplimiento usando generate_docx. " +
            "Usá orientación landscape. La tabla debe tener exactamente estas columnas:\n" +
            "1. Cláusula — descripción breve de la cláusula del contrato\n" +
            "2. Artículo — referencia legal aplicable\n" +
            "3. Estado — Cumple / No cumple / Atención\n" +
            "4. Observación — explicación del problema o confirmación",
    },
    {
        id: "builtin-expense-audit",
        title: "Auditoría de Gastos y Expensas",
        prompt_md:
            "## Auditoría de Categorización de Gastos\n\n" +
            "Revisá el documento de gastos/expensas adjunto y verificá que cada ítem esté correctamente categorizado.\n\n" +
            "Para cada línea de gasto:\n" +
            "1. Identificá el ítem y su monto\n" +
            "2. Verificá la categoría declarada contra la legislación aplicable\n" +
            "3. Determiná si la categorización es correcta\n" +
            "4. Si es incorrecta, indicá la categoría correcta y la base legal\n\n" +
            "Categorías relevantes según ley:\n" +
            "- Expensas ordinarias (art. 2048 CCyC): gastos de administración y mantenimiento habitual\n" +
            "- Expensas extraordinarias (art. 2048 CCyC): mejoras, reparaciones estructurales\n" +
            "- A cargo del locador: expensas extraordinarias, reparaciones que no sean por uso normal\n" +
            "- A cargo del locatario: expensas ordinarias, reparaciones por uso normal\n\n" +
            "Señalá específicamente:\n" +
            "- Gastos que se cobran al locatario pero corresponden al locador\n" +
            "- Gastos no detallados o sin justificación\n" +
            "- Montos que parecen fuera de rango\n\n" +
            "Entregá el resultado inline en formato tabla markdown.",
    },
    {
        id: "builtin-lease-summary",
        title: "Resumen de Contrato de Locación",
        prompt_md:
            "## Resumen de Contrato de Locación\n\n" +
            "Extraé todos los términos clave del contrato de locación adjunto y presentá un resumen estructurado.\n\n" +
            "Incluí las siguientes secciones:\n\n" +
            "1. **Partes**: Locador y locatario (nombre, DNI/CUIT si figura)\n" +
            "2. **Inmueble**: Dirección, tipo, superficie si se indica\n" +
            "3. **Plazo**: Fecha inicio, fecha fin, duración\n" +
            "4. **Precio**: Monto inicial, mecanismo de actualización, periodicidad\n" +
            "5. **Depósito**: Monto, condiciones de devolución\n" +
            "6. **Garantías**: Tipo de garantía exigida\n" +
            "7. **Expensas**: Distribución entre partes\n" +
            "8. **Rescisión**: Condiciones de rescisión anticipada, penalidades\n" +
            "9. **Cláusulas especiales**: Cualquier cláusula no estándar\n" +
            "10. **Alertas**: Términos inusuales, riesgos potenciales, posibles ilegalidades\n\n" +
            "Para cada alerta, citá el artículo de ley que la sustenta.\n\n" +
            "Entregá el resumen inline. No uses generate_docx a menos que te lo pida el usuario.",
    },
];
