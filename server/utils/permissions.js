const canDeleteMessage = (user, message) =>
  message.senderId.toString() === user._id.toString();
module.exports = { canDeleteMessage };
