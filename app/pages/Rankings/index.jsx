import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import './index.css';

import OECNavbar from '../../components/OECNavbar';
import Footer from '../../components/Footer';
import Error from '../../components/Error';

import ECI from './ECI';
import PCI from './PCI';
import Custom from './Custom';
import Legacy from './Legacy';

class Rankings extends Component {
	render() {
		const { page, depth, rev } = this.props.router.params;
		console.log(depth, rev);

		return (
			<div>
				<OECNavbar />
				{(function() {
					switch (page) {
						case 'eci':
							return <ECI />;
						case 'pci':
							return <PCI />;
						case 'custom':
							return <Custom />;
						case 'legacy':
							return <Legacy />;
						default:
							return <Error />;
					}
				})()}
				<Footer />
			</div>
		);
	}
}

export default hot(Rankings);
