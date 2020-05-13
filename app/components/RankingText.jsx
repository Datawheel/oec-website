import React, {Component} from 'react';

class RankingText extends Component {
	render() {
		const {type, title, subtitleRev, subtitleDepth} = this.props;
		return (
			<div className="ranking-text">
				{type === 'static' && (
					<div>
						<h1 className="title">{title}</h1>
						<p className="italic">
							* Using exports data classified according the Harmonized System ({subtitleRev}) with a depth of {subtitleDepth} for countries with population of at least 1 million and exports of at least $1 billion, and products with world trade over 500 million.
						To explore different rankings and vary these parameters visit the {' '}
							<a
								href="/en/rankings/custom"
								className="link"
							>
								custom rankings section
								</a>.
						</p>
						<div className="about">
							<div className="paragraph">
								<p>
									The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product.
							</p>
								<p>
									ECI and PCI values are estimated directly from matrices summarizing the geography of economic activity, and can be calculated on demand.
							</p>
							</div>
							<div className="paragraph">
								<p>
									Formally, the complexity of location (ECI) is a function of the complexity of the activities present in it. Similarly, the complexity of an activity (PCI) is a function of the complexities of the locations where that activity is present.
							</p>
								<p>
									For details about {' '}
									<a
										href="/en/resources/methodology#relatedness"
										className="link"
									>
										Relatedness
								</a>{' '} and {' '}
									<a
										href="/en/resources/methodology#eci"
										className="link"
									>
										ECI
								</a>{' '} see the {' '}
									<a
										href="/en/resources/methodology#eci"
										className="link"
									>
										Methodology section
								</a>{' '} in the OEC Academy.
							</p>
							</div>
						</div>
					</div>
				)}
				{type === 'legacy' && (
					<div>
						<h1 className="title">{title}</h1>
						<div className="about">
							<div className="paragraph">
								<p>
									The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product.
							</p>
								<p>
									ECI and PCI values are estimated directly from matrices summarizing the geography of economic activity, and can be calculated on demand.
							</p>
							</div>
							<div className="paragraph">
								<p>
									Formally, the complexity of location (ECI) is a function of the complexity of the activities present in it. Similarly, the complexity of an activity (PCI) is a function of the complexities of the locations where that activity is present.
							</p>
								<p>
									For details about the methodology see the {' '}
									<a
										href="/en/resources/methodology#eci"
										className="link"
									>
										Methodology section
								</a>{' '} in the OEC Academy.
							</p>
							</div>
						</div>
						{subtitle === "eci" ? (
							<p className="italic">
								These are the rankings of the OEC 3.0 version for the {' '}
								<a
									href="https://oec.world/en/rankings/country/eci/"
									className="link"
								>
									Economic Complexity Index
								</a>{' '}.
							</p>
						) : (
								<p className="italic">
									These are the rankings of the OEC 3.0 version for the {' '}
									<a
										href="https://oec.world/en/rankings/product/sitc/"
										className="link"
									>
										Product Complexity Index
								</a>.
								</p>
							)}
					</div>
				)}
				{type === 'dynamic' && (
					<div>
						<h1 className="title">Custom Rankings</h1>
						<div className="about">
							<p>
								This section allows users to calculate ECI and PCI rankings directly from the data.
								Users can select the trade data source (e.g. HS92, HS12), depth level (4, 6 digit), and
								the countries and products used in the calculation, by setting thresholds for the
								minimum amount of exports, and population.
							</p>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default RankingText;
