import React, {Component} from 'react';

class RankingText extends Component {
	render() {
		const {type, title} = this.props;
		return (
			<div className="ranking-text">
				{type === 'static' && (
					<div>
						<h1 className="title">{title}</h1>
						<div className="about">
							<p>
								The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product.
							</p>
							<p>
								ECI and PCI values are estimated directly from matrices summarizing the geography of economic activity, and can be calculated on demand.
							</p>
							<p>
								Formally, the complexity of location (ECI) is a function of the complexity of the activities present in it. Similarly, the complexity of an activity (PCI) is a function of the complexities of the locations where that activity is present.
							</p>
							<p>
								For details about the methodology see the {' '}
								<a
									href="/en/resources/definitions"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
								>
									Definitions section
								</a>{' '} in the OEC Academy.
							</p>
						</div>
					</div>
				)}
				{type === 'legacy' && (
					<div>
						<h1 className="title">{title}</h1>
						<div className="about">
							<p>
								The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product.
							</p>
							<p>
								ECI and PCI values are estimated directly from matrices summarizing the geography of economic activity, and can be calculated on demand.
							</p>
							<p>
								Formally, the complexity of location (ECI) is a function of the complexity of the activities present in it. Similarly, the complexity of an activity (PCI) is a function of the complexities of the locations where that activity is present.
							</p>
							<p>
								These are the rankings of the OEC 3.0 version for {' '}
								<a
									href="https://oec.world/en/rankings/country/eci/"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
								>
									Economic Complexity
								</a>{' '} and {' '}
								<a
									href="https://oec.world/en/rankings/product/sitc/"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
								>
									Product Complexity
								</a>.
							</p>
							<p>
								For details about the methodology see the {' '}
								<a
									href="/en/resources/definitions"
									className="link"
									target="_blank"
									rel="noopener noreferrer"
								>
									Definitions section
								</a>{' '} in the OEC Academy.
							</p>
						</div>
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
