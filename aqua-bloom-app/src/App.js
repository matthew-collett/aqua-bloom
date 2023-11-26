import icon from './assets/icon.svg';
import './App.css';

import { useState } from 'react'

import axios from 'axios';

import LoadingSpinner from './components/LoadingSpinner';

import DownloadIcon from '@mui/icons-material/Download';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import CanvasJSReact from '@canvasjs/react-charts';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const baseUrl = "http://localhost:5000/api"

function App() {
  let fileReader

  const [showCharts, setShowCharts] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locVsProbChart, setlocVsProbChart] = useState({})
  const [existVsNot, setExistVsNot] = useState({})

  const ProcessData = (data) => {
    // const data = fileReader.result;
    const dataObj = JSON.parse(data);

    let locVsProbChartData = [];
    let nExist = 0;
    for (var i = 0; i < dataObj.length; i++) {
      var entry = dataObj[i]

      locVsProbChartData.push({ label: entry['ID'], y: entry['Probability'] })

      if (entry['Exists'] === 1) {
        nExist++;
      }
    }

    setlocVsProbChart({
      title: {
        text: "Location ID vs. Blue-Green Algae Growth Probability"
      },
      data: [{
        type: "column",
        dataPoints: locVsProbChartData,
      }]
    })

    setExistVsNot({
      title: {
        text: "Existance of Blue-Green Algae"
      },
      data: [{
        type: "pie",
        yValueFormatString: "##0",
        indexLabel: "{label} {y}",
        dataPoints: [
          { y: nExist, label: "Exist" },
          { y: dataObj.length - nExist, label: "Not Exist" }
        ]
      }]
    })

    setShowCharts(true)
    setIsLoading(false)
  }

  const DownloadData = (file) => {
    setIsLoading(true)
    // fileReader = new FileReader();
    // fileReader.onloadend = ProcessData;
    // fileReader.readAsText(file);
    let formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:5000/api/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((resp) => {
        if (resp.status === 200) {
          ProcessData(resp.data)
        }
      })
  }

  return (
    <div className='App'>
      {(() => {
        if (isLoading) {
          return (
            <LoadingSpinner />
          )
        }
        else {
          if (!showCharts) {
            return (
              <header className="App-header">
                <img src={icon} className="App-logo" alt="Aqua-Bloom Logo" />
                <h3>Aqua-Bloom</h3>
                <FormControl variant="standard">
                  <InputLabel htmlFor="data-file-input">
                    Upload data as CSV file
                  </InputLabel>
                  <Input
                    id="data-file-input"
                    type="file"
                    className="input-file"
                    accept=".csv"
                    startAdornment={
                      <InputAdornment position="start">
                        <DownloadIcon style={{ color: '#38b6ff' }} sx={{ fontSize: 25 }} />
                      </InputAdornment>
                    }
                    onChange={e => DownloadData(e.target.files[0])}
                  />
                </FormControl>
              </header>
            )
          }
          else {
            return (
              <Container>
                <Row>
                  <Col>
                    <CanvasJSReact.CanvasJSChart options={existVsNot} />
                  </Col>
                  <Col>
                    <CanvasJSReact.CanvasJSChart options={locVsProbChart} />
                  </Col>
                </Row>
              </Container>
            )
          }
        }
      })()}
    </div>
  )
}

export default App;
