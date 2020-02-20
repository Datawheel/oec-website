import React, {Component} from "react";
import {Link} from "react-router";
import {EMAIL} from "helpers/consts";

export default class Privacy extends Component {

  render() {

    return (
      <div className="privacy">

        <h1>Privacy Policy</h1>

        <p>
          At the OEC, accessible from oec.world, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains the type of information that is collected and recorded by OEC and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>

        <h2>Log Files</h2>
        <p>
          The OEC follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and is a part of hosting services&apos; analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and timestamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
        </p>

        <h2>Cookies and Web Beacons</h2>
        <p>
          Like any other website, the OEC uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
        </p>

        <h2>Google DoubleClick DART Cookie</h2>
        <p>
          Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to oec.world and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
        </p>

        <h2>Third Party Privacy Policies</h2>
        <p>
          The OEC&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>

        <h2>Children&apos;s Information</h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
        </p>
        <p>
          The OEC does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
        </p>

        <h2>Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its <Link to="/en/resources/terms">Terms and Conditions</Link>.
        </p>

      </div>
    );
  }

}
