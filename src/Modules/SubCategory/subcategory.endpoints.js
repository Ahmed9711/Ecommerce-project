import { systemRoles } from "../../utils/systemRoles.js";

export const endPoint = {
    CREATE_SUB_CATEGORY: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    UPDATE_SUB_CATEGORY: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
}