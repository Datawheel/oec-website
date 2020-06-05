import React from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import {FAQ} from "helpers/about";

class AboutFAQ extends React.Component {
  state = {};
  render() {
    const {t} = this.props;
    FAQ.questions.map(d => d.answer.map(k => console.log(k)));
    return (
      <div className="about-faq">
        <div className="faq-info">
          <div className="info-title">{t(FAQ.title)}</div>
        </div>
        <div className="faq-content">
          {FAQ.questions.map((d, k) =>
            <div className="question" key={k}>
              <div className="question-title">{t(d.question)}</div>
              <div className="question-answer">
                {d.answer.map(
                  (h, i) =>
                    h.type === "paragraph"
                      ? <p
                        className={"text"}
                        key={i}
                        dangerouslySetInnerHTML={{__html: t(h.text)}}
                      />
                      : <div className="text-link">
                        <a href={h.href}>
                          {t(h.text)}
                        </a>
                      </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(connect()(AboutFAQ));
