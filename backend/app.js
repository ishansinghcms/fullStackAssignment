const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PurchaseOrder = require("./models/purchaseOrder");
const XLSX = require("xlsx");
const PORT = 3001;
const app = express();
app.use(cors());

app.get("/suppliers", async (req, res) => {
  try {
    const distinctSuppliers = await PurchaseOrder.distinct("Supplier");
    res.json(distinctSuppliers);
  } catch (error) {
    console.error("Error fetching distinct supplier names:", error);
    res.status(500).json({ error: "Error fetching supplier names" });
  }
});

app.get("/purchase-orders/:supplierName", async (req, res) => {
  const supplierName = req.params.supplierName;
  try {
    const purchaseOrders = await PurchaseOrder.find({
      Supplier: supplierName,
    });
    res.json(purchaseOrders);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Error fetching purchase orders" });
  }
});

function formatDateFromNumeric(numericValue) {
  if (!numericValue) return null;
  const date = new Date(1900, 0, numericValue - 1);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

async function loadData() {
  try {
    await mongoose.connect(
      "mongodb+srv://ishan:Ishan12345@cluster0.ysyufxx.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const fieldNames = [
      "RecordType",
      "PONumber",
      "PONumber",
      "PONumber",
      "Chg",
      "Com",
      "Type",
      "Conf",
      "OrderDate",
      "Buyer",
      "AccountNumber",
      "Supplier",
      "Curr",
      "Item",
      "CommodityCode",
      "Description",
      "Qty",
      "Un",
      "OrderValue",
      "AmountInvoiced",
      "",
      "WBSCode",
      "Contract",
      "Remarks",
    ];

    const workbook = XLSX.readFile("export29913.xlsx");
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const columns = Array.from({ length: 24 }, (_, index) =>
      String.fromCharCode(65 + index)
    );
    const results = [];
    const duplicateColumns = [];
    for (let i = 0; i < columns.length; ++i) {
      let previousValue = null;
      for (let row = 1; row <= 572; row++) {
        const cellReference = columns[i] + row;
        const header = columns[i] + 1;
        if (worksheet[cellReference] && !worksheet[header].v) {
          worksheet[cellReference].v = null;
        }
        if (worksheet[cellReference]) {
          let value = worksheet[cellReference].v;
          if (!value && value !== 0 && worksheet[cellReference].v !== null) {
            worksheet[cellReference].v = previousValue;
          } else {
            if (worksheet[header].v === "Order Date" && row !== 1) {
              worksheet[cellReference].v = formatDateFromNumeric(
                worksheet[cellReference].v
              );
              value = worksheet[cellReference].v;
            }
            previousValue = value;
          }
        }
      }
    }

    for (let row = 2; row <= 572; row++) {
      const purchaseOrderData = new PurchaseOrder();
      for (let i = 0; i < columns.length; ++i) {
        const cellReference = columns[i] + row;
        const header = columns[i] + 1;
        if (
          worksheet[cellReference] &&
          worksheet[header].v !== null &&
          !duplicateColumns.includes(worksheet[header].v)
        ) {
          duplicateColumns.push(worksheet[header].v);
          purchaseOrderData[fieldNames[i]] = worksheet[cellReference].v;
        }
      }
      duplicateColumns.length = 0;
      if (purchaseOrderData) results.push(purchaseOrderData);
    }

    await PurchaseOrder.deleteMany({});
    const insertedData = await PurchaseOrder.insertMany(results);
    console.log("Data inserted successfully:", insertedData);
    // await mongoose.disconnect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

loadData();
