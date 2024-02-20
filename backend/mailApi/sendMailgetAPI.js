import mailApi from 'node-mailjet'
import { MAIL_GET_API_KEY, MAIL_GET_SECRET_KEY } from '../env.js'


let mailjet=mailApi.apiConnect(MAIL_GET_API_KEY,MAIL_GET_SECRET_KEY)


 const sendEmailMailGet=(toEmail,subject,text)=>{
// const request =mailjet
// .post("send", {'version': 'v3.1'})
// .request({
//   "Messages":[
//     {
//       "From": {
//         "Email": "karthikpai.is20@rvce.edu.in",
//         "Name": "Karthik Pai"
//       },
//       "To": [
//         {
//           "Email": toEmail,
//         }
//       ],
//       "Subject": subject,
//       "TextPart": text,
//       // "HTMLPart"
//     }
//   ]
// })
// request
//   .then((result) => {
//     console.log("Success")
//   })
//   .catch((err) => {
//     console.log("Failure")
//   })

}
export default sendEmailMailGet
