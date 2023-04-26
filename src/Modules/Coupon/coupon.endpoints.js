import { systemRoles } from "../../utils/systemRoles.js";

export const endPoint = {
    CREATE_COUPON: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    UPDATE_COUPON: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
}