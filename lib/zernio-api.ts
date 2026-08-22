const ZERNIO_BASE_URL = "https://zernio.com/api/v1"

export async function sendZernioMessage(
  conversationId: string,
  message: string
) {
  const response = await fetch(
    `${ZERNIO_BASE_URL}/inbox/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify({
        message,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error("Zernio send error:", data)
    return {
      success: false,
      error: data,
    }
  }

  return {
    success: true,
    data,
  }
}
