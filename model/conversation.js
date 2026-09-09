
const mongoose = require("mongoose");

const conversationMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      default: null,
    },

    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      default: "",
    },

    text: {
      type: String,
      default: "",
    },

    html: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    // Useful for Gmail threading
    inReplyTo: {
      type: String,
      default: null,
    },

    references: {
      type: String,
      default: null,
    },
  },
  {
    _id: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    // Owner of the conversation
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },

    // Campaign this conversation originated from
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaigns",
      default: null,
      index: true,
    },

    // Contact/subscriber associated with the conversation
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // The specific mailbox that sent/received this conversation
    mailboxId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // Email address of the lead/contact
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Contact name
    contactName: {
      type: String,
      default: "",
    },

    // Current conversation subject
    subject: {
      type: String,
      default: "",
    },

    // Gmail/Email thread identifier
    threadId: {
      type: String,
      default: null,
      index: true,
    },

    // Used to prevent processing the same conversation incorrectly
    status: {
      type: String,
      enum: ["unread", "read", "replied", "closed"],
      default: "unread",
      index: true,
    },

    // Whether the latest message came from the contact
    awaitingReply: {
      type: Boolean,
      default: false,
    },

    // Conversation messages
    messages: {
      type: [conversationMessageSchema],
      default: [],
    },

    // Useful for sorting the unified inbox
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Number of inbound replies
    replyCount: {
      type: Number,
      default: 0,
    },

    // Number of outbound replies
    outboundCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


// Useful compound index for finding a conversation quickly
conversationSchema.index({
  userId: 1,
  contactEmail: 1,
});

conversationSchema.index({
  userId: 1,
  mailboxId: 1,
  threadId: 1,
});


// Prevent duplicate inbound messages
conversationSchema.index(
  {
    userId: 1,
    "messages.messageId": 1,
  },
  {
    sparse: true,
  }
);


module.exports = mongoose.model(
  "Conversations",
  conversationSchema
);
