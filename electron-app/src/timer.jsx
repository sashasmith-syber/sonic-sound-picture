
class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { seconds: 0 };
	}

		async tick() {
			const result = await window.myAPI.x({
				f: (msg) => {
					logger.debug('[KYŌGA] Timer tick:', msg)
			}
		});
		this.setState(state => ({
			seconds: result
		}));
	}

	componentDidMount() {
		this.interval = setInterval(() => this.tick(), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div>
				Seconds: {this.state.seconds}
			</div>
		);
	}
}

