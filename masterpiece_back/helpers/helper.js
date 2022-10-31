import bcrypt from 'bcrypt'

export const passwordEncrypter = async(plainPassword) => {
    const hash = await bcrypt.hash(plainPassword, 10);
    return hash
}

export const comparePassword = async(plainPassword, bddPassword) => {
    const result = await bcrypt.compare(plainPassword, bddPassword);
    return result;
}