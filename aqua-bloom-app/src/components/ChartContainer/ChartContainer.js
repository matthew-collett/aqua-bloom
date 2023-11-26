import CanvasJSReact from '@canvasjs/react-charts';

export default function ChartContainer(data) {
  const options = {
    title: {
      text: "Location vs Probability"
    },
    data: [{
      type: "column",
      dataPoints: [
        { label: "Apple", y: 10 },
        { label: "Orange", y: 15 },
        { label: "Banana", y: 25 },
        { label: "Mango", y: 30 },
        { label: "Grape", y: 28 }
      ]
    }]
  }

  return (
    <div>
      <CanvasJSReact.CanvasJSChart options={options}
      /* onRef = {ref => this.chart = ref} */
      />
    </div>
  );
}
