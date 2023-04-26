import { systemRoles } from "../../utils/systemRoles.js";

export const endPoint = {
    ADD_TO_CART: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    UPDATE_BRAND: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
}