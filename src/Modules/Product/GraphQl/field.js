import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql"
import productModel from "../../../../DB/Models/product.model.js"
import { productType } from "./type.js"
import { validationGraphQl } from "../../../Middlewares/validation.js"
import { updateProductSchema } from "../product.validation.js"

export const getAllProductsFields = {
    type: new GraphQLList(productType),
    resolve: async () => {
        const products = await productModel.find()
        return products
    }
}

export const getProductByIdField = {
    type: productType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async (parent, args) =>{
        const product = await productModel.findById(args.id).populate('categoryId')
        return product
    }
}

export const updateProductField = {
    type: productType,
    args:{
        id: {type: new GraphQLNonNull(GraphQLID)},
        stock: {type: GraphQLInt}
    },
    resolve: async (parent, args) => {
        await validationGraphQl(updateProductSchema, args)
        const product = await productModel.findByIdAndUpdate(
            args.id,
            {stock: args.stock},
            {new: true}
        )
        return product
    }
}