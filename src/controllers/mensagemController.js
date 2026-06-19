import nodemailer from "nodemailer";

export const enviarMensagem = async (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ message: "Mensagem é obrigatória." });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_DESTINO) {
      return res.status(500).json({
        message: "Variáveis de e-mail não configuradas no servidor.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: `[Vida TEA] ${assunto || "Nova mensagem"}`,
      html: `
        <h2>Nova mensagem enviada pelo app</h2>
        <p><strong>Nome:</strong> ${nome || "Não informado"}</p>
        <p><strong>Email:</strong> ${email || "Não informado"}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `,
    });

    return res.status(200).json({
      message: "Mensagem enviada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);

    return res.status(500).json({
      message: "Erro ao enviar mensagem.",
      error: error.message,
    });
  }
};