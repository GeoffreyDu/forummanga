import bcrypt from 'bcrypt'

// to encrypt the password
export const passwordEncrypter = async(plainPassword) => {
    const hash = await bcrypt.hash(plainPassword, 10);
    return hash
}

// to check the user's password
export const comparePassword = async(plainPassword, bddPassword) => {
    const result = await bcrypt.compare(plainPassword, bddPassword);
    return result;
}