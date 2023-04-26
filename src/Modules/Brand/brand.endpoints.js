import { systemRoles } from "../../utils/systemRoles.js";

export const endPoint = {
    CREATE_BRAND: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    UPDATE_BRAND: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
}