import icon from './assets/icon.svg';
import './App.css';

import { useState } from 'react'

import ActionButton from './components/ActionButton';
import LoadingSpinner from './components/LoadingSpinner';

import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import CanvasJSReact from '@canvasjs/react-charts';


function App() {
  let fileReader

  const [showCharts, setShowCharts] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locVsProbChart, setlocVsProbChart] = useState({})

  const ProcessData = (e) => {
    const data = fileReader.result;
    const dataObj = JSON.parse(data);

    let arr = [];
    for (let entry in dataObj)
    {
      arr.push({ label: entry.ID,  y: (entry.Probability * 10)  })
    }
    
    setlocVsProbChart({
      title: {
        text: "Location ID vs. Probability"
      },
      data: [{
        type: "column",
        dataPoints: arr,
      }]
    })

    setShowCharts(true)
    setIsLoading(false)
  }

  const DownloadData = (file) => {
    setIsLoading(true)
    fileReader = new FileReader();
    fileReader.onloadend = ProcessData;
    fileReader.readAsText(file);
  }

  return (
    <div className='App'>
      <header className="App-header">
        {(() => {
          if (isLoading) {
            return (
              <LoadingSpinner />
            )
          }
          else {
            if (!showCharts) {
              return (
                <div>
                  <img src={icon} className="App-logo" alt="Aqua-Bloom Logo" />
                  <h3>Aqua-Bloom</h3>
                  <FormControl variant="standard">
                    <InputLabel htmlFor="data-file-input">
                      Upload data as JSON file
                    </InputLabel>
                    <Input
                      id="data-file-input"
                      type="file"
                      className="input-file"
                      accept=".json"
                      startAdornment={
                        <InputAdornment position="start">
                          <DownloadIcon style={{ color: '#38b6ff' }} sx={{ fontSize: 25 }} />
                        </InputAdornment>
                      }
                      onChange={e => DownloadData(e.target.files[0])}
                    />
                  </FormControl>
                </div>
              )
            }
            else {
              return (
                <CanvasJSReact.CanvasJSChart options={locVsProbChart} />

              )
            }
          }
        })()}
      </header>
    </div>
  )
}

export default App;
