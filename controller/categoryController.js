const categoryHelper = require("../helper/categoryHelper");
const Category = require("../model/categoryModel");
const product = require("../model/product");
const Product = require('../model/product')
const loadCategory = async (req, res) => {
    try {
        await categoryHelper.loadcategory(req, res)
    }
    catch (error) {
        console.log(error.message);
    }
}
const addCategory = async (req, res) => {
    try {
        await categoryHelper.addcategory(req, res)
    }
    catch (error) {
        console.log(error.message);
    }
}
const editCategory = async (req, res) => {
    try {
        const userId = req.query.userId;
        const category = await Category.findOne({ _id: userId })
        res.render("editcategory", { category, userId })
    }
    catch (error) {
        console.log(error.message);
    }
}
const updateCategory = async (req, res) => {
    try {

        const { categoryname, description } = req.body

        const userId = req.body.userId;
        if (req.file) {
            const image = req.file.filename
            const updateCategory = await Category.findOneAndUpdate({ _id: userId }, { $set: { categoryname: categoryname, description: description, image: image } })
        } else {
            const updateCategory = await Category.findOneAndUpdate({ _id: userId }, { $set: { categoryname: categoryname, description: description } })
        }
        res.redirect("/admin/category")
    }
    catch (error) {
        console.log(error.message);
    }

}
const List = async (req, res) => {
    try {
        const categoryData = await Category.findOne({ _id: req.query.categoryId })
        const UpdateCategory = await Category.updateOne({ _id: req.query.categoryId }, { $set: { active: true } })

        const categoryName = categoryData.categoryname;
        const productData = await Product.find({ categoryname: categoryName });
        const updatproisList = await Product.updateMany({ categoryname: categoryName }, { $set: { isListed: true } });
        console.log('kkkkkk', updatproisList);
        res.redirect("/admin/category");
    } catch (error) {
        console.log(error.message);
    }
};


const Unlist = async (req, res) => {
    try {

        const categoryData = await Category.findOne({ _id: req.query.categoryId })
        const UpdateCategory = await Category.updateOne({ _id: req.query.categoryId }, { $set: { active: false } })

        const categoryName = categoryData.categoryname;
        const productData = await Product.findOne({ categoryname: categoryName });
        const updatproisList = await Product.updateOne({ categoryname: categoryName }, { $set: { isListed: false } })
        res.redirect("/admin/category")
    }
    catch (error) {
        console.log(error.message);
    }
}
module.exports = { loadCategory, addCategory, editCategory, updateCategory, List, Unlist }