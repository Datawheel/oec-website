import React, {Component} from "react";

import AboutTeam from "../../components/AboutTeam";

export default class About extends Component {

  render() {

    const team = [
      {
        name: "Alexander Simoes",
        time: <span>2010 – Present</span>,
        description: <p>Alex is the lead developer on the Observatory project. He has been working in the Macro Connections group developing technologies to better inform policy and decision makers by equipping them with tools to make sense of large datasets. He is a co-founder of the MIT spin-off <a href="http://www.datawheel.us/" className="link" target="_blank">Datawheel</a>, a company specializing in building digital transformation tools at a large scale.</p>,
        img: "alexander_simoes.jpg",
        twitter: "https://twitter.com/ximoes",
        github: "https://github.com/alexandersimoes",
        linkedin: "https://www.linkedin.com/pub/alex-simoes/42/71a/728"
      },
      {
        name: "Dave Landry",
        time: <span>2012 – Present</span>,
        description: <p>Dave designed the 2013 version of the website, along with being co-author of the underlying visualization engine <a href="http://www.d3plus.org/" className="link" target="_blank">D3plus</a>. He continues to support the site with improvements to the front-end in both the visualizations and the overall navigation.</p>,
        img: "dave_landry.jpg",
        twitter: "https://twitter.com/davelandry",
        github: "https://github.com/davelandry",
        linkedin: "https://www.linkedin.com/in/davelandry/"
      },
      {
        name: "César Hidalgo",
        time: <span>2010 – Present</span>,
        description: <p>César is the Asahi Broadcast Corporation Career Development Professor and an Associate Professor at the MIT Media Lab. His work focuses on improving the understanding of systems using and developing concepts of complexity, evolution and network science.</p>,
        img: "cesar_hidalgo.jpg",
        twitter: "https://twitter.com/cesifoti",
        linkedin: "https://www.linkedin.com/pub/cesar-a-hidalgo/5/30a/a61"
      }
    ];

    const contributors = [
      {
        name: "Melissa Teng",
        time: "2015 – 2017",
        description: <p>Melissa led the 2015 redesign of the website, focusing on a humanist approach to data. She built on the site&apos;s visual identity and user experience, as well as supported some front-end development.</p>,
        img: "melissa_teng.png",
        twitter: "https://twitter.com/melisteng",
        github: "https://github.com/melteng",
        linkedin: "https://www.linkedin.com/in/mqteng/"
      },
      {
        name: "Eric Franco",
        time: "2012 – 2013",
        description: <p>Eric was responsible for maintaining the site and incorporating new data as it became available.</p>,
        img: "eric_franco.png",
        github: "https://github.com/ericjohnf",
        linkedin: "https://www.linkedin.com/in/ericjohnf"
      },
      {
        name: "Sarah Chung",
        time: "2011 – 2012",
        description: <p>Sarah worked on developing algorithms for cleaning the raw SITC bilateral trade used on the site.</p>,
        img: "sarah_chung.png",
        linkedin: "https://www.linkedin.com/in/sarahchung7/"
      },
      {
        name: "Crystal Noel",
        time: "2011 – 2012",
        description: <p>Crystal helped improve some of the original visualizations and code-base.</p>,
        img: "crystal_noel.png",
        twitter: "https://twitter.com/crystalMIT13"
      },
      {
        name: "Ali Almossawi",
        time: "2010 – 2011",
        description: <p>Ali was instrumental in the initial design, programming, and launch of The Observatory.</p>,
        img: "ali_almossawi.png",
        twitter: "https://twitter.com/alialmossawi",
        github: "https://github.com/almossawi",
        linkedin: "https://www.linkedin.com/in/almossawi"
      }
    ];

    return (
      <div className="about">

        <h1> About the Observatory </h1>

        <p> The Observatory of Economic Complexity is a tool that allows users to quickly compose a visual narrative about countries and the products they exchange. It was <a href="https://www.media.mit.edu/publications/the-observatory-designing-data__driven-decision-making-tools/" className="link" target="_blank" rel="noopener noreferrer">Alexander Simoes&apos; Master Thesis</a> in Media Arts and Sciences at the MIT Media Lab. </p>

        <p> The project was conducted at The MIT Media Lab <a href="http://macro.media.mit.edu/" className="link" target="_blank" rel="noopener noreferrer">Macro Connections</a> group (now Collective Learning). Alex&apos;s Advisor was <a href="https://chidalgo.com/" className="link" target="_blank" rel="noopener noreferrer">César A. Hidalgo</a>, principal investigator of Macro Connections. Since its creation in 2010, the development of The Observatory of Economic Complexity has been supported by The MIT Media Lab consortia for undirected research. </p>

        <p> For a history of the contributions to The Observatory of Economic Complexity, you can <a href="https://github.com/alexandersimoes/atlas_economic_complexity/network" className="link" target="_blank" rel="noopener noreferrer">view the project’s contributions timeline on Github</a>. A predecessor of the Observatory of Economic Complexity is the product space site, built by César Hidalgo as a graduate student at Notre Dame in 2007. </p>

        <p> If you would like more info on the OEC or to create a similar site for your country, state, or city, get in touch with us at <a href="mailto:oec@media.mit.edu" className="link" target="_blank" rel="noopener noreferrer">oec@media.mit.edu</a>. </p>

        <h2> Current Team </h2>

        <AboutTeam data={team} type={"team"} />

        <h2> Past Contributors </h2>

        <AboutTeam data={contributors} type={"contributors"} />
      </div>
    );
  }
}
