export default async function handler(req, res) {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Token do Instagram não configurado."
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "API do Instagram funcionando."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erro interno na API."
    });
  }
}