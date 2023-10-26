import React, { useState, useEffect } from "react";
import axios from "axios";

function Project() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [supplierName, setSupplierName] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    axios
      .get("https://backendfullstack.netlify.app/.netlify/functions/api/suppliers")
      .then((response) => {
        setSupplierName(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSupplierChange = (e) => {
    setPurchaseOrders([]);
    const supplier = e.target.value;
    console.log(`e.target.value->${supplier}`);
    const encodedSupplierName = encodeURIComponent(supplier);
    axios
      .get(`https://backendfullstack.netlify.app/.netlify/functions/api/purchase-orders/${encodedSupplierName}`)
      .then((response) => {
        const newPurchaseOrders = response.data;
        setPurchaseOrders(newPurchaseOrders);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderId = e.target.purchaseOrder.value;
    const order = purchaseOrders.find((order) => order._id === orderId);
    setSelectedOrder({
      Name: name,
      StartTime: startTime,
      EndTime: endTime,
      HoursWorked: hoursWorked,
      SupplierName: order.Supplier,
      PONumber: order.PONumber,
      Description: order.Description,
    });
  };

  return (
    <div>
      <h2>Create DOCKET by filling the below form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div>
          <label>Hours Worked:</label>
          <input
            type="text"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
          />
        </div>
        <div>
          <label>Supplier Name:</label>
          <select onChange={handleSupplierChange}>
            <option value="">Select Supplier</option>
            {supplierName.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Purchase Order:</label>
          <select name="purchaseOrder">
            {purchaseOrders.map((order, index) => (
              <option
                className="multiline-option"
                key={order._id}
                value={order._id}
              >
                {`Order ${index + 1} = PO_NUMBER: ${
                  order.PONumber
                } || DESCRIPTION: ${order.Description}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      {selectedOrder && (
        <div>
          <h2>DOCKET</h2>
          <p>Name: {selectedOrder.Name}</p>
          <p>Start Time: {selectedOrder.StartTime}</p>
          <p>End Time: {selectedOrder.EndTime}</p>
          <p>Hours Worked: {selectedOrder.HoursWorked}</p>
          <p>Supplier Name: {selectedOrder.SupplierName}</p>
          <p>PO Number: {selectedOrder.PONumber}</p>
          <p>Description: {selectedOrder.Description}</p>
        </div>
      )}
    </div>
  );
}

export default Project;
