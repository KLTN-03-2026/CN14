const API_DOMAIN = "http://localhost:8002/api/v1";
// const API_DOMAIN = "https://project-webshop-api.vercel.app/api/v1";


export const get = async (path) => {
  const response = await fetch(API_DOMAIN + path);
  const result = await response.json();
  return result;
}

export const patch = async (path, options) => {
  const respones = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options),
  });
  const result = await respones.json();
  return result;
}

export const del = async (path, options) => {
  const respones = await fetch(API_DOMAIN + path, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options),
  });
  const result = await respones.json();
  return result;
}

export const post = async (path, options) => {
  const response = await fetch(API_DOMAIN + path, {
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

export const getAuth = async (path, token) => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Xử lý lỗi từ phía server
    if (!response.code === 400 || !response.code === 500) {
      const error = await response.json();
      throw new Error(error.message || "Lỗi không xác định từ server!");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in getAuth:", error.message);
    throw error; // Ném lỗi để xử lý tại nơi gọi hàm
  }
};

export const postAuth = async (path, options, token) => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(options)
    });

    // Xử lý lỗi từ phía server
    if (!response.code === 400 || !response.code === 500) {
      const error = await response.json();
      throw new Error(error.message || "Lỗi không xác định từ server!");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in getAuth:", error.message);
    throw error; // Ném lỗi để xử lý tại nơi gọi hàm
  }
}

export const delAuth = async (path, token) => {
  const respones = await fetch(API_DOMAIN + path, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  const result = await respones.json();
  return result;
}

export const patchAuth = async (path, options, token) => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(options),
    });

    // Xử lý lỗi từ phía server
    if (!response.code === 400 || !response.code === 500) {
      const error = await response.json();
      throw new Error(error.message || "Lỗi không xác định từ server!");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in getAuth:", error.message);
    throw error; // Ném lỗi để xử lý tại nơi gọi hàm
  }
}

