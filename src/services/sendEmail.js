import nodemailer from 'nodemailer'

export const sendEmail = async ({to = "", subject = "", message = "", attachments = []}) => {
    //Email configurations
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        service: "gmail",
        auth:{
            user: process.env.SEND_EMAIL,
            pass: process.env.SEND_PASSWORD
        }
    })

    let info = await transporter.sendMail({
        from: process.env.SEND_EMAIL,
        to,
        subject,
        html: message,
        attachments
    })

    console.log(info);
    if(info.accepted.length){
        return true
    }
    return false
}