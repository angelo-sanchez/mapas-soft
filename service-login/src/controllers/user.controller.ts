import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: 86400
  });
}

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Por favor ingrese su correo o contraseña" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: "El correo eléctronico ya existe" });
  }

  const newUser = new User(req.body);
  await newUser.save();
  return res.status(201).json(newUser);
};

export const login = async (
  req: Request,
  res: Response
)=> {
  // return res.send('signin')
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Por favor ingrese su correo o contraseña" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "El email o la contraseña son incorrecto" });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    let datosUsuario = {
      'email' : user.email
    }
    return res.status(200).json({ token: createToken(user), 'user':datosUsuario });
  }

  return res.status(400).json({
    msg: "El email o la contraseña son incorrecto"
  });
};

export const logout = async (
  req: Request,
  res: Response
) => {
  req.logout();
  return res.status(200).json({
    msg: "OK"
  });
};