const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const Customer = mongoose.model("customer", CustomerSchema);

module.exports = Customer;
