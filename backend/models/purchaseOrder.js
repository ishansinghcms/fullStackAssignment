const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  RecordType: String,
  PONumber: String,
  Chg: String,
  Com: String,
  Type: String,
  Conf: String,
  OrderDate: String,
  Buyer: String,
  AccountNumber: String,
  Supplier: String,
  Curr: String,
  Item: Number,
  CommodityCode: String,
  Description: String,
  Qty: Number,
  Un: String,
  OrderValue: Number,
  AmountInvoiced: Number,
  WBSCode: String,
  Contract: String,
  Remarks: String,
});

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
module.exports = PurchaseOrder;
