const PasswordStrength = ({ password = '' }: { password: string }) => {
  const hasNumber = Boolean(/\d/.test(password));
  const hasUppercase = Boolean(/[A-Z]/.test(password));
  const hasLowercase = Boolean(/[a-z]/.test(password));
  const hasSpecialChar = Boolean(/[!@#$%^&*(),.?":{}|<>'_+\-=]/.test(password));
  let strength = 'none';

  if (hasNumber && hasUppercase && hasLowercase && hasSpecialChar) {
    strength = 'strong';
  } else if (
    (hasNumber && hasUppercase) ||
    (hasNumber && hasLowercase) ||
    (hasNumber && hasSpecialChar) ||
    (hasUppercase && hasLowercase) ||
    (hasUppercase && hasSpecialChar) ||
    (hasLowercase && hasSpecialChar)
  ) {
    strength = 'medium';
  } else if (hasNumber || hasUppercase || hasLowercase || hasSpecialChar) {
    strength = 'weak';
  }

  return (
    <div className={`password-strength password-strength--${strength}`}>
      <div>Weak</div>
      <div>Medium</div>
      <div>Strong</div>
    </div>
  );
};

export default PasswordStrength;
