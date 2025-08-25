
const mediumBorder = { style: "medium" };

const borderMedium = { style: "medium" } as const;

const borderDotted = { style: "dotted" } as const;

const outerBorder = { style: "medium" } as const;

const sharedBorder = {
    top: borderMedium,
    left: borderMedium,
    bottom: borderMedium,
    right: borderMedium,
} as const;

const sharedBorderTable = {
    top: { style: "dotted" },
    left: mediumBorder,
    bottom: mediumBorder,
    right: mediumBorder,
};

const styles = {
    header: {
        font: { name: "Cambria", size: 20, bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
        border: sharedBorder,
    },
    formHeader: {
        font: { name: "Cambria", size: 12 },
        alignment: { horizontal: "right", vertical: "middle", wrapText: true },
        border: sharedBorder,
    },
    bold: {
        font: { name: "Arial", size: 11, bold: true },
        alignment: { wrapText: true, vertical: "top", horizontal: "left" },
    },
    boldDotted: {
        font: { name: "Arial", size: 11, bold: true },
        alignment: { wrapText: true, vertical: "top", horizontal: "left" },
        border: { bottom: borderDotted },
    },
    medium: {
        font: { name: "Arial", size: 11, bold: true },
        alignment: { wrapText: true },
    },
    regular: {
        font: { name: "Tahoma", size: 11 },
        alignment: { wrapText: true },
    },
    regularDotted: {
        font: { name: "Tahoma", size: 11 },
        alignment: { wrapText: true },
        border: { bottom: borderDotted },
    },
    tableHeader: {
        font: { name: "Arial", bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
        border: sharedBorder,
    },
    tableCell: {
        font: { name: "Tahoma", size: 12 },
        alignment: { horizontal: "left", vertical: "middle", wrapText: true },
        border: { ...sharedBorder, top: borderDotted },
    },
    tableCellNote: {
        font: { name: "Tahoma", size: 11 },
        alignment: { horizontal: "left", vertical: "middle", wrapText: true },
        border: { ...sharedBorder, top: borderDotted },
    },
    tableCellCentered: {
        font: { name: "Tahoma", size: 12 },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: { ...sharedBorder, top: borderDotted },
    },
    currency: {
        font: { name: "Tahoma", size: 12 },
        alignment: { horizontal: "right", vertical: "middle" },
        border: { ...sharedBorder, top: borderDotted },
        numFmt: "#,##0.0#;-#,##0.0#",
    },
    currencySummary: {
        font: { name: "Tahoma", size: 12 },
        alignment: { horizontal: "right", vertical: "middle" },
        border: sharedBorder,
        numFmt: "#,##0.0#;-#,##0.0#",
    },
    currencyBold: {
        font: { name: "Arial", size: 12, bold: true },
        alignment: { horizontal: "right", vertical: "middle" },
        border: sharedBorder,
        numFmt: "#,##0;#,##0.0#;-#,##0.0#",
    },
    signature: {
        font: { name: "Tahoma", size: 11 },
        alignment: { horizontal: "center", vertical: "middle" },
    },
    signatureName: {
        font: { name: "Tahoma", size: 9 },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: { top: borderMedium },
    },
    signatureNote: {
        font: { italic: true, size: 9 },
        alignment: { horizontal: "center", vertical: "bottom" },
    },
};

const styling = {
    styles: styles,
    sharedBorderTable: sharedBorderTable,
    sharedBorder: sharedBorder,
    mediumBorder: mediumBorder,
    borderMedium: borderMedium,
    borderDotted: borderDotted,
    outerBorder: outerBorder,
}

export default styling
