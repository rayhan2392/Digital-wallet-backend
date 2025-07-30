/* eslint-disable no-console */
import { IUser, Role } from './../modules/user/user.interface';
import { envVars } from './../config/env';
import { User } from "../modules/user/user.model"
import bcrypt from 'bcryptjs'

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        
        if (isSuperAdminExist) {
            console.log('Super Admin exists')
            return;
        }

        console.log('Trying to create super admin.....')

        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))



        const payload: Partial<IUser> = {
            name: 'Super Admin',
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,

        }

        const superadmin = await User.create(payload)
        console.log('Super admin successfully created /n')
        console.log(superadmin)

    } catch (error) {
        console.log(error)
    }

}