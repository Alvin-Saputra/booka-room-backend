import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text, html) => {
    try {
        // 1. Setup 'Transporter' (Kurir)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'emailkamu@gmail.com',     // Ganti dengan alamat emailmu
                pass: 'password_aplikasi_kamu'   // Ganti dengan App Password Gmail
            }
        });

        // 2. Setup 'Mail Options' (Isi Surat)
        const mailOptions = {
            from: '"Admin Booking Room" <emailkamu@gmail.com>', // Nama dan email pengirim
            to: to,                                             // Email tujuan (dari parameter)
            subject: subject,                                   // Judul email
            text: text,                                         // Isi email versi teks murni
            html: html                                          // Isi email versi HTML (opsional, agar tampilan lebih bagus)
        };

        // 3. Kirim Email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email berhasil dikirim: ' + info.messageId);
        return true;

    } catch (error) {
        console.error('Gagal mengirim email:', error);
        return false;
    }
};