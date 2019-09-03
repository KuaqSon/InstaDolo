import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PacmanLoader from "react-spinners/PacmanLoader";
import "react-toastify/dist/ReactToastify.css";
import "./Downloader.css";

const enpoint = "https://moneyfluapi.herokuapp.com/insta/image-urls-v3";
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
    result_urls: [],
    post_title: "",
    loading: false
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

    self.setState({ loading: true });

    axios
      .get(enpoint, {
        params: {
          post_url: link
        }
      })
      .then(function(response) {
        const { data } = response;

        if (!data) {
          toast.error("Failed!");
          self.setState({ loading: false });
        } else {
          const { isError, message } = data;

          if (!isError) {
            const {
              resp: { srcs, title }
            } = data;
            toast.success("Yayyy, Get image successfully!");

            self.setState({
              result_urls: srcs,
              post_title: title,
              loading: false
            });
          } else {
            self.setState({ loading: false });
            toast.error(message || "Failed!");
          }
        }
      })
      .catch(function(error) {
        self.setState({ loading: false });
        toast.error("Failed!");
        console.log(error);
      });
  };

  saveFileFromUrl = (url, title) => {
    const tit = (
      title.replace(/[^\w\s]/gi, "") ||
      Math.random()
        .toString(36)
        .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15)
    )
      .replace(/\s+/g, "_")
      .toLocaleLowerCase();

    const fileName = tit + (url.indexOf(".mp4") > 0 ? ".mp4" : ".jpg");

    try {
      axios({
        url: url,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      });
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  render() {
    const { link, result_urls, post_title, loading } = this.state;
    // const cardClassName = `card card--${
    //   gradientBackgroundTypes[Math.floor(Math.random() * 9)]
    // }`;
    return (
      <div>
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
              {!loading && (
                <button className="btt" onClick={() => this.downloadImage()}>
                  Load Image
                </button>
              )}
              {loading && (
                <div style={{ marginLeft: "-24px", marginBottom: "24px" }}>
                  <PacmanLoader
                    sizeUnit={"px"}
                    size={24}
                    color={"#fa8072"}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          </div>
          <ToastContainer
            autoClose={2000}
            position="top-center"
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange={false}
            draggable
            pauseOnHover={false}
          />

          {result_urls &&
            result_urls.map(url => (
              <div
                className={`card card--${
                  gradientBackgroundTypes[Math.floor(Math.random() * 9)]
                }`}
                style={{ maxWidth: "480px" }}
                key={result_urls.indexOf(url)}
              >
                <div
                  className="card__image-container"
                  style={{ backgroundImage: `url(${url})` }}
                />
                <div className="card__caption">
                  <div>{post_title}</div>
                  <div className="card__type">
                    <a
                      onClick={() => this.saveFileFromUrl(url, post_title)}
                      className="cir-btn"
                      href="/"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default Downloader;
