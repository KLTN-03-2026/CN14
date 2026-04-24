const post = async (path, options) => {
  const response = await fetch("hhttps://bunzdepzaipro.app.n8n.cloud/webhook" + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options),
  });
  const result = await response.json();
  return result;
}

export const chatBot = async (question) => {
  const result = await post(`/chatbot`, question);
  return result;
}