import React, { Component } from "react";
import "./Downloader.css";

class Downloader extends Component {
  onInputLinkChange = e => {
    const text = e.target.value;
  };

  render() {
    return (
      <div className="downloader-container">
        <div className="link-panel">
          <div className="link-input">
            <label className="field a-field a-field_a3 page__field">
              <input
                className="field__input a-field__input"
                placeholder="..."
                onChange={this.onInputLinkChange}
              />
              <span className="a-field__label-wrap">
                <span className="a-field__label">Link to instagram post</span>
              </span>
            </label>
          </div>

          <div className="download-buttons">
            <button type="button" className="btt">
              Download
            </button>
            <button type="button" className="btt">
              Paste from clipboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Downloader;
