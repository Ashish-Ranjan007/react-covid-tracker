import {
	Card,
	CardContent,
	FormControl,
	MenuItem,
	Select,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import Infobox from './Infobox';
import Table from './Table';
import Map from './Map';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({
		lat: 34.80746,
		lng: -40.4796,
	});
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState('cases');

	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then((response) => response.json())
			.then((data) => setCountryInfo(data));
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			fetch('https://disease.sh/v3/covid-19/countries')
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					const sortedData = sortData(data);
					setCountries(countries);
					setMapCountries(data);
					setTableData(sortedData);
				});
		};
		getCountriesData();
	}, []);

	const onCountryChange = async (e) => {
		const countryCode = e.target.value;
		setCountry(countryCode);
		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);
				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>Covid-19 Tracker</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							value={country}
							onChange={onCountryChange}
						>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => {
								return (
									<MenuItem value={country.value}>
										{country.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					<Infobox
						onClick={(e) => setCasesType('cases')}
						title="Coronavirus cases"
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={countryInfo.cases}
					/>
					<Infobox
						onClick={(e) => setCasesType('recovered')}
						title="Recovered"
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={countryInfo.recovered}
					/>
					<Infobox
						onClick={(e) => setCasesType('deaths')}
						title="Deaths"
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={countryInfo.deaths}
					/>
				</div>

				<Map
					casesType={casesType}
					center={mapCenter}
					zoom={mapZoom}
					countries={mapCountries}
				/>
			</div>
			<Card className="app__right">
				<CardContent>
					<h3>Live cases by country</h3>
					<Table countries={tableData} />
					<h3>Woldwide new {casesType}</h3>
					<LineGraph casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
