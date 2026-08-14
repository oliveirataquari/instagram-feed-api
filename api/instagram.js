export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Token do Instagram não configurado."
      });
    }

    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "permalink",
      "thumbnail_url",
      "timestamp"
    ].join(",");

    const url =
      `https://graph.instagram.com/me/media` +
      `?fields=${fields}` +
      `&access_token=${token}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erro ao consultar o Instagram.",
        details: data
      });
    }

    // Cache na CDN da Vercel por 30 minutos
    // Se estiver expirado, pode entregar o cache antigo
    // enquanto busca uma versão nova em segundo plano.
    res.setHeader(
      "Cache-Control",
      "s-maxage=1800, stale-while-revalidate=86400"
    );

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Erro interno na API.",
      details: error.message
    });
  }
}