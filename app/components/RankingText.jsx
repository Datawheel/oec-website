import React, { Component } from 'react';

class RankingText extends Component {
	render() {
		return (
			<div className="ranking-text">
				<h1 className="title">Dynamic Rankings</h1>
				<div className="about">
					<p>
						The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively,
						measures of the relative knowledge intensity of an economy or a product. ECI measures the
						knowledge intensity of an economy by considering the knowledge intensity of the products it
						exports. PCI measures the knowledge intensity of a product by considering the knowledge
						intensity of its exporters. This circular argument is mathematically tractable and can be used
						to construct relative measures of the knowledge intensity of economies and products (see {' '}
						<a href="/en/resources/methodology/" className="link" target="_blank" rel="noopener noreferrer">
							methodology section
						</a>{' '}
						for more details).
					</p>
					<p>
						ECI has been validated as a relevant economic measure by showing its ability to predict future
						economic growth (see {' '}
						<a
							href="http://www.pnas.org/content/106/26/10570.short"
							className="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							Hidalgo and Hausmann 2009
						</a>), and explain international variations in income inequality (see {' '}
						<a
							href="/pdf/LinkingEconomicComplexityInstitutionsAndIncomeInequality.pdf"
							className="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							Hartmann et al. 2017
						</a>).
					</p>
					<p>This page includes rankings using the Economic Complexity Index (ECI).</p>
				</div>
			</div>
		);
	}
}

export default RankingText;
