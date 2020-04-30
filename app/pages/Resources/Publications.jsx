import React, {Component} from "react";
import Helmet from "react-helmet";

export default class Publications extends Component {
  render() {
    const information = {
      title: "Why Information Grows",
      subtitle: "The Evolution of Order, from Atoms to Economies",
      author: "César Hidalgo",
      abstract: "What is economic growth? And why, historically, has it occurred in only a few places? Previous efforts to answer these questions have focused on institutions, geography, finances, and psychology. But according to MIT's antidisciplinarian César Hidalgo, understanding the nature of economic growth demands transcending the social sciences and including the natural sciences of information, networks, and complexity. To understand the growth of economies, Hidalgo argues, we first need to understand the growth of order.",
      link: "https://www.amazon.com/Why-Information-Grows-Evolution-Economies/dp/0465048994/ref=sr_1_1?ie=UTF8&qid=1435945119&sr=8-1&keywords=why+information+grows",
      preview: "information.png"
    };
    const atlas = {
      title: "The Atlas of Economic Complexity",
      subtitle: "Mapping Paths to Prosperity",
      authors: ["Ricardo Hausmann", "César A. Hidalgo", "Sebastián Bustos", "Michele Coscia", "Sarah Chung", "Juan Jimenez", "Alexander Simoes", "Muhammed A. Yildirim"],
      quotes: [
        {quote: "Emphasizing that not all products are the same for development is a significant departure from the establishment.", author: "Changyong Rhee, Chief Economist", from: "Asian Development Bank (Cambridge, MA 2011)"},
        {quote: "The ECI can play a very important role. It can help identify the role of developing countries.", author: "Justin Lin, Chief Economist", from: "World Bank (Cambridge, MA 2011)"}
      ],
      previews: [
        {title: "Revised 2014", preview: "atlas2014.jpg"},
        {title: "Original 2011", preview: "atlas.png"}
      ],
      link: "https://www.amazon.com/Atlas-Economic-Complexity-Mapping-Prosperity/dp/0262525429/ref=sr_1_1?s=books&ie=UTF8&qid=1440535970&sr=1-1&keywords=atlas+of+economic+complexity&pebp=1440535985572&perid=0HN41KMX8PH1JSFPDB35",
      downloads: [
        {title: "Full Version", size: "364 pages (85.7 MB)", pdf: "AtlasOfEconomicComplexity.pdf"},
        {title: "Part I: Why, What and How & Rankings", size: "91 pages (8.2 MB)", pdf: "AtlasOfEconomicComplexity_Part_I.pdf"},
        {title: "Part II: Country Pages", size: "271 pages (75.4 MB)", pdf: "AtlasOfEconomicComplexity_Part_II.pdf"}
      ]
    };
    const papers = [
      {
        name: "Complex economic activities concentrate in large cities",
        link: "https://www.nature.com/articles/s41562-019-0803-3",
        year: "2020",
        author:
          "Pierre-Alexandre Balland, Cristian Jara-Figueroa, Sergio G. Petralia, Mathieu P. A. Steijn, David L. Rigby and César A. Hidalgo",
        abstract:
          "Human activities, such as research, innovation and industry, concentrate disproportionately in large cities. The ten most inno- vative cities in the United States account for 23% of the national population, but for 48% of its patents and 33% of its gross domestic product. But why has human activity become increasingly concentrated? Here we use data on scientific papers, patents, employment and gross domestic product, for 353 metropolitan areas in the United States, to show that the spatial concentration of productive activities increases with their complexity. Complex economic activities, such as biotechnology, neurobiology and semiconductors, concentrate disproportionately in a few large cities compared to less--complex activities, such as apparel or paper manufacturing. We use multiple proxies to measure the complexity of activities, finding that com- plexity explains from 40% to 80% of the variance in urban concentration of occupations, industries, scientific fields and tech- nologies. Using historical patent data, we show that the spatial concentration of cutting-edge technologies has increased since 1850, suggesting a reinforcing cycle between the increase in the complexity of activities and urbanization. These findings sug- gest that the growth of spatial inequality may be connected to the increasing complexity of the economy.",
        img: "complex-economic-activities-concentrate-in-large-cities.png",
        pdf: "complex-economic-activities-concentrate-in-large-cities.pdf",
        chicago: "Pierre-Alexandre Balland, Cristian Jara-Figueroa, Sergio G. Petralia, Mathieu P. A. Steijn, David L. Rigby and César A. Hidalgo. “Complex economic activities concentrate in large cities”. Nature Human Behaviour volume 4 (2020): 248–254. Accessed April 29, 2020. https://doi.org/10.1038/s41562-019-0803-3"
      },
      {
        name:
          "Bilateral relatedness: knowledge diffusion and the evolution of bilateral trade",
        link: "https://link.springer.com/article/10.1007/s00191-019-00638-7",
        year: "2019",
        author: "Bogang Jun, Aamena Alshamsi, Jian Gao, César A. Hidalgo",
        abstract:
          "During the last two decades, two important contributions have reshaped our understanding of international trade. First, countries trade more with those with whom they share history, language, and culture, suggesting that trade is limited by information frictions. Second, countries are more likely to start exporting products that are related to their current exports, suggesting that shared capabilities and knowledge diffusion constrain export diversification. Here, we join both of these streams of literature by developing three measures of bilateral relatedness and using them to ask whether the destinations to which a country will increase its exports of a product are predicted by these forms of relatedness.",
        img:
          "bilateral-relatedness-knowledge-diffusion-and-the-evolution-of-bilateral-trade.png",
        pdf:
          "bilateral-relatedness-knowledge-diffusion-and-the-evolution-of-bilateral-trade.pdf",
        chicago: "Bogang Jun, Aamena Alshamsi, Jian Gao, César A. Hidalgo. “Bilateral relatedness: knowledge diffusion and the evolution of bilateral trade.” Journal of Evolutionary Economics (2019). Accessed April 29, 2020. https://doi.org/10.1007/s00191-019-00638-7",
      },
      {
        name:
          "The role of industry-specific, occupation-specific, and location-specific knowledge in the growth and survival of new firms",
        link: "https://www.pnas.org/content/115/50/12646",
        year: "2018",
        author: "C. Jara-Figueroa, Bogang Jun, Edward L. Glaeser, César A. Hidalgo",
        abstract:
          "How do regions acquire the knowledge they need to diversify their economic activities? How does the migration of workers among firms and industries contribute to the diffusion of that knowledge? Here we measure the industry-, occupation-, and location-specific knowledge carried by workers from one establishment to the next, using a dataset summarizing the individual work history for an entire country. We study pioneer firms—firms operating in an industry that was not present in a region—because the success of pioneers is the basic unit of regional economic diversification. We find that the growth and survival of pioneers increase significantly when their first hires are workers with experience in a related industry and with work experience in the same location, but not with past experience in a related occupation. We compare these results with new firms that are not pioneers and find that industry-specific knowledge is significantly more important for pioneer than for nonpioneer firms. To address endogeneity we use Bartik instruments, which leverage national fluctuations in the demand for an activity as shocks for local labor supply. The instrumental variable estimates support the finding that industry-specific knowledge is a predictor of the survival and growth of pioneer firms. These findings expand our understanding of the micromechanisms underlying regional economic diversification.",
        img: "role-of-ind-occ-geo-specific-knowledge-in-new-firm-survival-pnas.png",
        pdf: "role-of-ind-occ-geo-specific-knowledge-in-new-firm-survival-pnas.pdf",
        chicago: "C. Jara-Figueroa, Bogang Jun, Edward L. Glaeser, César A. Hidalgo. “The role of industry-specific, occupation-specific, and location-specific knowledge in the growth and survival of new firms.” PNAS December 11, 2018 115 (50), 2018: 12646-12653. Accessed April 29, 2020. https://doi.org/10.1073/pnas.1800475115",
      },
      {
        name: "Economic Complexity: From Useless to Keystone",
        link: "https://www.nature.com/articles/nphys4337",
        year: "2018",
        author: "César A. Hidalgo",
        abstract:
          "Technological innovation seems to be dominated by chance. But a new mathematical analysis suggests we might be able to anticipate when seemingly useless technologies become keystones of more complex environments.",
        img: "from-useless-to-keystone.png",
        pdf: "from-useless-to-keystone.pdf",
        chicago: "César A. Hidalgo “From useless to keystone.” Nature Phys 14, (2018): 9–10. Accessed April 29, 2020. https://doi.org/10.1038/nphys4337",
      },
      {
        name: "The Principle of Relatedness",
        link: "https://link.springer.com/chapter/10.1007/978-3-319-96661-8_46",
        year: "2018",
        author:
          "César A. Hidalgo, Pierre-Alexandre Balland, Ron Boschma, Mercedes Delgado, Maryann Feldman, Koen Frenken, Edward Glaeser, Canfei He, Dieter F. Kogler, Andrea Morrison, Frank Neffke, David Rigby, Scott Stern, Siqi Zheng, Shengjun Zhu",
        abstract:
          "The idea that skills, technology, and knowledge, are spatially concentrated, has a long academic tradition. Yet, only recently this hypothesis has been empirically formalized and corroborated at multiple spatial scales, for different economic activities, and for a diversity of institutional regimes. The new synthesis is an empirical principle describing the probability that a region enters—or exits—an economic activity as a function of the number of related activities present in that location. In this paper we summarize some of the recent empirical evidence that has generalized the principle of relatedness to a fact describing the entry and exit of products, industries, occupations, and technologies, at the national, regional, and metropolitan scales. We conclude by describing some of the policy implications and future avenues of research implied by this robust empirical principle.",
        img: "principle-of-relatedness.png",
        pdf: "Hidalgo2018_Chapter_ThePrincipleOfRelatedness.pdf",
        chicago: "César A. Hidalgo, Pierre-Alexandre Balland, Ron Boschma, Mercedes Delgado, Maryann Feldman, Koen Frenken, Edward Glaeser, et al. “The Principle of Relatedness.” In: Morales A., Gershenson C., Braha D., Minai A., Bar-Yam Y. (eds) Unifying Themes in Complex Systems IX. ICCS (2018) Springer Proceedings in Complexity. Accessed April 29, 2020. https://doi.org/10.1007/978-3-319-96661-8_46"},
      {
        name:
          "Optimal diversification strategies in the networks of related products and of related research areas",
        link: "https://www.nature.com/articles/s41467-018-03740-9",
        year: "2018",
        author: "Aamena Alshamsi, Flávio L. Pinheiro, César A. Hidalgo",
        abstract:
          "Countries and cities are likely to enter economic activities that are related to those that are already present in them. Yet, while these path dependencies are universally acknowledged, we lack an understanding of the diversification strategies that can optimally balance the development of related and unrelated activities. Here, we develop algorithms to identify the activities that are optimal to target at each time step. We find that the strategies that minimize the total time needed to diversify an economy target highly connected activities during a narrow and specific time window. We compare the strategies suggested by our model with the strategies followed by countries in the diversification of their exports and research activities, finding that countries follow strategies that are close to the ones suggested by the model. These findings add to our understanding of economic diversification and also to our general understanding of diffusion in networks.",
        img: "optimal-diversification-strategies-in-networks.png",
        pdf: "optimal-diversification-strategies-in-networks.pdf",
        chicago: "Alshamsi, A., Pinheiro, F.L. & Hidalgo, C.A. “Optimal diversification strategies in the networks of related products and of related research areas.” Nat Commun 9, 1328 (2018). https://doi.org/10.1038/s41467-018-03740-9",
      },
      {
        name:
          "The mobility of displaced workers: How the local industry mix affects job search",
        link: "https://www.sciencedirect.com/science/article/pii/S0094119018300767",
        year: "2018",
        author: "Frank Neffke, Anne Otto, César A. Hidalgo",
        abstract:
          "Are there Marshallian externalities in job search? We study how workers who lose their jobs in establishment closures in Germany cope with their loss of employment. About a fifth of these displaced workers do not return to social-security covered employment within the next three years. Among those who do get re-employed, about two-thirds leave their old industry and one-third move out of their region. However, which of these two types of mobility responses workers will choose depends on the local industry mix in ways that are suggestive of Marshallian benefits to job search. In particular, large concentrations of one’ s old industry make finding new jobs easier: in regions where the pre-displacement industry is large, displaced workers suffer relatively small earnings losses and find new work faster. In contrast, large local industries skill-related to the pre-displacement industry increase earnings losses but also protect against long-term unemployment. Analyzed through the lens of a job-search model, the exact spatial and industrial job-switching patterns reveal that workers take these Marshallian externalities into account when deciding how to allocate search efforts among industries.",
        img: "mobility-displaced-workers.png",
        pdf:
          "The-mobility-of-displaced-workers-How-the-local-industry-mix-affects-job-search.pdf",
        chicago: "Frank Neffke, Anne Otto, César A. Hidalgo. “The mobility of displaced workers: How the local industry mix affects job search.” Journal of Urban Economics Volume 108 (2018): 124-140. Accessed April 29, 2020. https://doi.org/10.1016/j.jue.2018.09.006",
      },
      {
        name: "Linking Economic Complexity, Institutions and Income Inequality",
        link: "https://www.sciencedirect.com/science/article/abs/pii/S0305750X15309876",
        year: "2017",
        author:
          "Dominik Hartmann, Miguel R. Guevara, Cristian Jara-Figueroa, Manuel Aristarán, César A. Hidalgo",
        abstract:
          "A country’s mix of products predicts its subsequent pattern of diversification and economic growth. But does this product mix also predict income inequality? Here we combine methods from econometrics, network science, and economic complexity to show that countries exporting complex products—as measured by the Economic Complexity Index—have lower levels of income inequality than countries exporting simpler products. Using multivariate regression analysis, we show that economic complexity is a significant and negative predictor of income inequality and that this relationship is robust to controlling for aggregate measures of income, institutions, export concentration, and human capital.",
        img: "pgi-paper.png",
        pdf: "LinkingEconomicComplexityInstitutionsAndIncomeInequality.pdf",
        chicago: "Dominik Hartmann, Miguel R. Guevara, Cristian Jara-Figueroa, Manuel Aristarán, César A. Hidalgo. “Linking Economic Complexity, Institutions, and Income Inequality”. World Development Volume 93 (2017): 75-93. Accessed April 29, 2020. https://doi.org/10.1016/j.worlddev.2016.12.020",
      },
      {
        name: "The structural constraints of income inequality in Latin America",
        link: "https://arxiv.org/abs/1701.03770",
        year: "2017",
        author:
          "Dominik Hartmann, Cristian Jara-Figueroa, Miguel Guevara, Alex Simoes, César A. Hidalgo",
        abstract:
          "Recent work has shown that a country's productive structure constrains its level of economic growth and income inequality. In this paper, we compare the productive structure of countries in Latin American and the Caribbean (LAC) with that of China and other High-Performing Asian Economies (HPAE) to expose the increasing gap in their productive capabilities. Moreover, we use the product space and the Product Gini Index to reveal the structural constraints on income inequality. Our network maps reveal that HPAE have managed to diversify into products typically produced by countries with low levels of income inequality, while LAC economies have remained dependent on products related with high levels of income inequality. We also introduce the Xgini, a coefficient that captures the constraints on income inequality imposed by the mix of products a country makes. Finally, we argue that LAC countries need to emphasize a smart combination of social and economic policies to overcome the structural constraints for inclusive growth.",
        img: "structuralconstraintslatam.png",
        chicago: "Dominik Hartmann, Cristian Jara-Figueroa, Miguel Guevara, Alex Simoes, César A. Hidalgo. “The structural constraints of income inequality in Latin America.” Cornell University (2015). Accessed April 29, 2020. https://arxiv.org/abs/1701.03770v2",
      },
      {
        name:
          "Diversification and Sophistication of Exports: An Application of the Product Space to Brazilian Data",
        link:
          "http://www.bnb.gov.br/documents/80223/1095809/5.pdf/9a03d177-e453-4cf4-98ca-a2bcc35b05cf",
        year: "2015",
        author: "Elton Eduardo Freitas, Emília Andrade Paiva",
        abstract:
          "The search to identify factors that might explain the great heterogeneity in economic development and the quality of life of countries or regions always challenged social scientists. This is particularly important in Brazil, a country characterized by huge and persistent inequalities. One of the most striking faces of Brazilian inequality is regional inequality, with the South and Southeast regions concentrating most of the economic activity and income and providing the best levels of education, health, infrastructure and quality of life. As an alternative approach in the debate about the differences in growth patterns between countries, the Product Space methodology use export data to establish associations for identifying new products that can leverage the economic development of each locality, considering what it already exports. The Product Space methodology was applied to foreign trade data of Brazilian municipalities. The paper analyzes the evolution of Brazilian exports and sophistication in the period 2002-2014, in order to also identify whether there is evidence of spatial autocorrelation in the level of sophistication of the municipalities. From the exploratory analysis of spatial data exports, diversity and sophistication in all Brazilian municipalities, this paper contributes to the debate about regional inequality in Brazil.",
        img: "brazilproductspace.png",
        chicago: "Elton Eduardo Freitas, Emília Andrade Paiva. “Diversification and sophistication of exports: an application of the product space to brazilian data”. Revista Economica do Nordeste (2015). Accessed April 29, 2020. https://ren.emnuvens.com.br/ren/article/view/192",
      },
      {
        name:
          "Do we need another coffee house? The amenity space and the evolution of neighborhoods",
        link: "https://arxiv.org/abs/1509.02868",
        year: "2015",
        author: "C.A. Hidalgo, E. Castañer",
        abstract:
          "The Amenity Space, was built by using a dataset summarizing the precise location of millions of amenities, introducing a clustering algorithm to identify neighborhoods, and then using the identified neighborhoods to map the probability that two amenities will be co-located in one of them. The Amenity Space is used to build a recommender system that identifies the amenities missing in a neighborhood given its current pattern of specialization.",
        img: "amenityspace.png",
        chicago: "César A. Hidalgo, Elisa E. Castañer. “The Amenity Space and The Evolution of Neighborhoods.” Cornell University (2015). Accessed April 29, 2020. https://arxiv.org/abs/1509.02868v2",
      },
      {
        name: "Economic diversification: implications for Kazakhstan",
        link: "http://www.elgaronline.com/view/9781784715533.00014.xml",
        year: "2015",
        author: "J. Felipe, C.A. Hidalgo",
        abstract:
          "Over two decades since independence, upper-middle income Kazakhstan—a large, landlocked, sparsely populated but resource-rich country—remains an economy in transition.",
        img: "kazakhstan.png",
        chicago: `J. Felipe, C.A. Hidalgo. “Economic diversification: implications for Kazakhstan,“ in Development and Modern Industrial Policy in Practice (2015): 160–196. Accessed April 29, 2020. https://doi.org/10.4337/9781784715540.00014`,
      },
      {
        name:
          "Neighbors and the evolution of the comparative advantage of nations: Evidence of international knowledge diffusion?",
        link: "https://www.sciencedirect.com/science/article/pii/S0022199613001098",
        year: "2014",
        author: "D. Bahar, R. Hausmann, C.A. Hidalgo",
        abstract:
          "The literature on knowledge diffusion shows that knowledge decays strongly with distance. In this paper we document that the probability that a product is added to a country's export basket is, on average, 65% larger if a neighboring country is a successful exporter of that same product.",
        img: "neighbors.png",
        chicago: "D. Bahar, R. Hausmann, C.A. Hidalgo. “Neighbors and the evolution of the comparative advantage of nations: Evidence of international knowledge diffusion?” Journal of International Economics, Volume 92, Issue 1 (2014): 111-123. Accessed April 29, 2020. https://doi.org/10.1016/j.jinteco.2013.11.001",
      },
      {
        name:
          "The Dynamics of Nestedness Predicts the Evolution of Industrial Ecosystems",
        link: "http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0049393",
        year: "2012",
        author: "S. Bustos, C. Gomez, R. Hausmann, C.A. Hidalgo",
        abstract:
          "In economic systems, the mix of products that countries make or export has been shown to be a strong leading indicator of economic growth. Hence, methods to characterize and predict the structure of the network connecting countries to the products that they export are relevant for understanding the dynamics of economic development.",
        img: "nestedness.png",
        chicago: "S. Bustos, C. Gomez, R. Hausmann, C.A. Hidalgo. “The Dynamics of Nestedness Predicts the Evolution of Industrial Ecosystems.” PLoS One 7(11), 2012. Accessed April 29, 2020. https://doi.org/10.1371/journal.pone.0049393",
      },
      {
        name: "The network structure of economic output",
        link: "https://link.springer.com/article/10.1007/s10887-011-9071-4#page-1",
        year: "2011",
        author: "R. Hausmann, C.A. Hidalgo",
        abstract:
          "Much of the analysis of economic growth has focused on the study of aggregate output. Here, we deviate from this tradition and look instead at the structure of output embodied in the network connecting countries to the products that they export.",
        img: "networkstructure.png",
        chicago: "R. Hausmann, C.A.Hidalgo. “The network structure of economic output.” Journal of Economic Growth 16 (2011): 309–342. Accessed April 29, 2020. https://link.springer.com/article/10.1007/s10887-011-9071-4",
      },
      {
        name:
          "The Economic Complexity Observatory: An Analytical Tool for Understanding the Dynamics of Economic Development.",
        link:
          "https://www.researchgate.net/profile/Cesar_Hidalgo/publication/221605462_The_Economic_Complexity_Observatory_An_Analytical_Tool_for_Understanding_the_Dynamics_of_Economic_Development/links/54f472430cf24eb8794e8a6d.pdf",
        year: "2011",
        author: "A.J.G. Simoes, C.A. Hidalgo",
        abstract:
          "We introduce The Economic Complexity Observatory, a tool for helping users understand the evolution of countries' productive structures and trade partners. Here we bridge the gap of harnessing the raw computational power of cycling through thousands of entries of data with the analytical, decision making qualities of the human mind through the use of information visualization “apps”.",
        img: "oec.png",
        chicago: "Alexander J. G. Simoes and Cesar A. Hidalgo. “The Economic Complexity Observatory: An Analytical Tool for Understanding the Dynamics of Economic Development”. Association for the Advancement of Artificial Intelligence (2011). Accessed April 29, 2020. https://www.aaai.org/ocs/index.php/WS/AAAIW11/paper/viewPaper/3948",
      },
      {
        name: "Discovering Southern and East Africa’s Industrial Opportunities",
        link: "https://static1.squarespace.com/static/5759bc7886db431d658b7d33/t/5783bbd5f7e0aba104dd52f0/1468251113128/Hidalgo_AfricaTrade_Jan11_final_web.pdf",
        year: "2011",
        author: "C.A. Hidalgo",
        abstract:
          "What are Southern and East Africa’s industrial opportunities? In this article we explore this question by using the product space to study the productive structure of five Southern and East African countries: Kenya, Mozambique, Rwanda, Tanzania, and Zambia.",
        img: "africa.png",
        chicago: "Hidalgo, Cesar. “Discovering Southern and East Africa's Industrial Opportunities.” The German Marshall Fund of the United States Policy Paper Series (2011). Accessed April 29, 2020. https://static1.squarespace.com/static/5759bc7886db431d658b7d33/t/5783bbd5f7e0aba104dd52f0/1468251113128/Hidalgo_AfricaTrade_Jan11_final_web.pdf",
      },
      {
        name:
          "The Dynamics of Economic Complexity and the Product Space over a 42 year period",
        link:
          "http://www.hks.harvard.edu/centers/cid/publications/faculty-working-papers/cid-working-paper-no.-189",
        year: "2009",
        author: "C.A. Hidalgo",
        abstract:
          "How does the productive structure of countries' changes over time? In this paper we explore this question by combining techniques of networks science with 42 years of trade data and find that, while the Product Space remains relatively stable during this period, the dynamics of countries' productive structures is characterized by a few highly dynamic economies.",
        img: "42years.png",
        chicago: "Placeholder",
      },
      {
        name: "The Building Blocks of Economic Complexity",
        link: "http://www.pnas.org/content/106/26/10570.short",
        year: "2009",
        author: "C.A. Hidalgo, R. Hausmann",
        abstract:
          "For Adam Smith, wealth was related to the division of labor. As people and firms specialize in different activities, economic efficiency increases, suggesting that development is associated with an increase in the number of individual activities and with the complexity that emerges from the interactions between them.",
        img: "buildingblocks.png",
        chicago: "C.A.Hidalgo, R. Hausmann. “The building blocks of economic complexity”. Proceedings of the National Academy of Sciences of the United States of America. Vol.106 (26), 2009: 10570-10575. Accessed April 29, 2020. https://doi.org/10.1073/pnas.0900943106"
      },
      {
        name: "A Network View of Economic Complexity",
        link:
          "http://kms1.isn.ethz.ch/serviceengine/Files/ISN/97394/ichaptersection_singledocument/646EBB06-3D08-4A82-BB09-B473C23937A7/en/Ch_2.pdf",
        year: "2008",
        author: "C.A. Hidalgo, R. Hausmann",
        abstract:
          "Does the type of product a country exports matter for subsequent economic performance?",
        img: "networkview.png",
        chicago: "Placeholder"
      },
      {
        name: "The Product Space Conditions the Development of Nations",
        link: "https://www.sciencemag.org/content/317/5837/482.short",
        year: "2007",
        author: "C.A. Hidalgo, B. Klinger, A.-L. Barabási, R. Hausmann",
        abstract:
          "Economies grow by upgrading the products they produce and export. The technology, capital, institutions, and skills needed to make newer products are more easily adapted from some products than from others.",
        img: "psconditions.png",
        chicago: "C.A. Hidalgo, B. Klinger, A.-L. Barabási, R. Hausmann. “The Product Space Conditions the Development of Nations.” Science Vol. 317 (2007): 482-487. Accessed April 29, 2020. DOI: 10.1126/science.1144581"
      }
    ];

    return (
      <div className="publications">
        <Helmet title="Publications" />

        <div className="information">
          <div className="card">
            <div className="header">
              <a href={information.link} target="_blank" rel="noopener noreferrer">
                <h2>{information.title}</h2>
              </a>
              <span>by {information.author}</span>
            </div>
            <div className="content">
              <div className="text">
                <p className="subtitle">{information.subtitle}</p>
                <p className="abstract">{information.abstract}
                  <div>
                    <a href={information.link} target="_blank" rel="noopener noreferrer">Buy on Amazon</a>
                  </div>
                </p>
              </div>
              <div className="preview">
                <img src="/images/publications/information.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="atlas">
          <div className="card">
            <div className="header">
              <a href={atlas.link} target="_blank" rel="noopener noreferrer">
                <h2>{atlas.title}</h2>
              </a>
            </div>
            <div className="content">
              <div className="data">
                <h3>{atlas.subtitle}</h3>
                <div className="authors">
                  {atlas.authors.map(d => (
                    <h4>{d}</h4>
                  ))}
                </div>
                <div className="quotes">
                  {atlas.quotes.map(d => (
                    <div className="quote">
                      <span>{`"${d.quote}"`}</span>
                      <div>{`—${d.author}`}</div>
                      <div>{d.from}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="links">
                <div className="previews">
                  {atlas.previews.map(d => (
                    <div className="preview">
                      <h3>{d.title}</h3>
                      <img src={`/images/publications/${d.preview}`} alt="" />
                    </div>
                  ))}
                </div>
                <div className="downloads">
                  <h3>Downloads</h3>
                  {atlas.downloads.map(d => (
                    <div className="download">
                      <a href={`/pdf/${d.pdf}`} target="_blank" rel="noopener noreferrer">{d.title}</a>
                      <span>{` – ${d.size}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="papers">
          <h2> Research Papers </h2>

          {papers.map((d, k) =>
            <div className="paper" key={k}>
              <div className="preview">
                {d.pdf
                  ? <a href={`/pdf/${d.pdf}`} target="_blank" rel="noopener noreferrer" title="View PDF">
                    <img src={`/images/publications/${d.img}`} alt="paper-preview" />
                  </a>
                  : <img src={`/images/publications/${d.img}`} alt="paper-preview" />
                }
              </div>
              <div className="data">
                <h3>
                  <a href={d.link} target="_blank" rel="noopener noreferrer" className="name">
                    {`${d.name} (${d.year})`}
                  </a>
                </h3>
                <div className="info">
                  <h4 className="authors">{d.author}</h4>
                  <p className="abstract">{d.abstract}</p>
                </div>
                <div className="links">
                  {d.pdf &&
                    <a href={`/pdf/${d.pdf}`} target="_blank" rel="noopener noreferrer" title="Download PDF" className="link">
                      <img src="/images/icons/file/icon_pdf.png" alt="Download PDF" />
                    </a>
                  }
                  {d.link &&
                    <a href={d.link} target="_blank" rel="noopener noreferrer" className="link">
                      <img src="/images/icons/file/icon_link.png" alt="Download PDF" />
                    </a>
                  }
                </div>
                <div className="reference">
                  <p className="chicago">{d.chicago}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
