import { systemRoles } from "../../utils/systemRoles.js";

export const endPoint = {
    CREATE_PRODUCT: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    UPDATE_PRODUCT: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
}