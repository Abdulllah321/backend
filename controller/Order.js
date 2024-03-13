const { Order } = require("../model/Order");
const { User } = require("../model/User");
const { sendMail, invoiceTemplate, invoiceTemplateAdmin } = require("../services/common");
const { fetchUserById } = require("./User");

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    const user = await User.findById(order.user);
    const admin = await User.find({ role: "admin" });
    const email = [...admin].map((admin) => admin.email);

    sendMail({
      to: user.email,
      html: invoiceTemplate(order),
      subject: `Congratulations! Your Order Has Been Successfully Placed. Order#${order.id}`,
    });

    sendMail({
      to: [email],
      html: invoiceTemplateAdmin(order, user),
      subject: `Congratulations! A New Order is here. Order#${order.id}`,
    });
    
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  if (req.query.status) {
    query = query.where("status").equals(req.query.status);
    totalOrdersQuery = totalOrdersQuery
      .where("status")
      .equals(req.query.status);
  }

  const totalDocs = await totalOrdersQuery.countDocuments().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
