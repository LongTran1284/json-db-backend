const products = require('../jsonDB/data.json');
const fs = require('fs');

const getAllProducts = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: products
    })
};

const getProduct = (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(item => item.id === id);
    return res.status(200).json({
        status: "success",
        message: product
    })
};

const updateProduct = (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(item => item.id===id)
    
    if (index < 0) {
        return res.status(400).json({
            status: "fail",
            message: `There's no product with id ${id}`
        })
    }

    const updatedProduct = {...req.body, id: id};
    products.splice(index, 1, {...updatedProduct})
    
    fs.writeFile('./jsonDB/data.json', JSON.stringify(products), (err, data) => {
        if (err) return res.json(err)
        return res.status(201).json({
            status: "success",
            message: updatedProduct
        })
    })
};

const addProduct = (req, res) => {
    const newId = products[products.length-1].id + 1;
    
    const newProduct = {...req.body, id: newId};
    products.push(newProduct);

    fs.writeFile('./jsonDB/data.json', JSON.stringify(products), (err, data) => {
        if (err) return res.json(err)
        return res.status(201).json({
            status: "success",
            message: newProduct
        })
    })

}

const deleteProduct = (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(item => item.id===id)
    
    if (index < 0) {
        return res.status(400).json({
            status: "fail",
            message: `There's no product with id ${id}`
        })
    }

    products.splice(index, 1)
    
    fs.writeFile('./jsonDB/data.json', JSON.stringify(products), (err, data) => {
        if (err) return res.json(err)
        return res.status(201).json({
            status: "success",
            message: `Product with id ${id} has been deleted successfully.`
        })
    })
};

module.exports = {
    getAllProducts, addProduct, updateProduct, deleteProduct, getProduct
}