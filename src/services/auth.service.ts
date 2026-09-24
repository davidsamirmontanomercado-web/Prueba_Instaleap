import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {createUser,findUserByEmail,User,} from "../persistence/users.repository";
import { AppError } from "../errors/AppError";
import { AuthenticationError } from "../errors/AuthenticationError";
import { env } from "../config/env";

interface RegisterUserData {
  nombre: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

/**
 * Registra un nuevo usuario en el sistema.
 *
 * Verifica que el correo no esté registrado y almacena
 * la contraseña utilizando un hash generado con bcrypt.
 *
 * @param data Datos necesarios para registrar el usuario.
 * @returns Información del usuario creado sin incluir la contraseña.
 * @throws AppError Si el correo ya está registrado.
 */
export const registerUser = async (
  data: RegisterUserData
): Promise<Omit<User, "password_hash">> => {
  const { nombre, email, password } = data;

  // 1. Verificar si el usuario ya existe
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(
      "El correo electrónico ya está registrado",
      409
    );
  }

  // 2. Generar hash de la contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Crear el usuario
  const user = await createUser(
    nombre,
    email,
    passwordHash
  );

  // 4. No devolver el password_hash
  const { password_hash, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

/**
 * Autentica un usuario mediante correo y contraseña.
 *
 * Verifica las credenciales utilizando bcrypt y genera
 * un token JWT válido durante una hora.
 *
 * @param data Credenciales del usuario.
 * @returns Token JWT e información del usuario autenticado.
 * @throws AuthenticationError Si las credenciales son incorrectas.
 */
export const loginUser = async (
  data: LoginUserData
): Promise<{
  token: string;
  user: Omit<User, "password_hash">;
}> => {
  const { email, password } = data;

  // 1. Buscar el usuario por correo electrónico
  const user = await findUserByEmail(email);

  // 2. Si no existe, rechazar las credenciales
  if (!user) {
    throw new AuthenticationError(
      "Correo electrónico o contraseña incorrectos"
    );
  }

  // 3. Comparar la contraseña enviada con el hash almacenado
  const passwordIsValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  // 4. Si la contraseña no coincide, rechazar las credenciales
  if (!passwordIsValid) {
    throw new AuthenticationError(
      "Correo electrónico o contraseña incorrectos"
    );
  }

  // 5. Generar el token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    env.jwt.secret,
    {
      expiresIn: "1h",
    }
  );

  // 6. No devolver el password_hash
  const { password_hash, ...userWithoutPassword } = user;
  // 7. Devolver el token y la información del usuario sin el hash de la contraseña
  return {
    token,
    user: userWithoutPassword,
  };
};