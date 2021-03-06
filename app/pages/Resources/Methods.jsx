import React, {Component} from 'react';
import Helmet from 'react-helmet';
import MathJax from 'react-mathjax2';
import {AnchorLink} from '@datawheel/canon-core';

export default class Methods extends Component {
	render() {
		const tableofcontents = [
			{content: 'introduction', title: 'Introduction'},
			{content: 'economic-complexity', title: 'What is Economic Complexity?'},
			{content: 'applications', title: 'What are some of the applications of Economic Complexity?'},
			{content: 'other-fields', title: 'How is Economic Complexity Related to Other Fields of Research?'},
			{content: 'division-labor', title: 'How is Economic Complexity Related to The Division of Labor?'},
			{content: 'uses', title: 'Who uses Economic Complexity methods?'},
			{content: 'relatedness', title: 'What is Relatedness?'},
			{content: 'calculate', title: 'How do you calculate Relatedness?'},
			{content: 'eci', title: 'What is the Economic Complexity Index (ECI)?'},
			{content: 'eci-intuituvely', title: 'How is the Economic Complexity Index calculated (intuitively)?'},
			{content: 'eci-technically', title: 'How is the Economic Complexity Index calculated (technically)?'},
			{content: 'eci-subnational', title: 'How is the Economic Complexity Index calculated for subnational data (technically)?'},
			{content: 'economic-growth', title: 'How Does Economic Complexity relate to Economic Growth, Inequality, and Sustainability?'},
			{content: 'references', title: 'References'}
		];
		const references = [
			{
				reference:
					'Acemoglu, D., Johnson, S. & Robinson, J. A. The colonial origins of comparative development: An empirical investigation. American economic review 91, 1369–1401 (2001).'
			},
			{
				reference:
					'Acemoglu, D. & Robinson, J. A. Why nations fail: The origins of power, prosperity, and poverty. (Crown Books, 2012).'
			},
			{
				reference:
					'North, D. C. Institutions, institutional change and economic performance. (Cambridge university press, 1990).'
			},
			{
				reference:
					'Romer, P. M. Endogenous Technological Change. Journal of Political Economy 98, S71–S102 (1990).'
			},
			{
				reference:
					'Romer, P. M. The Origins of Endogenous Growth. The Journal of Economic Perspectives 8, 3–22 (1994).'
			},
			{reference: 'Fukuyama, F. Trust: The Social Virtues and the Creation of Prosperity. (Free Press, 1995).'},
			{
				reference:
					'Knack, S. & Keefer, P. Does Social Capital Have an Economic Payoff? A Cross-Country Investigation. The Quarterly Journal of Economics 112, 1251–1288 (1997).'
			},
			{
				reference:
					'Knack, S. Social capital, growth and poverty: A survey of cross-country evidence. in The Role of Social Capital in Development: An Empirical Assessment (ed. Grootaert, C.) (Cambridge University Press, 2002).'
			},
			{
				reference:
					'Coleman, J. S. Social Capital in the Creation of Human Capital. American Journal of Sociology 94, S95–S120 (1988).'
			},
			{reference: 'Porter, M. E. The Competitive Advantage of Nations. Simon and Shuster (1990).'},
			{
				reference:
					'Hausmann, R. & Hidalgo, C. A. The network structure of economic output. Journal of Economic Growth 1–34 (2011).'
			},
			{
				reference:
					'Hidalgo, C. A., Klinger, B., Barabási, A.-L. & Hausmann, R. The Product Space Conditions the Development of Nations. Science 317, 482–487 (2007).'
			},
			{
				reference:
					'Hidalgo, C. A. et al. The Principle of Relatedness. in Unifying Themes in Complex Systems IX (eds. Morales, A. J., Gershenson, C., Braha, D., Minai, A. A. & Bar-Yam, Y.) 451–457 (Springer International Publishing, 2018).'
			},
			{
				reference:
					'Hidalgo, C. A. & Hausmann, R. The building blocks of economic complexity. PNAS 106, 10570–10575 (2009).'
			},
			{
				reference:
					'Hausmann, R. et al. The atlas of economic complexity: Mapping paths to prosperity. (MIT Press, 2014).'
			},
			{
				reference:
					'Hartmann, D., Guevara, M. R., Jara-Figueroa, C., Aristarán, M. & Hidalgo, C. A. Linking Economic Complexity, Institutions, and Income Inequality. World Development 93, 75–93 (2017).'
			},
			{
				reference:
					'Can, M. & Gozgor, G. The impact of economic complexity on carbon emissions: evidence from France. Environmental Science and Pollution Research 24, 16364–16370 (2017).'
			},
			{
				reference:
					'Neagu, O. The Link between Economic Complexity and Carbon Emissions in the European Union Countries: A Model Based on the Environmental Kuznets Curve (EKC) Approach. Sustainability 11, 4753 (2019).'
			},
			{
				reference:
					'Hidalgo, C. Why information grows: The evolution of order, from atoms to economies. (Basic Books, New York, 2015).'
			},
			{
				reference:
					'Neffke, F., Henning, M. & Boschma, R. How Do Regions Diversify over Time? Industry Relatedness and the Development of New Growth Paths in Regions. Economic Geography 87, 237–265 (2011).'
			},
			{
				reference:
					'Neffke, F. & Henning, M. Skill relatedness and firm diversification. Strategic Management Journal 34, 297–316 (2013).'
			},
			{
				reference:
					'Kogler, D. F., Rigby, D. L. & Tucker, I. Mapping Knowledge Space and Technological Relatedness in US Cities. European Planning Studies 21, 1374–1391 (2013).'
			},
			{
				reference:
					'Boschma, R., Balland, P.-A. & Kogler, D. F. Relatedness and technological change in cities: the rise and fall of technological knowledge in US metropolitan areas from 1981 to 2010. Ind Corp Change 24, 223–250 (2015).'
			},
			{
				reference:
					'Guevara, M. R., Hartmann, D., Aristarán, M., Mendoza, M. & Hidalgo, C. A. The research space: using career paths to predict the evolution of the research output of individuals, institutions, and nations. Scientometrics 109, 1695–1709 (2016).'
			},
			{
				reference:
					'Fritz, B. S. L. & Manduca, R. A. The Economic Complexity of US Metropolitan Areas. arXiv:1901.08112 [econ, q-fin] (2019).'
			},
			{
				reference:
					'Gao, J. & Zhou, T. Quantifying China’s regional economic complexity. Physica A: Statistical Mechanics and its Applications 492, 1591–1603 (2018).'
			},
			{
				reference:
					'Balland, P.-A. & Rigby, D. The Geography of Complex Knowledge. Economic Geography 93, 1–23 (2017).'
			},
			{
				reference:
					'Balland, P.-A. et al. Complex economic activities concentrate in large cities. Nat Hum Behav 1–7 (2020) doi:10.1038/s41562-019-0803-3.'
			},
			{
				reference:
					'Poncet, S. & de Waldemar, F. S. Economic Complexity and Growth. Revue économique 64, 495–503 (2013).'
			},
			{
				reference:
					'Chávez, J. C., Mosqueda, M. T. & Gómez-Zaldívar, M. Economic Complexity and Regional Growth Performance: Evidence from the Mexican Economy. The Review of Regional Studies 20.'
			},
			{
				reference:
					'Zhu, S. & Li, R. Economic complexity, human capital and economic growth: empirical research based on cross-country panel data. Applied Economics 49, 3815–3828 (2017).'
			},
			{
				reference:
					'Stojkoski, V., Utkovski, Z. & Kocarev, L. The Impact of Services on Economic Complexity: Service Sophistication as Route for Economic Growth. PLOS ONE 11, e0161633 (2016).'
			},
			{
				reference:
					'Zhu, S., Yu, C. & He, C. Export structures, income inequality and urban-rural divide in China. Applied Geography 115, 102150 (2020).'
			}
		];
		return (
			<div className="definitions">
				<Helmet title="Methods" />

				<h1>Methods</h1>

				<div className="table-of-contents">
					<ul>
						{tableofcontents.map((d) => (
							<AnchorLink
								key={d.content}
								to={d.content}
								className="content-table-item"
							>
								<li className="content-name">{d.title}</li>
							</AnchorLink>
						))}
					</ul>
				</div>

				<img src="/images/methods/rings_color.png" alt="rings"/>

				<div className="definitions-block">
					<a id={`introduction`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>Introduction</h2>

						<p>Why are some countries rich and others poor? For centuries, scholars have been working to identify the factors that explain differences in prosperity. Their work has taught us about the importance of institutions,<sup>1–3</sup> technology,<sup>4,5</sup> human capital, and social capital.<sup>6–9</sup> Yet, we have also learned that economic prosperity cannot be tied narrowly to single factors. In fact, differences between rich and poor countries are multifarious, and include numerous highly specific factors.<sup>10,11</sup> Hence, we need ways to capture international differences in development outcomes that are not narrowly focused on a single factor, but that consider “all of the above.”</p>

						<p>Economic complexity can help us understand the development of national and regional economies through measures focused on “all of the above.” Its methods use high resolution data on the activities that are present in locations to predict the development dynamics of countries, cities, and regions. These methods can predict the economic activities that a country, city, or region will enter or exit in the future,<sup>12,13</sup> as well as an economy’s expected level of income,<sup>14,15</sup> economic growth,<sup>14,15</sup> income inequality,<sup>16</sup> and emissions.<sup>17,18</sup></p>

						<p>In this section, we explain some of the basic ideas that shape the field of Economic Complexity.</p>
					</div>
				</div>

				<img src="/images/methods/product_connections_color-01.png" alt=""/>

				<div className="definitions-block">
					<a id={`economic-complexity`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>What is Economic Complexity?</h2>

						<p>Economic Complexity is both an academic field and a concept.</p>

						<p>As an academic field, Economic Complexity studies the geography and dynamics of economic activities using methods inspired in ideas from complex systems, networks, and computer science.</p>

						<p>What makes the field of Economic Complexity somehow unique, is that it studies the geography of activities using an outcomes based approach. That is, instead of trying to figure out what capabilities or factors drive an economy, it uses data on the geography of economic activities to infer the presence of bundles of capabilities.</p>
					</div>
				</div>

				<div className="definitions-block">
					<a id={`applications`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>What are some of the applications of Economic Complexity?</h2>

						<p>Economic complexity methods are used to predict and explain the dynamics of economic activities and of economic aggregates, such as income per capita. For example, using the concept of relatedness (e.g. the product space), one can take data on the products that a country exports, or the industries present in a city, and predict which products or industries are more likely to grow in the future.<sup>11,12</sup> What is good about these methods is that they do not make any strong assumptions about the capabilities or factors required to produce each product because they leverage the idea that similar economic activities require similar capabilities (without having to identify what these capabilities are). </p>

						<p>Similarly, metrics of Economic Complexity, such as the Economic Complexity Index, can be used to predict a country’s expected level of income,<sup>13,14</sup> economic growth,<sup>13,14</sup> income inequality,<sup>15</sup> and greenhouse gas emissions.<sup>16,17</sup> Measures of the complexity required to produce an activity also help explain the spatial concentration of economic activities (complex economic activities are more concentrated in space).<sup>18</sup></p>
					</div>
				</div>

				<img src="/images/methods/stacked_color-02.png" alt=""/>

				<div className="definitions-block">
					<a id={`other-fields`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>How is Economic Complexity Related to Other Fields of Research?</h2>

						<p>The field of Economic Complexity is closely related to other fields of study, such as Economic Geography, which has long focused on the geographic distribution of economic activity, and Network Science, since Economic Complexity uses methods developed originally in the Network Science and Complex Systems community.</p>
					</div>
				</div>

				<div className="definitions-block">
					<a id={`division-labor`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>How is Economic Complexity Related to The Division of Labor?</h2>

						<p>As a concept, Economic Complexity is related to the idea of the division of labor, or more specifically, the division of knowledge. Because individuals are limited in what they can know,<sup>15,19</sup> the only way economies can expand their knowledge is by dividing it up among many individuals. Complex products, like medical imaging devices or jet engines, require vast amounts of knowledge that can only be accumulated in large networks of people.</p>

						<p>The accumulation of knowledge in large professional networks is only possible in economies with good institutions, social capital, infrastructure, and education.<sup>19</sup> This adds credence to the idea that economic complexity measures gather evidence on “all of the above”.</p>
					</div>
				</div>

				<div className="definitions-block">
					<a id={`uses`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>Who uses Economic Complexity methods?</h2>

						<p>Outside academia, Economic Complexity methods are used by multilateral organizations and national development agencies focused on economic development, by export promotion agencies and shipping companies wanting to predict the evolution of international trade patterns, and by financial companies (to price bonds and other instruments, because of the ability of economic complexity to predict long term economic growth).</p>
					</div>
				</div>

				<img src="/images/methods/lines_trade-color.png" alt=""/>

				<div className="definitions-block">
					<a id={`relatedness`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>What is Relatedness?</h2>

						<p>Relatedness measures the “similarity” or “compatibility” between an economy and an activity. For instance, it can be used to estimate whether the export structure of Bulgaria is compatible with what is needed to export cars, or if the technologies in which Toulouse has patented in the past are compatible with patenting in a particular technology, such as liquid crystal displays. Relatedness can be used to predict the probability that a location will enter or exit an activity.</p>

						<p>Usually, scholars measure relatedness between a location and an economic activity to predict the probability that a region will enter or exit that activity in the future. The fact that the growth of an activity in a location is correlated with relatedness is known as <span className="highlighted">The Principle of Relatedness:</span><sup>13</sup> a statistical law that tells us that the probability that a location (a country, city, or region), enters an economic activity (e.g. a product, industry, technology), grows with the number of related activities present in a location. The principle of relatedness has been shown to be true for countries entering new products,<sup>12,15</sup> regions entering new industries,<sup>20,21</sup> cities patenting in new technologies,<sup>22,23</sup> and even universities publishing in new research areas.<sup>24</sup></p>
					</div>
				</div>

				<div className="definitions-block">
					<a id={`calculate`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>How do you calculate Relatedness?</h2>

						<p>
							Relatedness is usually calculated by looking at the percentage of related activities that
							are present in a location. Formally, let {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							be a matrix indicating the presence of activity {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'p'}</MathJax.Node>
							</MathJax.Context>{' '}
							in location {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'c'}</MathJax.Node>
							</MathJax.Context>{' '}
							, and let {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"\\phi_{pp'}"}</MathJax.Node>
							</MathJax.Context>{' '}
							be a measure of similarity, or proximity, between activities {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'p'}</MathJax.Node>
							</MathJax.Context>{' '}
							and {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"p'"}</MathJax.Node>
							</MathJax.Context>{' '}
							. Then, we can estimate the relatedness {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'w'}</MathJax.Node>
							</MathJax.Context>{' '}
							between location {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'c'}</MathJax.Node>
							</MathJax.Context>{' '}
							and activity {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'p'}</MathJax.Node>
							</MathJax.Context>{' '}
							as:
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>
									{"\\omega_{cp}=\\frac{\\sum_{c'}{M_{c'p}\\phi_{cc'}}}{\\sum_{c'} \\phi_{cc'}}"}
								</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							Similarly, we can estimate relatedness by looking at similar locations instead of similar
							activities.
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>
									{"\\omega_{cp}=\\frac{\\sum_{c'}{M_{c'p}\\phi_{cc'}}}{\\sum_{c'} \\phi_{cc'}}"}
								</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							Where {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"\\phi_{cc'}"}</MathJax.Node>
							</MathJax.Context>{' '}
							is a matrix of similarity between locations {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'c'}</MathJax.Node>
							</MathJax.Context>{' '}
							and {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"c'"}</MathJax.Node>
							</MathJax.Context>{' '}
							.
						</p>

						<p>
							Similarity metrics, such as {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"\\phi_{pp'}"}</MathJax.Node>
							</MathJax.Context>{' '}, are known as metrics of <span className="highlighted">proximity.</span> There are multiple ways to estimate proximity, using simple indicators such as conditional probabilities<sup>12</sup>, or more sophisticated indicators, such as the ratio between observed coincidences and those expected from an econometric model.<sup>20,21</sup>
						</p>
					</div>
				</div>

				<img src="/images/methods/prediction_line_color.png" alt=""/>

				<div className="definitions-block">
					<a id={`eci`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>What is the Economic Complexity Index (ECI)?</h2>

						<p>The Economic Complexity Index, or ECI, is a measure of an economy’s capacity which can be inferred from data connecting locations to the activities that are present in them. The Economic Complexity Index has been shown to predict important macroeconomic outcomes, including a country’s level of income,<sup>14,15</sup> economic growth,<sup>14,15</sup> income inequality,<sup>16</sup> and greenhouse gas emissions.<sup>17,18</sup> It has also been estimated using diverse data sources, such as trade data<sup>14,15</sup>, employment data,<sup>25</sup> stock market data,<sup>26</sup> and patent data.<sup>27</sup></p>

						<p>The Product Complexity Index, or PCI, is a measure of the complexity required to produce a product or engage in an economic activity. The Product Complexity Index is correlated with the spatial concentration of economic activities.<sup>28</sup></p>
					</div>
				</div>

				<div className="definitions-block">
					<a id={`eci-intuituvely`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>How is the Economic Complexity Index calculated (intuitively)?</h2>

						<p>Imagine being asked to grade a multiple choice exam in a language you have never heard. To help you grade the exam, the teacher gives you an answer key, but also informs you that you need to award more points to challenging questions. The teacher doesn’t have a key for that, so you need to infer the difficulty of questions directly from the student's answers?</p>

						<p>One way to start is to look at how many students answered each question correctly. Easy questions were probably answered correctly by most students, while difficult questions were probably answered correctly by only a few students. Yet, some students may be guessing their answers, so a correct answer means more if it is coming from a student that answered most questions correctly.</p>

						<p>This thought experiment should give you the basic intuition behind economic complexity. Now, think that instead of students you have economies (e.g. countries, cities, regions), and instead of questions you have economic activities (products, industries, technologies). Economic complexity is the idea that you can infer “how good of a student” an economy is by looking at the activities that it is able to develop successfully, and by looking at the other places where those activities are present.</p>
					</div>
				</div>

				<img src="/images/methods/stacked_color-01.png" alt=""/>

				<div className="definitions-block">
					<a id={`eci-technically`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>How is the Economic Complexity Index calculated (technically)?</h2>

						<p>
							The problem of estimating economic complexity is the problem of estimating both, the
							complexity of locations (e.g. countries, cities, regions) and that of the activities present
							in them (e.g. products, industries, technologies). The general idea is that the activities
							present, produced, or exported from a location, carry information about the complexity of
							that location, while the locations where an activity is present carry information about the
							complexity required to perform an activity. For instance, we can say that cities like San
							Francisco, Boston, and New York, are complex, because they are home to complex activities.
							Similarly, we can say that an activity like biotech or aerospace is complex, if it is found
							mostly in complex economies, like those of Boston and San Francisco.
						</p>

						<p>
							This circular argument can be translated into a general set of equations that can be used to
							estimate the complexity of economies.
						</p>

						<p>
							Formally, let the complexity {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K'}</MathJax.Node>
							</MathJax.Context>{' '}
							of a location {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'c'}</MathJax.Node>
							</MathJax.Context>{' '}
							(e.g. country or city) be {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{c}'}</MathJax.Node>
							</MathJax.Context>{' '}
							and the complexity {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K'}</MathJax.Node>
							</MathJax.Context>{' '}
							of an activity {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'p'}</MathJax.Node>
							</MathJax.Context>{' '}
							(e.g. product or industry) be {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{p}'}</MathJax.Node>
							</MathJax.Context>{' '}
							. Also, let {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							be a matrix summarizing the activities (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'p'}</MathJax.Node>
							</MathJax.Context>
							) present in location (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'c'}</MathJax.Node>
							</MathJax.Context>
							). Usually, {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							is defined as {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp} = 1'}</MathJax.Node>
							</MathJax.Context>{' '}
							when a location’s output in an activity is larger than what is expected for a location of
							the same size and an activity with the same total output. This can be done using an
							indicator such as a location’s Revealed Comparative Advantage (RCA) or Location Quotient
							(LQ).
						</p>

						<p>That is, we can define</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}=1\\: if\\:R_{cp}\\geq1'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>Where</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'R_{cp}=(X_{cp} X)/(X_c X_p )'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>and</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'X_c=\\sum_p X_{cp}'}</MathJax.Node>
							</MathJax.Context>, {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'X_p=\\sum_c X_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							and {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'X=\\sum_{cp} X_{cp}'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							Following this notation, the general assumption made by metrics of economic complexity is
							that:
						</p>

						<p className="formula">
							(i) The complexity of a location (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{c}'}</MathJax.Node>
							</MathJax.Context>
							) is a function (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'f'}</MathJax.Node>
							</MathJax.Context>
							) of the complexity (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{p}'}</MathJax.Node>
							</MathJax.Context>
							) of the activities present in it (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}'}</MathJax.Node>
							</MathJax.Context>
							), and
						</p>

						<p className="formula">
							(ii) The complexity of an activity (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{p}'}</MathJax.Node>
							</MathJax.Context>
							) is a function (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'g'}</MathJax.Node>
							</MathJax.Context>
							) of the complexity (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{c}'}</MathJax.Node>
							</MathJax.Context>
							) of the places where that activity is present (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}'}</MathJax.Node>
							</MathJax.Context>
							).
						</p>

						<p>
							This circular logic is equivalent to the following mathematical map.<sup>28</sup>
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_c = f (M_{cp},K_p),'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_p=g(M_{cp},K_c ),'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							Where {' '}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'f'}</MathJax.Node>
							</MathJax.Context>{' '}
							{''}
							and {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'c'}</MathJax.Node>
							</MathJax.Context>{' '}
							{''}
							are functions to be determined.
						</p>

						<p>
							These mappings imply that measures of the complexity of economies, or of economic
							activities, are solutions to self-consistent equations of the form:
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_c=f(M_{cp},g(M_{cp},K_c )),'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_p=g(M_{cp},f(M_{cp},K_p )),'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>Which in many occasions can be reduced—or approximated by—a linear equation of the form:</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"K_c=\\tilde{M}_{cc'} K_c,"}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"K_p=\\tilde{M}_{pp'} K_p,"}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							These equations imply that metrics of the complexity of economies, or of the activities
							present in them, are respectively, eigenvectors of matrices connecting related countries (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"M_{cc'}"}</MathJax.Node>
							</MathJax.Context>
							) or related products (
							<MathJax.Context input="tex">
								<MathJax.Node inline>{"M_{pp'}"}</MathJax.Node>
							</MathJax.Context>
							) (e.g. the Product Space). We note that the first set of equations provide a more general
							family of functions that includes functions that cannot be reduced to the linear forms, yet,
							they can provide results that are similar to those obtained by linear equations.
						</p>

						<p>
							These equations also tell us that measures of complexity are relative measures, since the
							complexity of a location or an activity can change because of changes in the entries for
							other locations or activities (other rows or columns in the {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'R_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							{''}
							or {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							{''}
							matrix).
						</p>

						<p>
							Using the above framework, we define the Economic Complexity Index of a location, or ECI, as
							the average of the Product Complexity Index, or PCI, of the activities present in it.
							Similarly, we define the Product Complexity Index of an activity, or PCI, as the average
							Economic Complexity Index, or ECI, of the locations where that activity is present. That is,
							we define the complexity of a location as the average complexity of its activities, and the
							complexity of an activity, as the average complexity of the places where that activity is
							present. Formally, the ECI formula is the solution to the system of equations:
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_c=\\frac{1}{M_c}  \\sum_p M_{cp} K_p,'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_p=\\frac{1}{M_p}  \\sum_c M_{cp} K_c,'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							Which, upon putting the second equation in the first one, is equivalent to diagonalizing the
							following matrix:
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>
									{"\\tilde{M}_{cc'}=\\sum_p \\frac{M_{cp} M_{c'p}}{M_{c} M_{p}}"}
								</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							Here {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_c=\\sum_p M_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							is the number of activities (or diversity) of a location and {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_p=\\sum_c M_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '}
							is the ubiquity of an activity (number of locations where it is present).
						</p>

						<p>
							Since Economic Complexity is a relative metric, the results are usually normalized using a
							Z-transform. That is:
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'ECI=\\frac{K_c - K_c}{\\sigma(K_c)},'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'PCI=\\frac{K_p - K_p}{\\sigma(K_p)},'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>
							Where {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{c}'}</MathJax.Node>
							</MathJax.Context>{' '}
							is the average of {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{c}'}</MathJax.Node>
							</MathJax.Context>{' '}
							and {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'\\sigma(K_c)'}</MathJax.Node>
							</MathJax.Context>{' '}
							is the standard deviation of {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'K_{c}'}</MathJax.Node>
							</MathJax.Context>.
						</p>

						<p></p>
					</div>
				</div>

				<div className="definitions-block">
					<a id={`eci-subnational`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>How is the Economic Complexity Index calculated for subnational data (technically)?</h2>

						<p>Since subnational level data varies in terms of the units of observation (provinces, municipalities, etc.), we combine PCIs calculated using international trade data, with presence absence matrices characterizing local data.</p>

						<p>Formally, we define subnational ECIs as:</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'ECI_c=\\frac{1}{M_c}  \\sum_p M_{cp} PCI_p'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>Here, we define {''}
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'M_{cp}'}</MathJax.Node>
							</MathJax.Context>{' '} using the following modified version of RCA:</p>

						<p className="formula">
							<MathJax.Context input="tex">
								<MathJax.Node inline>{'R_cp=\\frac{X_{cp}^{local}/X_c^{local}}{X_p^{world}/X^{world}}'}</MathJax.Node>
							</MathJax.Context>
						</p>

						<p>That is, we compare the share of an activity in a local unit (e.g. region, province), with the share of that activity in the world. This is to avoid having the most developed regions in a country appear to have comparative advantage in every product, and also, to make the ECI values obtained for subnational regions comparable with those of countries in the international datasets.</p>
					</div>
				</div>

				<img src="/images/methods/map_color.png" alt=""/>

				<div className="definitions-block">
					<a id={`economic-growth`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>How Does Economic Complexity relate to Economic Growth, Inequality, and Sustainability?</h2>

						<p>During the last decades a number of studies have documented relationships between economic complexity and important social and macroeconomic outcomes.</p>

						<p>The first string of studies focused on the relationship between economic complexity and economic growth. The paper that introduced the idea of economic complexity<sup>14</sup>, showed that economies with higher economic complexity, per unit of GDP per capita, grew faster. This finding was later confirmed and expanded in a subsequent book (The Atlas of Economic Complexity) and in various papers using international and subnational level data.<sup>29–32</sup> On average, scholars find that an increase of one standard deviation in economic complexity, at the same level of GDP per capita, is associated with an increase in annualized growth of between 4% to 7%. This is a strong effect, but it is important to keep in mind that an increase of one standard deviation in ECI is an extremely large effect (since ECI values, which are normalized, range usually between -2 and 2).</p>

						<p>More recently, people studying economic complexity have turned their attention to other topics, such as income inequality and environmental sustainability.</p>

						<p>In recent years we have learned that countries with higher levels of economic complexity tend to experience lower levels of income inequality,<sup>16,33</sup> and also, to produce a comparatively lower number of emissions.<sup>17,18</sup></p>

						<p>Together, the ability of economic complexity to predict economic growth, inequality, and lowered emissions, make it an interesting policy target for countries looking to foster inclusive development.</p>
					</div>
				</div>

				<div className="definitions-block">
					<a id={`references`} className="definitions-title-block-anchor" />
					<div className="definitions-content">
						<h2>References</h2>

						{references.map((d, k) => (
							<div className="reference">
								<span>{`${k + 1}.`}</span>
								<span>{d.reference}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}
