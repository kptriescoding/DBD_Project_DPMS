import dotenv from "dotenv"
import path from "path"


const __dirname=path.resolve()
dotenv.config({path:__dirname+"/.env"});


export const SQL_HOST=process.env.SQL_HOST
export const SQL_USER=process.env.SQL_USER
export const SQL_PASS=process.env.SQL_PASS
export const SQL_DB=process.env.SQL_DB
export const DATABASE_URL=process.env.DATABASE_URL
export const SEND_EMAIL_API_KEY=process.env.SEND_EMAIL_API_KEY
export const MAIL_GET_API_KEY=process.env.MAIL_GET_API_KEY
export const MAIL_GET_SECRET_KEY=process.env.MAIL_GET_SECRET_KEY
