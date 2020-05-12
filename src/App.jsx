import React from "react";
import { Grid } from "./grid";
import { LocalDataSource } from "@heswell/data-source";

const data = [];

/** @type {Column[]} */
const columns = [
  { name: "id", width: 100, locked: true },
  { name: "ccy", width: 100, locked: true }
];

const start = performance.now();
for (let i = 2; i < 25; i++) {
  columns.push({ name: `${i - 1}M`, width: 100 });
}

for (let i = 0; i < 100; i++) {
  const row = { id: i, ccy: "USDGBP" };
  for (let j = 2; j < 25; j++) {
    row[`${j - 1}M`] = `${i},${j - 1}`;
  }
  data.push(row);
}

const end = performance.now();
console.log(`creating data took ${end - start} ms`);

const dataSource = new LocalDataSource({ data });

export default function App() {
  console.log(`[App]`);
  return (
    <Grid
      height={600}
      width={800}
      headerHeight={32}
      columns={columns}
      dataSource={dataSource}
    />
  );
}
