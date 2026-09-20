const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('OAuth Email Verification Vulnerability #22', () => {
  it('should enforce verified email checks for GitHub OAuth', () => {
    const passportCode = fs.readFileSync(path.join(__dirname, '../config/passport.js'), 'utf8');
    expect(passportCode).to.include('hasVerifiedEmail');
    expect(passportCode).to.include('profile.emails.some((email) => email.verified)');
    expect(passportCode).to.include('Your email address must be verified with GitHub');
  });

  it('should enforce verified email checks for Google OAuth', () => {
    const passportCode = fs.readFileSync(path.join(__dirname, '../config/passport.js'), 'utf8');
    expect(passportCode).to.include('Your email address must be verified with Google');
  });
  
  it('should enforce verified email checks for Discord OAuth', () => {
    const passportCode = fs.readFileSync(path.join(__dirname, '../config/passport.js'), 'utf8');
    expect(passportCode).to.include('Your email address must be verified with Discord');
  });

  it('should enforce verified email checks for LinkedIn OAuth', () => {
    const passportCode = fs.readFileSync(path.join(__dirname, '../config/passport.js'), 'utf8');
    expect(passportCode).to.include('Your email address must be verified with LinkedIn');
  });
});
