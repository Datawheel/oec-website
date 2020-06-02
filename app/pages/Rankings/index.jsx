import React, {Component} from 'react';
import {hot} from 'react-hot-loader/root';
import './index.css';

import OECNavbar from '../../components/OECNavbar';
import Footer from '../../components/Footer';
import Error from '../../components/Error';

import Static from './Static';
import Custom from './Custom';
import Legacy from './Legacy';

class Rankings extends Component {
	render() {
		const {page, depth, rev} = this.props.router.params;

		return (
			<div>
				<OECNavbar />
				{(function () {
					switch (page) {
						case 'eci':
							return <Static type={page} depth={depth} rev={rev} />;
						case 'pci':
							return <Static type={page} depth={depth} rev={rev} />;
						case 'legacy_eci':
							return <Legacy type={"eci"} depth={depth} rev={rev} />;
						case 'legacy_pci':
							return <Legacy type={"pci"} depth={depth} rev={rev} />;
						case 'country':
							return <Legacy type={"eci"} depth={depth} rev={rev} />;
						case 'product':
							return <Legacy type={"pci"} depth={depth} rev={rev} />;
						case 'custom':
							return <Custom />;
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
