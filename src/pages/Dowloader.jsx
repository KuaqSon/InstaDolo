import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Downloader.css";

const enpoint = "https://moneyfluapi.herokuapp.com/insta/image-urls";
const gradientBackgroundTypes = [
  "normal",
  "water",
  "electric",
  "fire",
  "psychic",
  "dark",
  "grass",
  "ice",
  "fairy"
];

class Downloader extends Component {
  state = {
    link: "",
    result_url: "",
    post_title: ""
  };

  downloadImage = () => {
    const self = this;
    const { link } = this.state;

    if (!link) {
      toast.warning("Invalid post url!", {
        autoClose: 1000
      });
      return;
    }

    axios
      .post(enpoint, {
        post_url: link
      })
      .then(function(response) {
        const { data } = response;

        if (!data) {
          toast.error("Failed!");
        }

        const { isError, message } = data;

        if (!isError) {
          const {
            resp: { src_url, title }
          } = data;
          toast("Yayyy, Get image successfully!");

          self.setState({
            result_url: src_url,
            post_title: title
          });
        } else {
          toast.error(message || "Failed!");
        }
      })
      .catch(function(error) {
        toast.error("Failed!");
        console.log(error);
      });
  };

  render() {
    const { link, result_url, post_title } = this.state;
    const cardClassName = `card card--${
      gradientBackgroundTypes[Math.floor(Math.random() * 9)]
    }`;
    return (
      <div className="downloader-container">
        <div className="intro">
          <div className="app-name">Instagram downloader</div>
          <div className="author">By: Quang Son Nguyen</div>
        </div>
        <div className="link-panel">
          <div className="link-input">
            <label className="field a-field a-field_a3 page__field">
              <input
                className="field__input a-field__input"
                placeholder="..."
                onChange={e => this.setState({ link: e.target.value })}
                value={link}
              />
              <span className="a-field__label-wrap">
                <span className="a-field__label">Link to instagram post</span>
              </span>
            </label>
          </div>
          <div className="download-buttons">
            <button className="btt" onClick={() => this.downloadImage()}>
              Load Image
            </button>
          </div>
        </div>
        <ToastContainer
          autoClose={1500}
          position="top-center"
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange={false}
          draggable
          pauseOnHover={false}
        />
        {result_url && (
          // <div
          //   className="image-panel"
          //   style={{ backgroundImage: `url(${result_url})` }}
          // />

          <div className={cardClassName}>
            <div
              className="card__image-container"
              style={{ backgroundImage: `url(${result_url})` }}
            />
            <div className="card__caption">
              <div>{post_title}</div>
              <div className="card__type">
                <a href={result_url} target="_blank" className="cir-btn">
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Downloader;
