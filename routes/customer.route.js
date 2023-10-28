const router = require("express").Router();
const auth = require("../middleware/auth");
const {
    customer,
    allCustomers,
} = require("../controllers/customer.controller");

router.post("/", auth, customer);
router.get("/", auth, allCustomers);

module.exports = router;
