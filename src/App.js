import './App.css';
import './InfoBox.css';
import 'leaflet/dist/leaflet.css';
import {
    MenuItem,
    FormControl,
    Select,
    Menu,
    Card,
    CardContent
} from "@material-ui/core";
import {useEffect, useState} from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {prettyPrintStat, sortData} from "./util";
import Linegraph from "./Linegraph";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState('cases');

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then(response => response.json())
            .then(data => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map(country => ({
                        name: country.country,
                        value: country.countryInfo.iso2
                    }));

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data);
                    setCountries(countries);
                });
        };

        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url =
          countryCode === 'worldwide'
            ? 'https://disease.sh/v3/covid-19/all'
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                countryCode !== 'worldwide' && setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };

    return (
        <div className="app">
            <div className="app__left">
                 <div className="app__header">
                     <h1>COVID-19 TRACKER</h1>
                     <FormControl className="app__dropdown">
                         <Select
                             variants="outlined"
                             onChange={onCountryChange}
                             value={country}
                         >
                             <MenuItem value="worldwide">Worldwide</MenuItem>
                             {
                                 countries.map(country => (
                                     <MenuItem
                                         value={country.value}
                                     >{country.name}</MenuItem>
                                 ))
                             }
                         </Select>
                     </FormControl>
                 </div>

                <div className="app__stats">
                  <InfoBox
                      isRed
                      title="Coronavirus Cases"
                      active={casesType==='cases'}
                      cases={prettyPrintStat(countryInfo.todayCases)}
                      total={prettyPrintStat(countryInfo.cases)}
                      onClick={e => setCasesType('cases')}
                  />
                  <InfoBox
                      title="Recovered"
                      active={casesType==='recovered'}
                      cases={prettyPrintStat(countryInfo.todayRecovered)}
                      total={prettyPrintStat(countryInfo.recovered)}
                      onClick={e => setCasesType('recovered')}
                  />
                  <InfoBox
                      isRed
                      title="Deaths"
                      active={casesType==='deaths'}
                      cases={prettyPrintStat(countryInfo.todayDeaths)}
                      total={prettyPrintStat(countryInfo.deaths)}
                      onClick={e => setCasesType('deaths')}
                  />
                </div>
                <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                    casesType={casesType}
                />
            </div>

            <div>
               <Card className="app__right">
                   <CardContent>
                       <h3>Live Cases by Country</h3>
                       <Table
                           countries={tableData}
                       />
                       <h3>Wordlwide new {casesType}</h3>
                       <Linegraph
                           className="app__graph"
                           casesType={casesType}
                       />
                   </CardContent>
               </Card>
            </div>
        </div>
    );
}

export default App;
