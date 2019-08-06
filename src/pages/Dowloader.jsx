import React, { Component } from "react";
import "./Downloader.css";

class Downloader extends Component {
  state = {
    link: ""
  };

  downloadImage = () => {
    const { link } = this.state;

    if (!link) return;

  };

  render() {
    const { link } = this.state;
    return (
      <div className="downloader-container">
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
              Download
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Downloader;
