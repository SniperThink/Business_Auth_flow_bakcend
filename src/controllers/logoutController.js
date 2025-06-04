function logout(req, res) {
  // Clear cookie (if JWT stored in cookie)
  res.clearCookie('token');


 
  res.json({ message: 'Logged out successfully' });
}

module.exports = { logout };
