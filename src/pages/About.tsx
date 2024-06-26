import Wrapper from "../sections/Wrapper";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import avatarImage from "../assets/avatarImage.jpg";

function About() {
  return (
    <div className="profile">
      <img src={avatarImage} alt="" className="profile-image" />
      <h2 className="profile-text">Hi I am Rayhans Najib Al-Farouq</h2>
      <h2 className="profile-text">The creator of this simple pokedex</h2>
      <h4 className="profile-text">
        This project was created to add to my project
      </h4>
      <div className="profile-links">
        <a href="https://github.com/rayhans358">
          <FaGithub />
        </a>
        <a href="https://www.instagram.com/rayhans_najib/">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com/in/rayhansnajib/">
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
}

export default Wrapper(About);
