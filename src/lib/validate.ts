export default function loginValidate(values: {
  email: string;
  password: string;
}) {
  const errors: {
    email?: string;
    password?: string;
  } = {};

  if (!values.email) {
    errors.email = "Requerido";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Correo electrónico inválido";
  }

  if (!values.password) {
    errors.password = "Requerido";
  } else if (values.password.length < 8 || values.password.length > 20) {
    errors.password = "Debe tener entre 8 y 20 caracteres de longitud";
  } else if (values.password.includes(" ")) {
    errors.password = "Contraseña inválida";
  }

  return errors;
}

export function registerValidate(values: {
  name: string;
  email: string;
  password: string;
  cPassword: string;
}) {
  const errors: {
    name?: string;
    email?: string;
    password?: string;
    cPassword?: string;
  } = {};

  // Validación de nombre de usuario
  if (!values.name) {
    errors.name = "Requerido";
  } else if (values.name.length < 5) {
    errors.name = "Debe tener mínimo 5 caracteres";
  } else if (!/^[a-zA-Z0-9]+$/.test(values.name)) {
    errors.name = "Solo letras y números, sin espacios ni símbolos";
  }

  // Validación de correo electrónico
  if (!values.email) {
    errors.email = "Requerido";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Correo electrónico inválido";
  }

  // Validación de contraseña
  if (!values.password) {
    errors.password = "Requerido";
  } else if (values.password.length < 8 || values.password.length > 20) {
    errors.password = "Debe tener entre 8 y 20 caracteres de longitud";
  } else if (values.password.includes(" ")) {
    errors.password = "Contraseña inválida";
  }

  // Validación de confirmación de contraseña
  if (!values.cPassword) {
    errors.cPassword = "Requerido";
  } else if (values.password !== values.cPassword) {
    errors.cPassword = "Las contraseñas no coinciden";
  } else if (values.cPassword.includes(" ")) {
    errors.cPassword = "Contraseña de confirmación inválida";
  }

  return errors;
}
