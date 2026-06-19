import nodemailer from "nodemailer";

export const enviarMensagem = async (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: `[Vida TEA] ${assunto}`,
      html: `
        <h2>Nova mensagem enviada pelo app</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `,
    });

    return res.status(200).json({
      message: "Mensagem enviada com sucesso",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao enviar mensagem",
    });
  }
};