
export const renderUsers = (req, res, users) => {
  res.render('users', { users });
};

export const downloadUsers = (req, res) => {
  res.download('./users.json');
};