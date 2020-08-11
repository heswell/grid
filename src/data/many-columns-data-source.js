import { LocalDataSource } from "@heswell/data-source";

export default function getManyColumnsDataSource(columnCount, rowCount){
    /** @type {Column[]} */
    const columns = [
      { name: "id", width: 100, locked: true },
      { name: "ccy", width: 100, locked: true }
    ];

    const data = [];

    const start = performance.now();
    for (let i = 2, heading= 'Group 1'; i < columnCount; i++) {
      if ((i-2)%3 === 0){
        heading = `Group ${((i-2)/3) + 1}`
      }
      columns.push({ name: `${i - 1}M`, width: 100, heading: [`${i - 1}M`, heading] });
    }

    for (let i = 0; i < rowCount; i++) {
      const row = { id: i, ccy: "USDGBP" };
      for (let j = 2; j < columnCount; j++) {
        row[`${j - 1}M`] = `${i},${j - 1}`;
      }
      data.push(row);
    }

    const end = performance.now();
    console.log(`creating data took ${end - start} ms`);
    const dataSource = new LocalDataSource({ data, columns });
    return [columns, dataSource]

}