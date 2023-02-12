import sendEmailApi from '@sendgrid/mail'
import { SEND_EMAIL_API_KEY } from '../env.js'

sendEmailApi.setApiKey(SEND_EMAIL_API_KEY)


const sendEmail=(toEmail,subject,text)=>{
    const msg = {
        to: toEmail, // Change to your recipient
        from: 'karthikpai.is20@rvce.edu.in', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
sendEmailApi.send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}
