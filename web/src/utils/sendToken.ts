import { CookieOptions, Response } from "express";
import { IUser } from "../models/userModel";

const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getJWTToken();
  const isProduction = process.env.NODE_ENV === "production";
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE ?? 7);
  const maxAge = cookieExpireDays * 24 * 60 * 60 * 1000;

  const options: CookieOptions = {
    expires: new Date(Date.now() + maxAge),
    maxAge,
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;