import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { getAllProductsFields, getProductByIdField, updateProductField } from "./field.js";

export const productSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "ProductSchema",
        description: "Product schema description",
        fields:{
            getAllProducts: getAllProductsFields,
            getProductById: getProductByIdField
        }
    }),
    mutation: new GraphQLObjectType({
        name: "MutationSchema",
        description: "Mutation schema description",
        fields:{
            updateProduct: updateProductField
        }
    })
})