import api from "./api";

// Get available users for chat
export const getUsers = async () => {
  try {
    const response = await api.get("/chat/users");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// Get active conversations
export const getConversations = async () => {
  try {
    const response = await api.get("/chat/conversations");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching conversations:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get messages with a specific user
export const getMessages = async (receiverId) => {
  try {
    const response = await api.get(`/messages/${receiverId}`);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching messages:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// Send message
export const sendMessage = async (formData) => {
  try {
    const response = await api.post("/messages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );

    throw error;
  }
};