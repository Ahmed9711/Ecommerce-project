import { systemRoles } from "../../utils/systemRoles.js";

export const endPoint = {
    CREATE_CATEGORY: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    UPDATE_CATEGORY: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
}