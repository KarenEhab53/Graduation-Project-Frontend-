
import { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import socket from "../../services/socket";
import styles from "./Chat.module.css";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? "" : "You are not logged in. Please login first.";
  });

  const messagesEndRef = useRef(null);

  // ==========================================
  // Current logged-in user
  // ==========================================
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ==========================================
  // Keep selected user updated for socket
  // ==========================================
  const selectedUserRef = useRef(selectedUser);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  
  // ==========================================
  // Auto scroll messages
  // ==========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================================
  // Socket
  // Register user + receive messages
  // ==========================================
  useEffect(() => {
    const currentUserId = currentUser?._id || currentUser?.id;

    if (!currentUserId) return;

    socket.emit("register", currentUserId);

    const handleReceiveMessage = (newMessage) => {
      console.log("📥 Received message via socket:", newMessage);

      const activeUser = selectedUserRef.current;

      const activeUserId = activeUser
        ? activeUser._id || activeUser.id
        : null;

      if (
        activeUserId &&
        String(newMessage.senderId) === String(activeUserId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }

      fetchConversations();
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentUser?._id, currentUser?.id]);

  // ==========================================
  // Get available users / doctors
  // GET /api/chat/users
  //
  // Search:
  // GET /api/chat/users?search=Ahmed
  // ==========================================
  const fetchUsers = async (search = "") => {
    try {
      setLoadingUsers(true);

      const response = await api.get("/chat/users", {
        params: search.trim()
          ? {
              search: search.trim(),
            }
          : {},
      });

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else if (Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized: Your token is invalid or expired.");
      } else {
        setError(
          error.response?.data?.message || "Failed to load doctors."
        );
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  // ==========================================
  // Get conversations
  // GET /api/chat/conversations
  // ==========================================
  async function fetchConversations() {
    try {
      setLoadingConversations(true);

      const response = await api.get("/chat/conversations");


      if (Array.isArray(response.data)) {
        setConversations(response.data);
      } else if (Array.isArray(response.data.conversations)) {
        setConversations(response.data.conversations);
      } else if (Array.isArray(response.data.data)) {
        setConversations(response.data.data);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized: Your token is invalid or expired.");
      }
    } finally {
      setLoadingConversations(false);
    }
  };

  // ==========================================
  // Initial load
  // ==========================================
  useEffect(() => {
    const loadChatData = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      await Promise.all([
        fetchUsers(),
        fetchConversations(),
      ]);
    };

    loadChatData();
  }, []);

  // ==========================================
  // Search doctors
  //
  // Wait 400ms after typing
  // ==========================================
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // ==========================================
  // Get messages
  // GET /api/chat/messages/:receiverId
  // ==========================================
  const fetchMessages = async (receiverId) => {
    if (!receiverId) return;

    try {
      setLoadingMessages(true);
      setMessages([]);

      const response = await api.get(
        `/chat/messages/${receiverId}`
      );


      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else if (Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
      } else if (Array.isArray(response.data.data)) {
        setMessages(response.data.data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized: Your token is invalid or expired.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load messages."
        );
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  // ==========================================
  // Select user / doctor
  // ==========================================
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setError("");

    const receiverId = user._id || user.id;

    await fetchMessages(receiverId);
  };

  // ==========================================
  // Back to list
  // ==========================================
  const handleBackToList = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  // ==========================================
  // Handle images
  // ==========================================
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 5) {
      setError("You can upload maximum 5 images.");
      return;
    }

    setImages(files);
    setError("");
  };

  // ==========================================
  // Remove selected image
  // ==========================================
  const removeSelectedImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // Send message
  // POST /api/chat/messages
  // ==========================================
  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!selectedUser) {
      setError("Please select a user first.");
      return;
    }

    if (!message.trim() && images.length === 0) {
      return;
    }

    const receiverId =
      selectedUser._id || selectedUser.id;

    try {
      setSending(true);
      setError("");

      const formData = new FormData();

      formData.append("receiverId", receiverId);

      if (message.trim()) {
        formData.append(
          "message",
          message.trim()
        );
      }

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await api.post(
        "/chat/messages",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "📤 Send message response:",
        response.data
      );

      const sentMessage =
        response.data?.data || response.data;

      if (sentMessage) {
        setMessages((prev) => [
          ...prev,
          sentMessage,
        ]);
      }

      // Socket notification
      socket.emit("sendMessage", {
        senderId:
          currentUser?._id || currentUser?.id,

        receiverId,

        message: message.trim(),

        images: sentMessage?.images || [],
      });

      setMessage("");
      setImages([]);

      const fileInput =
        document.getElementById(
          "chat-image-input"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchConversations();
    } catch (error) {
      console.error(
        "❌ Error sending message:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Unauthorized: Your token is invalid or expired."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to send message."
        );
      }
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // Helpers
  // ==========================================
  const getUserId = (user) =>
    user?._id || user?.id;

  const getUserName = (user) =>
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Unknown User";

  const getUserImage = (user) => {
    if (!user) {
      return "/uploads/default.jpg";
    }

    return (
      user.profileImage ||
      user.image ||
      user.avatar ||
      "/uploads/default.jpg"
    );
  };

  const getMessageText = (msg) =>
    msg?.message ||
    msg?.text ||
    msg?.content ||
    "";

  const isMyMessage = (msg) => {
    const senderId =
      msg?.senderId ||
      msg?.sender?._id ||
      msg?.sender;

    const currentUserId =
      currentUser?._id ||
      currentUser?.id;

    return (
      senderId &&
      currentUserId &&
      String(senderId) ===
        String(currentUserId)
    );
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // Build conversations list
  // ==========================================
  const conversationUserIds = new Set(
    conversations
      .map((conversation) => {
        const user =
          conversation.user ||
          conversation.otherUser ||
          conversation.receiver ||
          conversation.sender;

        return user
          ? String(getUserId(user))
          : null;
      })
      .filter(Boolean)
  );

  const usersWithoutConversation =
    users.filter(
      (user) =>
        !conversationUserIds.has(
          String(getUserId(user))
        )
    );

  const combinedList = [
    ...conversations
      .map((conversation) => {
        const conversationUser =
          conversation.user ||
          conversation.otherUser ||
          conversation.receiver ||
          conversation.sender;

        if (!conversationUser) {
          return null;
        }

        return {
          type: "conversation",

          user: conversationUser,

          lastMessage:
            conversation.lastMessage ||
            conversation.message ||
            "",

          time:
            conversation.lastMessageAt ||
            conversation.updatedAt,

          key:
            conversation._id ||
            conversation.id ||
            getUserId(conversationUser),
        };
      })
      .filter(Boolean),

    ...usersWithoutConversation.map(
      (user) => ({
        type: "user",

        user,

        lastMessage: "",

        time: null,

        key: getUserId(user),
      })
    ),
  ];

  // ==========================================
  // Search result
  //
  // When search is empty:
  // show conversations
  //
  // When search has text:
  // show doctors returned from backend
  // ==========================================
  const filteredList = searchTerm.trim()
    ? users.map((user) => ({
        type: "user",

        user,

        lastMessage: "",

        time: null,

        key: getUserId(user),
      }))
    : combinedList;

  const isLoadingList =
    loadingConversations ||
    loadingUsers;

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className={styles.chatPage}>
      <div className={styles.chatContainer}>
        {!selectedUser ? (
          <>
            {/* ================= HEADER ================= */}
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <h2 className={styles.headerTitle}>
                  Messages
                </h2>
              </div>
            </div>

            {/* ================= ERROR ================= */}
            {error && (
              <div
                style={{
                  padding: "8px 20px",
                  color: "#ff4d4f",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            {/* ================= SEARCH ================= */}
            <div
              className={
                styles.searchContainer
              }
            >
              <div
                className={
                  styles.searchWrapper
                }
              >
                <span
                  className={
                    styles.searchIcon
                  }
                >
                  🔍
                </span>

                <input
                  type="text"
                  className={
                    styles.searchInput
                  }
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* ================= CHAT LIST ================= */}
            {isLoadingList ? (
              <div
                className={
                  styles.loadingContainer
                }
              >
                {searchTerm.trim()
                  ? "Searching doctors..."
                  : "Loading chats..."}
              </div>
            ) : filteredList.length > 0 ? (
              <div
                className={
                  styles.chatsList
                }
              >
                {filteredList.map(
                  (item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={
                        styles.chatRow
                      }
                      onClick={() =>
                        handleSelectUser(
                          item.user
                        )
                      }
                    >
                      {/* Avatar */}
                      <div
                        className={
                          styles.avatarWrapper
                        }
                      >
                        <img
                          className={
                            styles.avatar
                          }
                          src={getUserImage(
                            item.user
                          )}
                          alt={getUserName(
                            item.user
                          )}
                          onError={(e) => {
                            e.currentTarget.src =
                              "/uploads/default.jpg";
                          }}
                        />
                      </div>

                      {/* User information */}
                      <div
                        className={
                          styles.chatInfo
                        }
                      >
                        <p
                          className={
                            styles.partnerName
                          }
                        >
                          {getUserName(
                            item.user
                          )}
                        </p>

                        {searchTerm.trim() ? (
                          <p
                            className={
                              styles.lastMsg
                            }
                          >
                            {item.user
                              .specialty ||
                              item.user.email ||
                              "Doctor"}
                          </p>
                        ) : (
                          <p
                            className={
                              styles.lastMsg
                            }
                          >
                            {item.lastMessage ||
                              item.user.role ||
                              "Start a conversation"}
                          </p>
                        )}
                      </div>

                      {/* Time */}
                      {item.time && (
                        <div
                          className={
                            styles.metaSection
                          }
                        >
                          <span
                            className={
                              styles.time
                            }
                          >
                            {formatTime(
                              item.time
                            )}
                          </span>
                        </div>
                      )}
                    </button>
                  )
                )}
              </div>
            ) : (
              <div
                className={
                  styles.emptyState
                }
              >
                <div
                  className={
                    styles.emptyStateIcon
                  }
                >
                  {searchTerm.trim()
                    ? "🔍"
                    : "💬"}
                </div>

                <p
                  className={
                    styles.emptyStateText
                  }
                >
                  {searchTerm.trim()
                    ? "No doctors found"
                    : "No chats yet"}
                </p>

                <p
                  className={
                    styles.emptyStateSubText
                  }
                >
                  {searchTerm.trim()
                    ? "Try searching with another name or specialty"
                    : "Start a conversation with a doctor or patient"}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* ================= CHAT WINDOW HEADER ================= */}
            <div
              className={
                styles.chatWindowHeader
              }
            >
              <button
                type="button"
                className={
                  styles.backBtn
                }
                onClick={
                  handleBackToList
                }
              >
                ←
              </button>

              <div
                className={
                  styles.chatWindowInfo
                }
              >
                <div
                  className={
                    styles.avatarWrapper
                  }
                >
                  <img
                    className={
                      styles.avatar
                    }
                    src={getUserImage(
                      selectedUser
                    )}
                    alt={getUserName(
                      selectedUser
                    )}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/uploads/default.jpg";
                    }}
                  />
                </div>

                <div>
                  <p
                    className={
                      styles.chatWindowName
                    }
                  >
                    {getUserName(
                      selectedUser
                    )}
                  </p>

                  <p
                    className={
                      styles.chatWindowRole
                    }
                  >
                    {selectedUser.role ||
                      "User"}
                  </p>
                </div>
              </div>
            </div>

            {/* ================= ERROR ================= */}
            {error && (
              <div
                style={{
                  padding: "8px 18px",
                  color: "#ff4d4f",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            {/* ================= MESSAGES ================= */}
            <div
              className={
                styles.messagesContainer
              }
            >
              {loadingMessages ? (
                <div
                  className={
                    styles.loadingContainer
                  }
                >
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  <div
                    className={
                      styles.emptyStateIcon
                    }
                  >
                    👋
                  </div>

                  <p
                    className={
                      styles.emptyStateText
                    }
                  >
                    No messages yet
                  </p>

                  <p
                    className={
                      styles.emptyStateSubText
                    }
                  >
                    Say hello to start the
                    conversation
                  </p>
                </div>
              ) : (
                messages.map(
                  (msg, index) => {
                    const mine =
                      isMyMessage(msg);

                    return (
                      <div
                        key={
                          msg._id ||
                          msg.id ||
                          index
                        }
                        className={`${
                          styles.messageRow
                        } ${
                          mine
                            ? styles.messageRowRight
                            : styles.messageRowLeft
                        }`}
                      >
                        <div
                          className={
                            styles.msgContentWrapper
                          }
                        >
                          <div
                            className={
                              styles.msgBubble
                            }
                          >
                            {/* Text */}
                            {getMessageText(
                              msg
                            ) && (
                              <p
                                className={
                                  styles.messageText
                                }
                              >
                                {getMessageText(
                                  msg
                                )}
                              </p>
                            )}

                            {/* Images */}
                            {Array.isArray(
                              msg.images
                            ) &&
                              msg.images
                                .length >
                                0 && (
                                <div
                                  className={
                                    styles.attachedImages
                                  }
                                >
                                  {msg.images.map(
                                    (
                                      image,
                                      imageIndex
                                    ) => {
                                      const imageUrl =
                                        typeof image ===
                                        "string"
                                          ? image
                                          : image?.url ||
                                            image?.path;

                                      return (
                                        <img
                                          key={
                                            imageIndex
                                          }
                                          className={
                                            styles.attachedImage
                                          }
                                          src={
                                            imageUrl
                                          }
                                          alt="attachment"
                                          onError={(
                                            e
                                          ) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                              )}
                          </div>

                          {/* Message time */}
                          <div
                            className={`${
                              styles.msgMeta
                            } ${
                              mine
                                ? styles.msgMetaRight
                                : styles.msgMetaLeft
                            }`}
                          >
                            <span>
                              {formatTime(
                                msg.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              )}

              <div
                ref={messagesEndRef}
              />
            </div>

            {/* ================= IMAGE PREVIEW ================= */}
            {images.length > 0 && (
              <div
                className={
                  styles.previewContainer
                }
              >
                {images.map(
                  (image, index) => (
                    <div
                      className={
                        styles.previewImageWrapper
                      }
                      key={index}
                    >
                      <img
                        className={
                          styles.previewImage
                        }
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={image.name}
                      />

                      <button
                        type="button"
                        className={
                          styles.removePreviewBtn
                        }
                        onClick={() =>
                          removeSelectedImage(
                            index
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {/* ================= INPUT ================= */}
            <form
              className={
                styles.chatInputContainer
              }
              onSubmit={
                handleSendMessage
              }
            >
              <div
                className={
                  styles.chatInputWrapper
                }
              >
                {/* Attachment */}
                <label
                  htmlFor="chat-image-input"
                  className={`${styles.actionBtn} ${styles.clipBtn}`}
                >
                  📎
                </label>

                <input
                  id="chat-image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className={
                    styles.hiddenFileInput
                  }
                  onChange={
                    handleImageChange
                  }
                />

                {/* Message */}
                <input
                  type="text"
                  className={
                    styles.chatInputField
                  }
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Type a message..."
                  disabled={sending}
                />

                {/* Send */}
                <button
                  type="submit"
                  className={
                    styles.actionBtn
                  }
                  disabled={
                    sending ||
                    (!message.trim() &&
                      images.length ===
                        0)
                  }
                >
                  {sending ? "…" : "➤"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
