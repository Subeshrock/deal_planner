// DealSummaryPdf.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts if you want, else Helvetica is default
Font.register({
  family: "Open Sans",
  src: "/fonts/OpenSans_Condensed-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    fontSize: 12,
    padding: 40,
    color: "#333",
  },
  header: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#0d47a1",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#1565c0",
  },
  labelValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#e3f2fd",
    padding: 6,
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  footer: {
    fontSize: 10,
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  heading: {
    fontFamily: "Open Sans",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

type ScenarioValues = {
  total: number;
  taxes: number;
  net: number;
};

type YearlyData = {
  year: string;
  earnOut: number;
  sellerFinancing: number;
  allCash: number;
};

type DealSummaryProps = {
  revenue: number;
  churn: number;
  growth?: number;
  earnOutPercentage?: number;
  taxRate?: number;
  summary: {
    earnOut: ScenarioValues;
    sellerFinancing: ScenarioValues;
    allCash: ScenarioValues;
  };
  yearlyData: YearlyData[];
};

const formatCurrency = (val: number) =>
  `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const DealSummaryPdf = ({
  revenue,
  churn,
  growth,
  earnOutPercentage = 30,
  taxRate = 20,
  summary,
  yearlyData,
}: DealSummaryProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Exit Strategy Comparison Report</Text>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Input Parameters</Text>
          <View style={styles.labelValueRow}>
            <Text style={styles.label}>Annual Revenue:</Text>
            <Text>{formatCurrency(revenue)}</Text>
          </View>
          <View style={styles.labelValueRow}>
            <Text style={styles.label}>Churn Rate:</Text>
            <Text>{churn}%</Text>
          </View>
          {growth !== undefined && (
            <View style={styles.labelValueRow}>
              <Text style={styles.label}>Growth Rate:</Text>
              <Text>{growth}%</Text>
            </View>
          )}
          <View style={styles.labelValueRow}>
            <Text style={styles.label}>Earn Out Percentage:</Text>
            <Text>{earnOutPercentage}%</Text>
          </View>
          <View style={styles.labelValueRow}>
            <Text style={styles.label}>Tax Rate:</Text>
            <Text>{taxRate}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Summary of Scenarios</Text>
          {["earnOut", "sellerFinancing", "allCash"].map((scenario) => {
            const val = summary[scenario as keyof typeof summary] as ScenarioValues;
            console.log(val)
            return (
              <View key={scenario} style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: "bold", fontSize: 14, color: "#0d47a1", marginBottom: 4 }}>
                  {scenario}
                </Text>
                <View style={styles.labelValueRow}>
                  <Text>Total:</Text>
                  <Text>{formatCurrency(val.total)}</Text>
                </View>
                <View style={styles.labelValueRow}>
                  <Text>Taxes:</Text>
                  <Text>{formatCurrency(val.taxes)}</Text>
                </View>
                <View style={styles.labelValueRow}>
                  <Text>Net Proceeds:</Text>
                  <Text>{formatCurrency(val.net)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Yearly Payouts</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Year</Text>
              <Text style={styles.tableColHeader}>Earn Out</Text>
              <Text style={styles.tableColHeader}>Seller Financing</Text>
              <Text style={styles.tableColHeader}>All Cash</Text>
            </View>
            {yearlyData.map(({ year, earnOut, sellerFinancing, allCash }, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCol}>{year}</Text>
                <Text style={styles.tableCol}>{formatCurrency(earnOut)}</Text>
                <Text style={styles.tableCol}>{formatCurrency(sellerFinancing)}</Text>
                <Text style={styles.tableCol}>{formatCurrency(allCash)}</Text>
              </View>
            ))}
          </View>
        </View>



        <Text style={styles.footer}>Generated by Deal Calculator Tool</Text>
      </Page>
    </Document>
  );
};
