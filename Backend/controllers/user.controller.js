const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const hashPasswordFn = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ user: username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Username or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Username or Password" });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        user: user.user,
      },
      process.env.JWT_SECRET
      // { expiresIn: "1h" }
    );

    const {
      password: _,
      created_date,
      updated_date,
      status,
      ...safeUser
    } = user.toObject();

    res
      .status(200)
      .json({ success: true, message: "Login Successfully", safeUser, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { menu, rights, user_name, employee_id } = req.body;

    const existingUser = await userModel.findOne({
      user: user_name,
      status: 1,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist!" });
    }

    const password = "info@wav";

    const hashPassword = await hashPasswordFn(password);

    const menus = menu?.map((m) => ({
      name: m,
      access: rights[m],
    }));

    const result = new userModel({
      user: user_name,
      emp_id: employee_id,
      password: hashPassword,
      menu: menus,
    });
    await result.save();

    res
      .status(200)
      .json({ success: true, message: "User Addedd Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error?.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await userModel
      .find({ status: 1 }, { _id: 0, password: 0 })
      .lean();

    const AssignRights = result.map((item) => ({
      ...item,
      rights: item.menu?.map((item) => item.name),
    }));

    console.log("AssignRights", AssignRights);

    res.status(200).json({
      success: true,
      message: "Getting Users Successfully!",
      data: AssignRights,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("user_id", id);
    const data = req?.body;
    console.log("data", data);

    const updatedData = {
      user: data.user_name,
      emp_id: data.employee_id,
      menu: data?.menu?.map((m) => ({
        name: m,
        access: data.rights[m],
      })),
    };

    const result = await userModel.findOneAndUpdate(
      { user_id: id },
      { $set: { ...updatedData } },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "user Updated Successfully!" });
  } catch (error) {
    res.status(500).json({ success: true, message: error?.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("remove id", id);

    const result = await userModel.findOneAndUpdate(
      { user_id: id, status: 1 },
      { $set: { status: 0 } },
      { new: true }
    );
    if (!result) {
      res
        .status(404)
        .json({ success: false, message: "Active user not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "user Removed Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
