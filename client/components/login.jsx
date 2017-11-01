const React = require('react');

const GoogleLoginImage = "https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png";
const FacebookLoginImage = "https://scontent-sea1-1.xx.fbcdn.net/v/t39.2365-6/17639236_1785253958471956_282550797298827264_n.png?oh=9318b5229829ffbbb3ce9261685906fc&oe=5A3AE5EA";

module.exports = class extends React.Component {
  render() {
    return (
      <section id="login">
        <div className="google">
          <a href="/auth/google">
            <img width="191px" src={GoogleLoginImage} alt="Sign in with Google" />
          </a>
        </div>
        <div className="facebook">
          <a href="/auth/facebook">
            <img width="191px" src={FacebookLoginImage} alt="Sign in with Facebook" />
          </a>
        </div>
      </section>
    );
  }
}
