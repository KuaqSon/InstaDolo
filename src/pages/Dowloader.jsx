import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PacmanLoader from "react-spinners/PacmanLoader";
import "react-toastify/dist/ReactToastify.css";
import "./Downloader.css";

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
    loading: false,
    can_clear: false
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
      .get(link)
      .then(function(response) {
        const { data } = response;

        if (!data) {
          toast.error("Failed!");
          self.setState({ loading: false });
        } else {
          const jsonObject = data
            .match(
              /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/
            )[1]
            .slice(0, -1);

          const results = JSON.parse(jsonObject);

          if (results !== null) {
            const {
              entry_data: { PostPage }
            } = results;

            const {
              graphql: { shortcode_media }
            } = PostPage[0];

            const {
              edge_sidecar_to_children,
              display_resources,
              edge_media_to_caption,
              is_video,
              video_url,
              owner: { full_name }
            } = shortcode_media;

            let srcs = [];

            if (is_video) {
              srcs.push({
                thumbnail: display_resources.pop().src,
                src: video_url
              });
            } else if (edge_sidecar_to_children) {
              srcs = edge_sidecar_to_children.edges.map(x => {
                const { display_resources, is_video, video_url } = x.node;

                const img_src = display_resources.pop().src;

                if (is_video) {
                  return {
                    thumbnail: img_src,
                    src: video_url
                  };
                } else {
                  return {
                    thumbnail: img_src,
                    src: img_src
                  };
                }
              });
            } else {
              const src = display_resources.pop().src;
              srcs.push({
                thumbnail: src,
                src: src
              });
            }

            let title = `${full_name} on Instagram: ${edge_media_to_caption
              .edges[0].node.text || ""}`;

            if (title.length > 100) {
              title = title.slice(0, 100);
            }

            toast.success("Yayyy, Get image successfully!");
            self.setState({
              result_urls: srcs,
              post_title: title,
              loading: false
            });
          } else {
            self.setState({ loading: false });
            toast.error("Failed!");
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

  onUrlInputChange = e => {
    const post_url = e.target.value;
    this.setState({
      link: post_url,
      can_clear: post_url !== ""
    });
  };

  clearUrlInput = () => {
    this.setState({
      link: "",
      can_clear: false
    });
  };

  render() {
    const { link, result_urls, post_title, loading, can_clear } = this.state;
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
                  onChange={e => this.onUrlInputChange(e)}
                  value={link}
                />
                {can_clear && (
                  <button
                    className="btt-clear"
                    onClick={() => this.clearUrlInput()}
                  >
                    Clear
                  </button>
                )}
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
            result_urls.map(result => (
              <div
                className={`card card--${
                  gradientBackgroundTypes[Math.floor(Math.random() * 9)]
                }`}
                style={{ maxWidth: "480px" }}
                key={result_urls.indexOf(result)}
              >
                <div
                  className="card__image-container"
                  style={{ backgroundImage: `url(${result.thumbnail})` }}
                />
                <div className="card__caption">
                  <div>{post_title}</div>
                  <div className="card__type">
                    <div
                      onClick={() =>
                        this.saveFileFromUrl(result.src, post_title)
                      }
                      className="cir-btn disable-select"
                    >
                      Download
                    </div>
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
