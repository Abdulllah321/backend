const { User } = require("../model/User");

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    const doc = {
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      name: user.name,
      role: user.role,
      imageUrl: user.imageUrl,
    };
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).exec();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await User.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateAllUser = async (req, res) => {
  const { id } = req.params;
  try {
    const AllUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(AllUser);
  } catch (err) {
    res.status(400).json(err);
  }
};
