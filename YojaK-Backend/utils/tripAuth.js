const uid = (userField) => (userField._id || userField).toString();

exports.isMember = (trip, userId) => {
  const id = userId.toString();
  return trip.members.some((m) => uid(m.user) === id);
};

exports.isOwnerOrEditor = (trip, userId) => {
  const id = userId.toString();
  return trip.members.some(
    (m) => uid(m.user) === id && (m.role === "owner" || m.role === "editor"),
  );
};

exports.isOwner = (trip, userId) => {
  const id = userId.toString();
  return trip.members.some((m) => uid(m.user) === id && m.role === "owner");
};
